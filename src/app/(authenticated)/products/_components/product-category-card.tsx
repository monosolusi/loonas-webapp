import { SectionCard } from "@/core/presentations/components/section-card";
import { SelectInput } from "@/core/presentations/components/select-input";
import { ProductType, ProductTypeLabel, ProductTypeType } from "@/features/product/domain/enums/product-type";
import { ProductionMode, ProductionModeLabel, ProductionModeType } from "@/features/product/domain/enums/production-mode";
import { CategorySelect } from "@/app/(authenticated)/products/_components/category-select";

const TYPE_OPTIONS = Object.values(ProductType).map((value) => ({
  label: ProductTypeLabel[value as ProductTypeType],
  value,
}));

const PRODUCTION_MODE_OPTIONS = Object.values(ProductionMode).map((value) => ({
  label: ProductionModeLabel[value as ProductionModeType],
  value,
}));

const TYPE_TOOLTIP = (
  <ul className="flex flex-col gap-y-1.5">
    <li>
      <span className="font-semibold">Produk Olahan</span> — diolah dari bahan baku, punya resep
    </li>
    <li>
      <span className="font-semibold">Barang Dagang</span> — dibeli dan dijual langsung
    </li>
    <li>
      <span className="font-semibold">Jasa</span> — layanan tanpa inventori fisik
    </li>
  </ul>
);

const PRODUCTION_MODE_TOOLTIP = (
  <ul className="flex flex-col gap-y-1.5">
    <li>
      <span className="font-semibold">Produksi Batch</span> — diproduksi dalam batch, disimpan sebagai stok (contoh:
      roti, kue)
    </li>
    <li>
      <span className="font-semibold">Dibuat Saat Order</span> — dibuat langsung saat customer pesan (contoh: nasi
      goreng, kopi)
    </li>
  </ul>
);

type ProductCategoryCardProps = {
  type: string;
  productionMode: string | null;
  categoryId: string | undefined;
  onTypeChange: (type: string) => void;
  onProductionModeChange: (productionMode: string | null) => void;
  onCategoryChange: (categoryId: string | undefined) => void;
};

export function ProductCategoryCard({
  type,
  productionMode,
  categoryId,
  onTypeChange,
  onProductionModeChange,
  onCategoryChange,
}: ProductCategoryCardProps) {
  const isManufactured = type === ProductType.MANUFACTURED;

  const handleTypeChange = (newType: string) => {
    onTypeChange(newType);
    if (newType === ProductType.MANUFACTURED) {
      if (!productionMode) onProductionModeChange(ProductionMode.BATCH);
    } else {
      onProductionModeChange(null);
    }
  };

  return (
    <SectionCard title="Klasifikasi" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <SelectInput label="Tipe Produk" tooltip={TYPE_TOOLTIP} value={type} options={TYPE_OPTIONS} onChange={handleTypeChange} />
        <SelectInput
          label="Mode Produksi"
          tooltip={PRODUCTION_MODE_TOOLTIP}
          value={isManufactured ? (productionMode ?? "") : ""}
          options={PRODUCTION_MODE_OPTIONS}
          onChange={(val) => onProductionModeChange(val || null)}
          disabled={!isManufactured}
          placeholder={!isManufactured ? "Tidak Digunakan" : undefined}
        />
        <div className="flex flex-col gap-y-1">
          <span className="text-base">Kategori</span>
          <CategorySelect value={categoryId} onChange={onCategoryChange} />
        </div>
      </div>
    </SectionCard>
  );
}
