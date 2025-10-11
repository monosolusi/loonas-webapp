import { Card } from "@/core/presentations/components/card";
import { QRCodeSVG } from "qrcode.react";

export function QrisPayInDetailBox() {
  return (
    <Card className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-[25%] left-[-25%] h-[220px] w-[220px] rotate-45 bg-[#e7413a]"></div>
        <div className="absolute right-[-25%] bottom-[-25%] h-[250px] w-[250px] rotate-45 bg-[#e7413a]"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-1 flex-row items-center justify-between">
            <img
              src="https://res.cloudinary.com/monosolusi/image/upload/v1760171194/loonas/web-assets/quick-response-code-indonesia-standard-qris-seeklogo_lxox7l.png"
              className="h-10"
            />
            <img
              src="https://res.cloudinary.com/monosolusi/image/upload/v1760188238/loonas/web-assets/Gerbang_Pembayaran_Nasional_logo_baa0h3.svg"
              className="h-12"
            />
          </div>
          <div className="text-center text-xl font-semibold">PT. Tumbuh Adidaya Perkasa</div>
          <div className="flex flex-col items-center gap-y-4">
            <div className="bg-white p-2">
              <QRCodeSVG value="some-random-text" size={256} />
            </div>
            <div className="flex flex-col gap-y-1 text-center">
              <div className="uppercase">SATU QRIS Untuk Semua</div>
              <div className="text-sm">Cek aplikasi penyelenggara</div>
              <div className="text-sm">Di: www.aspi-qris.id</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
