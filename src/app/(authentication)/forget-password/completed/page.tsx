import Image from "next/image";
import Link from "next/link";
import { FeatureItem } from "@/app/(authentication)/sign-in/_components/feature-item";
import { RegisterButton } from "@/app/(authentication)/sign-in/_components/register-button";

export default function ForgetPasswordCompletedPage() {
  return (
    <div className="flex h-full flex-row">
      <div className="flex w-1/2 flex-col justify-center px-24">
        <Image src="/assets/images/logo-w165-h48.png" alt="Loonas Logo" width={165} height={48} />
        <div className="mt-10 flex flex-col gap-2">
          <span className="text-base font-medium">Kata Sandi Berhasil Diubah</span>
          <span className="text-base text-neutral-600">
            Kata sandi Anda telah berhasil diperbarui. Silakan masuk dengan kata sandi baru Anda.
          </span>
        </div>
        <div className="mt-8">
          <Link
            href="/sign-in"
            className="bg-primary-300 hover:bg-primary-300/90 inline-block rounded-lg px-6 py-3 text-base font-medium text-white transition-colors duration-200"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
      <div className="hidden w-1/2 flex-col items-center justify-center p-12 md:flex">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
          <Image
            src="/assets/images/hero-w544-h624.png"
            alt="Hero Image"
            width={544}
            height={624}
            className="absolute inset-0 z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-black/0" />
          <div className="relative z-20 flex h-full flex-col items-start justify-between p-10">
            <div className="flex flex-1 flex-col items-start gap-6">
              <div className="rounded-full border border-white/20 bg-white/20 px-4 py-2.5 text-base text-white">
                ✨ Platform Bisnis Modern
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xl font-medium text-white">Kelola Bisnis Anda dengan Lebih Efisien</span>
                <span className="text-base text-white/90">
                  Solusi terpadu untuk operasional, inventori, dan keuangan dalam satu platform
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <FeatureItem
                  iconPath="/assets/images/analytic-icon-w16-h16.svg"
                  label="Pantau pertumbuhan real-time"
                />
                <FeatureItem iconPath="/assets/images/shield-icon-w16-h16.svg" label="Keamanan data terjamin" />
                <FeatureItem iconPath="/assets/images/thunder-icon-w16-h16.svg" label="Otomasi proses bisnis" />
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col items-start gap-1">
                <span className="text-lg font-medium text-white">Belum punya akun?</span>
                <span className="text-base text-white/80">Daftar dan mulai kelola bisnis Anda</span>
              </div>
              <div className="flex flex-1 flex-row">
                <RegisterButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
