"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useCreateProduct } from "@/features/product/presentations/hooks/use-create-product";
import { useUploadProductPhoto } from "@/features/product/presentations/hooks/use-upload-product-photo";
import { useProductFormState } from "@/features/product/presentations/hooks/use-product-form-state";
import { RecipeRow } from "@/app/(authenticated)/products/_components/recipe-form-dialog";
import { VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";
import { buildVariantParams, resolveVariantRows } from "@/app/(authenticated)/products/create/_utils/build-variant-params";

type ProductCreateContextValue = {
  form: ReturnType<typeof useProductFormState>;
  isMutating: boolean;
  variantRows: VariantFormRow[];
  recipes: Map<string, RecipeRow[]>;
  setVariantRecipe: (variantKey: string, items: RecipeRow[]) => void;
  getVariantRecipe: (variantKey: string) => RecipeRow[];
  handleSubmit: () => Promise<void>;
};

const ProductCreateContext = createContext<ProductCreateContextValue | null>(null);

export function useProductCreate() {
  const context = useContext(ProductCreateContext);
  if (!context) throw new Error("useProductCreate must be used within ProductCreateProvider");
  return context;
}

type ProductCreateProviderProps = {
  children: React.ReactNode;
};

export function ProductCreateProvider({ children }: ProductCreateProviderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { trigger: createProduct, isMutating: isCreating } = useCreateProduct();
  const { trigger: uploadPhoto } = useUploadProductPhoto();

  const form = useProductFormState();
  const [recipes, setRecipes] = useState<Map<string, RecipeRow[]>>(new Map());
  const [isUploading, setIsUploading] = useState(false);

  const isMutating = isCreating || isUploading;

  const variantRows = useMemo(
    () => resolveVariantRows({ hasVariants: form.hasVariants, variants: form.variants, singlePrice: form.singlePrice }),
    [form.hasVariants, form.variants, form.singlePrice],
  );

  const setVariantRecipe = (variantKey: string, items: RecipeRow[]) => {
    setRecipes((prev) => new Map(prev).set(variantKey, items));
  };

  const getVariantRecipe = (variantKey: string): RecipeRow[] => {
    return recipes.get(variantKey) ?? [];
  };

  const handleSubmit = async () => {
    if (!form.isValid() || isMutating) return;

    const isManufactured = form.type === ProductType.MANUFACTURED;

    const variantParams = buildVariantParams({ rows: variantRows, isManufactured, recipes });

    try {
      const product = await createProduct({
        name: form.name.trim(),
        sku: form.sku.trim(),
        type: form.type,
        productionMode: form.productionMode,
        active: form.active,
        categoryId: form.categoryId,
        variants: variantParams,
      });

      if (form.photos.length > 0) {
        setIsUploading(true);
        for (const file of form.photos) {
          await uploadPhoto({ productId: product.id, file });
        }
        setIsUploading(false);
      }

      await revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      showToast("Produk berhasil ditambahkan");
      router.push(`/products/${product.id}`);
    } catch {
      setIsUploading(false);
      showToast("Gagal menambahkan produk", "error");
    }
  };

  return (
    <ProductCreateContext.Provider
      value={{ form, isMutating, variantRows, recipes, setVariantRecipe, getVariantRecipe, handleSubmit }}
    >
      {children}
    </ProductCreateContext.Provider>
  );
}
