export function CartEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2 px-6 py-12 text-center">
      <span className="text-3xl leading-none text-neutral-200" aria-hidden>
        ⌐
      </span>
      <span className="text-sm font-medium text-neutral-400">Keranjang masih kosong</span>
      <span className="text-xs text-neutral-300">Pilih produk dari katalog di sebelah kiri</span>
    </div>
  );
}
