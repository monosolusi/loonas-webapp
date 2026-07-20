import { SectionCard } from "@/core/presentations/components/section-card";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { ProductType, ProductTypeLabel, ProductTypeType } from "@/features/product/domain/enums/product-type";
import { ProductionMode, ProductionModeLabel, ProductionModeType } from "@/features/product/domain/enums/production-mode";
import { CategorySelect } from "@/app/(authenticated)/products/_components/category-select";

const TYPE_OPTIONS: SearchComboboxOption[] = Object.values(ProductType).map((value) => ({
  id: value,
  label: ProductTypeLabel[value as ProductTypeType],
}));

const PRODUCTION_MODE_OPTIONS: SearchComboboxOption[] = Object.values(ProductionMode).map((value) => ({
  id: value,
  label: ProductionModeLabel[value as ProductionModeType],
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

  const selectedType = TYPE_OPTIONS.find((o) => o.id === type) ?? null;
  const selectedMode = isManufactured ? (PRODUCTION_MODE_OPTIONS.find((o) => o.id === productionMode) ?? null) : null;

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
        <SearchCombobox
          label="Tipe Produk"
          tooltip={TYPE_TOOLTIP}
          options={TYPE_OPTIONS}
          value={selectedType}
          onChange={(opt) => {
            if (opt) handleTypeChange(opt.id);
          }}
          placeholder="Pilih tipe produk"
        />
        <SearchCombobox
          label="Mode Produksi"
          tooltip={PRODUCTION_MODE_TOOLTIP}
          options={PRODUCTION_MODE_OPTIONS}
          value={selectedMode}
          onChange={(opt) => onProductionModeChange(opt ? opt.id : null)}
          disabled={!isManufactured}
          placeholder={!isManufactured ? "Tidak Digunakan" : "Pilih mode produksi"}
        />
        <div className="flex flex-col gap-y-1">
          <span className="text-base">Kategori</span>
          <CategorySelect value={categoryId} onChange={onCategoryChange} />
        </div>
      </div>
    </SectionCard>
  );
}
