import { SectionCard } from "@/core/presentations/components/section-card";

interface PaymentInformationProps {
  paymentMethod: string;
  transactionDate: string;
  client: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
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
          <div className="flex flex-col gap-y-1">
            <div className="text-xs leading-4 text-neutral-300">Metode Bayar</div>
            <div className="leading-5 font-medium">{props.paymentMethod}</div>
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="text-xs leading-4 text-neutral-300">Waktu Transaksi</div>
            <div className="leading-5 font-medium">{props.transactionDate}</div>
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="text-xs leading-4 text-neutral-300">Client</div>
            <div className="leading-5 font-medium">{props.client}</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-y-4 p-6">
          <div className="flex flex-col gap-y-1">
            <div className="text-xs leading-4 text-neutral-300">Bank Penerima</div>
            <div className="leading-5 font-medium">{props.bankName}</div>
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="text-xs leading-4 text-neutral-300">Nomor Rekening</div>
            <div className="leading-5 font-medium">{props.accountNumber}</div>
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="text-xs leading-4 text-neutral-300">Atas Nama</div>
            <div className="leading-5 font-medium">{props.accountHolder}</div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
