import { SectionCard } from "@/core/presentations/components/section-card";
import { VerificationWorkAccountEntity } from "@/features/kyc-review/domain/entities/verification-work-account";

interface AccountInfoSectionProps {
  account: VerificationWorkAccountEntity;
  userEmail?: string;
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  PERSONAL: "Perorangan",
  BUSINESS: "Bisnis",
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-row items-baseline justify-between gap-x-4">
      <span className="shrink-0 text-sm text-neutral-300">{label}</span>
      <span className="text-right text-sm font-medium text-neutral-500">{value}</span>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center gap-x-2 pt-2">
      <span className="text-xs font-medium tracking-wider text-neutral-200 uppercase">{label}</span>
      <div className="h-px flex-1 bg-neutral-100" />
    </div>
  );
}

export function AccountInfoSection({ account, userEmail }: AccountInfoSectionProps) {
  const isPersonal = account.type === "PERSONAL";
  const isBusiness = account.type === "BUSINESS";

  return (
    <SectionCard title="Informasi Akun" iconSrc="/assets/images/document-icon-neutral-400-w16-h16.svg">
      <div className="flex flex-col gap-y-3">
        {/* General */}
        <InfoRow label="ID Akun" value={account.id.slice(0, 8)} />
        <InfoRow label="Tipe Akun" value={ACCOUNT_TYPE_LABELS[account.type] ?? account.type} />
        <InfoRow label="Nama" value={account.fullName} />
        <InfoRow label="Email" value={userEmail} />

        {/* Personal identity */}
        {isPersonal && (account.nationality || account.idNumber || account.occupation) && (
          <>
            <SectionDivider label="Identitas" />
            <InfoRow label="Kewarganegaraan" value={account.nationality} />
            <InfoRow label="No. Identitas" value={account.idNumber} />
            <InfoRow label="Pekerjaan" value={account.occupation} />
            <InfoRow label="Tempat Lahir" value={account.placeOfBirth} />
          </>
        )}

        {/* Address */}
        {isPersonal && (account.province || account.address) && (
          <>
            <SectionDivider label="Alamat" />
            <InfoRow label="Provinsi" value={account.province} />
            <InfoRow label="Kota" value={account.city} />
            <InfoRow label="Kecamatan" value={account.district} />
            <InfoRow label="Kelurahan" value={account.subdistrict} />
            <InfoRow label="Alamat" value={account.address} />
          </>
        )}

        {/* Business contact */}
        {isBusiness && (account.companyEmail || account.companyPhoneNumber || account.companyAddress) && (
          <>
            <SectionDivider label="Kontak Perusahaan" />
            <InfoRow label="Email" value={account.companyEmail} />
            <InfoRow label="No. Telepon" value={account.companyPhoneNumber} />
            <InfoRow label="Alamat" value={account.companyAddress} />
          </>
        )}
      </div>
    </SectionCard>
  );
}
