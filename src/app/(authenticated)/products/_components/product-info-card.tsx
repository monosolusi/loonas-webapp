import { SectionCard } from "@/core/presentations/components/section-card";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";

type ProductInfoCardProps = {
  name: string;
  sku: string;
  onNameChange: (value: string) => void;
  onSkuChange: (value: string) => void;
};

export function ProductInfoCard({ name, sku, onNameChange, onSkuChange }: ProductInfoCardProps) {
  return (
    <SectionCard title="Informasi Produk" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <TextInput label="Nama Produk" placeholder="Masukkan nama produk" value={name} onChange={onNameChange} required />
        <TextInput label="SKU" placeholder="Masukkan SKU produk" value={sku} onChange={onSkuChange} required />
      </div>
    </SectionCard>
  );
}
