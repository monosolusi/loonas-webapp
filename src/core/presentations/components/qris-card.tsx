import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";

const QRIS_LOGO_URL =
  "https://res.cloudinary.com/monosolusi/image/upload/v1760171194/loonas/web-assets/quick-response-code-indonesia-standard-qris-seeklogo_lxox7l.png";
const GPN_LOGO_URL =
  "https://res.cloudinary.com/monosolusi/image/upload/v1760188238/loonas/web-assets/Gerbang_Pembayaran_Nasional_logo_baa0h3.svg";

type QrisCardProps = {
  qrString: string;
  merchantName: string;
  serialCode: string;
  /** QR code pixel size. Defaults to 256. */
  size?: number;
  /**
   * `"card"` (default) is the standalone bordered card used in the payment wizard.
   * `"bare"` drops the border, background, corner accents, caption and serial so the QR
   * presentation can sit directly on another surface (e.g. a modal) without nesting cards.
   */
  variant?: "card" | "bare";
};

export function QrisCard({ qrString, merchantName, serialCode, size = 256, variant = "card" }: QrisCardProps) {
  const bare = variant === "bare";

  return (
    <div
      className={clsx(
        "relative",
        bare ? "w-full" : "overflow-hidden rounded-lg border border-neutral-200 bg-white p-6",
      )}
    >
      {!bare && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute top-[25%] left-[-25%] h-[220px] w-[220px] rotate-45 bg-[#ED1C24]"></div>
          <div className="absolute right-[-25%] bottom-[-25%] h-[280px] w-[280px] rotate-45 bg-[#ED1C24]"></div>
        </div>
      )}

      <div className={clsx("relative z-10 flex flex-col", bare ? "items-center gap-y-4" : "gap-y-8")}>
        <div className="flex w-full flex-row items-center justify-between">
          <img src={QRIS_LOGO_URL} alt="QRIS" className={bare ? "h-8" : "h-10"} />
          <img src={GPN_LOGO_URL} alt="GPN" className={bare ? "h-9" : "h-12"} />
        </div>
        <div className={clsx("text-center font-semibold", bare ? "line-clamp-2 text-lg" : "text-xl")}>
          {merchantName}
        </div>
        <div className="flex flex-col items-center gap-y-4">
          <div className="bg-white p-2">
            <QRCodeSVG value={qrString} size={size} />
          </div>
          {!bare && (
            <div className="flex flex-col gap-y-1 text-center">
              <div className="uppercase">SATU QRIS Untuk Semua</div>
              <div className="text-sm">Cek aplikasi penyelenggara</div>
              <div className="text-sm">Di: www.aspi-qris.id</div>
            </div>
          )}
        </div>
        {!bare && (
          <div className="flex flex-col gap-y-1">
            <div className="text-sm text-neutral-300">Kode Serial:</div>
            <div className="text-sm text-neutral-300">{serialCode}</div>
          </div>
        )}
      </div>
    </div>
  );
}
