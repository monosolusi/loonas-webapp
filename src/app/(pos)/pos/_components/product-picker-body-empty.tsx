type ProductPickerBodyEmptyProps = {
  isDrilldown: boolean;
};

export function ProductPickerBodyEmpty({ isDrilldown }: ProductPickerBodyEmptyProps) {
  return (
    <div className="flex h-32 items-center justify-center text-sm text-neutral-300">
      {isDrilldown ? "Tidak ada varian cocok." : "Tidak ada produk cocok."}
    </div>
  );
}
