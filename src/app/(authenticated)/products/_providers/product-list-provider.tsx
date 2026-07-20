"use client";

import { createContext, useContext, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useListProducts } from "@/features/product/presentations/hooks/use-list-products";
import { useUpdateProduct } from "@/features/product/presentations/hooks/use-update-product";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";

type ProductListContextValue = {
  products: ProductEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: boolean;
  page: number;
  search: string;
  selectedTypes: string[];
  selectedCategories: string[];
  blockedDialogOpen: boolean;
  blockedVariants: string[];
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setSelectedTypes: (values: string[]) => void;
  setSelectedCategories: (values: string[]) => void;
  setBlockedDialogOpen: (open: boolean) => void;
  handleFilterChange: () => void;
  handleToggleActive: (productId: string, active: boolean) => Promise<void>;
  handleToggleBlocked: (missingVariants: string[]) => void;
};

const ProductListContext = createContext<ProductListContextValue | null>(null);

export function useProductList() {
  const context = useContext(ProductListContext);
  if (!context) throw new Error("useProductList must be used within ProductListProvider");
  return context;
}

type ProductListProviderProps = {
  children: React.ReactNode;
};

export function ProductListProvider({ children }: ProductListProviderProps) {
  const [page, setPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [blockedDialogOpen, setBlockedDialogOpen] = useState(false);
  const [blockedVariants, setBlockedVariants] = useState<string[]>([]);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { trigger: updateProduct } = useUpdateProduct();
  const { showToast } = useToast();

  const { products, meta, loading, error } = useListProducts({
    page,
    limit: DEFAULT_PAGE_SIZE,
    type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
    categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    search: searchQuery,
  });

  const handleFilterChange = () => setPage(1);

  const handleToggleActive = async (productId: string, active: boolean) => {
    try {
      await updateProduct({ id: productId, active });
      await revalidateSWRKey(PRODUCT_SWR_KEYS.LIST_PRODUCTS);
      showToast(active ? "Produk diaktifkan" : "Produk dinonaktifkan", "success");
    } catch (err) {
      showToast("Gagal mengubah status produk", "error");
      throw err;
    }
  };

  const handleToggleBlocked = (missingVariants: string[]) => {
    setBlockedVariants(missingVariants);
    setBlockedDialogOpen(true);
  };

  return (
    <ProductListContext.Provider
      value={{
        products,
        meta,
        loading,
        error: !!error,
        page,
        search,
        selectedTypes,
        selectedCategories,
        blockedDialogOpen,
        blockedVariants,
        setPage,
        setSearch,
        setSelectedTypes,
        setSelectedCategories,
        setBlockedDialogOpen,
        handleFilterChange,
        handleToggleActive,
        handleToggleBlocked,
      }}
    >
      {children}
    </ProductListContext.Provider>
  );
}
