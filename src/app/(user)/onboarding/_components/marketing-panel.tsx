import Image from "next/image";
import { MarketingBullet } from "@/app/(user)/onboarding/_components/marketing-bullet";
import { DateTime } from "luxon";

export function MarketingPanel() {
  return (
    <div className="from-primary-300 to-primary-400 h-full w-full bg-gradient-to-b p-10 text-neutral-50">
      <div className="flex h-full flex-col justify-between gap-12">
        <Image src="/assets/images/logo-white-transparent-w78-h32.png" alt="Loonas Logo" width={78} height={32} />
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <span className="text-base leading-6 font-normal text-neutral-50">Selamat datang di Loonas</span>
            <span className="text-base leading-6 font-normal text-neutral-50/90">
              Platform manajemen keuangan digital terpercaya untuk individu dan bisnis di Indonesia.
            </span>
            <span className="text-base leading-6 font-normal text-neutral-50/70">
              Bergabunglah dengan lebih dari <span className="text-neutral-50">50.000+ pengguna</span> yang telah
              mempercayai Loonas.
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <MarketingBullet
              iconPath="/assets/images/shield-icon-w16-h16.svg"
              title="Keamanan data terjamin dengan enkripsi"
            />
            <MarketingBullet
              iconPath="/assets/images/thunder-icon-w16-h16.svg"
              title="Proses verifikasi cepat 3 hari kerja"
            />
            <MarketingBullet
              iconPath="/assets/images/analytic-icon-w16-h16.svg"
              title="Akses fitur premium untuk bisnis Anda"
            />
          </div>
          <div className="flex flex-row justify-between gap-5 border-t border-t-neutral-50/20 py-5">
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-3xl leading-10 font-semibold text-neutral-50">50K+</div>
              <div className="text-xs leading-4 font-normal text-neutral-50/70">Pengguna Aktif</div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-3xl leading-10 font-semibold text-neutral-50">99.9%</div>
              <div className="text-xs leading-4 font-normal text-neutral-50/70">Uptime</div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-3xl leading-10 font-semibold text-neutral-50">4.9/5</div>
              <div className="text-xs leading-4 font-normal text-neutral-50/70">Rating</div>
            </div>
          </div>
        </div>
        <div className="flex flex-row border-t border-t-neutral-50/20 pt-6">
          <span className="text-xs leading-4 font-normal text-neutral-50/60">
            © &nbsp;{DateTime.now().year}&nbsp;Loonas.
          </span>
        </div>
      </div>
    </div>
  );
}
