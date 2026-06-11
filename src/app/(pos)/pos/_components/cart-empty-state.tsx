import Image from "next/image";

export function CartEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2 px-6 py-12 text-center">
      <Image src="/assets/images/cart-icon-neutral-200-w40-h40.svg" alt="" width={40} height={40} aria-hidden />
      <span className="text-sm font-medium text-neutral-400">Keranjang masih kosong</span>
      <span className="text-xs text-neutral-300">Pilih produk dari katalog di sebelah kiri</span>
    </div>
  );
}
