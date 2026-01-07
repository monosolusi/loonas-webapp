import Image from "next/image";
import { StatusBoxWrapper } from "@/app/(user)/onboarding/kyc-summary/[accountId]/_components/status-box-wrapper";
import { StatusBoxIcon } from "@/app/(user)/onboarding/kyc-summary/[accountId]/_components/status-box-icon";

type StatusData = {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  borderColor: string;
  showEstimate: boolean;
};

type Status = "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED";
type StatusBoxProps = {
  status: Status;
};

const STATUS_MAP: Record<string, StatusData> = {
  SUBMITTED: {
    title: "Dokumen Berhasil Dikirim",
    description: "Terima kasih! Data Anda telah kami terima dan akan segera kami proses.",
    icon: "/assets/images/check-icon-primary-w40-h40.svg",
    backgroundColor: "bg-primary-300/5",
    borderColor: "border-primary-300/20",
    showEstimate: true,
  },
  REVIEWING: {
    title: "Sedang Ditinjau",
    description: "Tim kami sedang meninjau dokumen dan informasi yang Anda berikan.",
    icon: "/assets/images/time-icon-warning-300-w40-h40.svg",
    backgroundColor: "bg-warning-300/5",
    borderColor: "border-warning-300/20",
    showEstimate: true,
  },
  APPROVED: {
    title: "Verifikasi Berhasil",
    description: "Selamat! Akun Anda telah terverifikasi dan siap digunakan.",
    icon: "/assets/images/check-icon-success-300-w40-h40.svg",
    backgroundColor: "bg-success-300/5",
    borderColor: "border-success-300/20",
    showEstimate: false,
  },
  REJECTED: {
    title: "Verifikasi Ditolak",
    description: "Mohon maaf, verifikasi Anda tidak dapat diproses. Silakan hubungi support.",
    icon: "/assets/images/cross-circle-icon-error-300-w40-h40.svg",
    backgroundColor: "bg-error-300/5",
    borderColor: "border-error-300/20",
    showEstimate: false,
  },
};

export function StatusBox(props: StatusBoxProps) {
  const statusProps = STATUS_MAP[props.status];

  return (
    <StatusBoxWrapper backgroundColor={statusProps.backgroundColor} borderColor={statusProps.borderColor}>
      {/*  Check Icon */}
      <StatusBoxIcon
        icon={statusProps.icon}
        backgroundColor={statusProps.backgroundColor}
        borderColor={statusProps.borderColor}
      />

      {/* Title and Description */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="text-2xl leading-8 font-semibold">{statusProps.title}</div>
        <div className="text-base leading-6 font-normal text-neutral-200">{statusProps.description}</div>
      </div>

      {/*  KYC Process Estimates */}
      {statusProps.showEstimate && (
        <div className="flex flex-row gap-x-2 rounded-lg border border-neutral-100 bg-white px-4 py-2">
          <Image src="/assets/images/time-icon-neutral-200-w16-h16.svg" alt="Time Icon" width={16} height={16} />
          <div className="text-sm font-medium">Estimasi 1-3 hari kerja</div>
        </div>
      )}
    </StatusBoxWrapper>
  );
}
