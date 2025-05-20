import { Player } from "@lottiefiles/react-lottie-player";
import EmptySearch from "@/app/(authenticated)/invoices/_static-files/empty-search.json";
import React from "react";

export function EmptyInvoiceState() {
  return (
    <div className="w-full py-6 border border-gray-300 rounded-lg border-dashed">
      <div className="flex align-center justify-center">
        <div className="h-34 w-35">
          <Player autoplay loop src={EmptySearch} />
        </div>
      </div>
      <div className="text-center w-1/2 pb-6 mx-auto">
        <p className="font-bold">
          Belum ada faktur yang dibuat nih!
        </p>
        <p className="text-sm text-gray-500">
          Yuk, mulai buat faktur pertamamu sekarang dan nikmati kemudahan kelola pembayaran di Loonas. Klik tombol di
          "Faktur Baru"" untuk bikin faktur dengan cepat dan gampang!
        </p>
      </div>
    </div>
  );
}
