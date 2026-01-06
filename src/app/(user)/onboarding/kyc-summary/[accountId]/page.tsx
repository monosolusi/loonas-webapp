import { StepHeader } from "@/app/(user)/onboarding/_components/step-header";
import Image from "next/image";
import { StatusBoxImpl } from "@/app/(user)/onboarding/kyc-summary/[accountId]/_components/status-box-impl";

export default function KycSummaryPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <StepHeader title="Status Verifikasi KYC" description="Terima kasih! Kami sedang memproses verifikasi Anda" />
      <div className="flex w-full flex-col gap-8">
        {/*  Status Box */}
        <StatusBoxImpl />

        {/*  Account Type Card */}
        <div className="flex flex-row items-center gap-x-4 rounded-xl border border-neutral-100 bg-white p-5">
          {/*  Icon */}
          <div className="bg-primary-300/5 flex flex-col items-center justify-center rounded-lg p-3">
            <Image src="/assets/images/document-icon-primary-300-w24-h24.svg" alt="Email Icon" width={24} height={24} />
          </div>

          {/*  Title and Description */}
          <div className="flex w-full flex-col gap-1">
            <div className="text-sm leading-5 font-medium">Jenis Akun</div>
            <div className="text-base leading-6 font-semibold">Personal</div>
          </div>
        </div>

        {/*  Email Address Card */}
        <div className="flex flex-row items-center gap-x-4 rounded-xl border border-neutral-100 bg-white p-5">
          {/*  Icon */}
          <div className="bg-primary-300/5 flex flex-col items-center justify-center rounded-lg p-3">
            <Image src="/assets/images/email-icon-primary-300-w24-h24.svg" alt="Email Icon" width={24} height={24} />
          </div>

          {/*  Title and Description */}
          <div className="flex w-full flex-col gap-1">
            <div className="text-sm leading-5 font-medium">Email Terdaftar</div>
            <div className="text-base leading-6 font-semibold">john.doe@gmail.com</div>
            <div className="text-sm leading-5 font-normal text-neutral-200">
              Kami akan mengirimkan update ke email ini
            </div>
          </div>
        </div>

        {/*  Verification Process Card */}
        <div className="rounded-xl border border-neutral-100 bg-white p-5">
          <div className="flex w-full flex-col gap-y-6">
            <div className="text-base leading-6 font-semibold">Proses Verifikasi</div>
            {/*  Timeline */}
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-row items-start gap-x-4">
                <div className="flex h-full flex-col items-center gap-y-1">
                  <div className="bg-primary-300 flex size-8 flex-col items-center justify-center rounded-full">
                    <Image src="/assets/images/check-icon-white-w20-h20.svg" alt="Check Icon" width={20} height={20} />
                  </div>
                  <div className="h-[40px] w-[2px] bg-neutral-100"></div>
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="text-sm leading-5 font-semibold">Dokumen Diterima</div>
                  <div className="text-sm leading-5 font-normal text-neutral-200">
                    Data dan dokumen Anda telah kami terima
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-start gap-x-4">
                <div className="flex h-full flex-col items-center gap-y-1">
                  <div className="flex size-8 flex-col items-center justify-center rounded-full bg-neutral-200"></div>
                  <div className="h-[40px] w-[2px] bg-neutral-100"></div>
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="text-sm leading-5 font-semibold">Peninjauan</div>
                  <div className="text-sm leading-5 font-normal text-neutral-200">
                    Tim kami sedang melakukan verifikasi
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-start gap-x-4">
                <div className="flex h-full flex-col items-center gap-y-1">
                  <div className="flex size-8 flex-col items-center justify-center rounded-full bg-neutral-200"></div>
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="text-sm leading-5 font-semibold">Menunggu Hasil</div>
                  <div className="text-sm leading-5 font-normal text-neutral-200">
                    Anda akan menerima notifikasi email
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  Next Action Section */}
        <div className="flex flex-row text-center">
          <div className="w-full text-sm leading-5 font-normal text-neutral-200">Mohon tunggu verifikasi selesai.</div>
        </div>

        {/*  Support Card */}
        <div className="rounded-xl border border-neutral-100 bg-neutral-200/30 p-5">
          <div className="text-sm leading-5 font-normal text-neutral-200">
            Ada pertanyaan? Hubungi kami di&nbsp;
            <span className="text-primary-300">
              <a href="mailto:support@loonas.com">support@loonas.com</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
