import { SectionCard } from "@/core/presentations/components/section-card";

interface PaymentInformationProps {
  paymentMethod: string;
  transactionDate: string;
  client: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="text-xs leading-4 text-neutral-300">{label}</div>
      <div className="leading-5 font-medium">{value}</div>
    </div>
  );
}

export function PaymentInformation(props: PaymentInformationProps) {
  return (
    <SectionCard
      iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg"
      title="Informasi Pembayaran"
      bodyClassName="p-0"
    >
      <div className="flex flex-row">
        <div className="flex flex-1 flex-col gap-y-4 border-r border-r-neutral-100 p-6">
          <InfoField label="Metode Bayar" value={props.paymentMethod} />
          <InfoField label="Waktu Transaksi" value={props.transactionDate} />
          <InfoField label="Client" value={props.client} />
        </div>
        <div className="flex flex-1 flex-col gap-y-4 p-6">
          <InfoField label="Bank Penerima" value={props.bankName} />
          <InfoField label="Nomor Rekening" value={props.accountNumber} />
          <InfoField label="Atas Nama" value={props.accountHolder} />
        </div>
      </div>
    </SectionCard>
  );
}
