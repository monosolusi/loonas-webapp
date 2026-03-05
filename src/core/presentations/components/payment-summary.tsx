import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SectionCard } from "@/core/presentations/components/section-card";

interface PaymentSummaryProps {
  selectedPaymentMethod: { title: string };
  invoiceValue: number;
  fee: number;
  totalPayable: number;
  isDisabled: boolean;
  isLoading?: boolean;
  onClick?: () => void | Promise<void>;
}

export function PaymentSummary(props: PaymentSummaryProps) {
  const handleClick = async () => {
    if (props.isDisabled) return;
    await props.onClick?.();
  };

  return (
    <SectionCard title="Ringkasan Pembayaran">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-neutral-500">Metode Pembayaran</span>
          <span className="text-sm text-neutral-900">{props.selectedPaymentMethod.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-neutral-500">Nilai Faktur</span>
          <span className="text-sm text-neutral-900">
            <CurrencyDisplay value={props.invoiceValue} />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-neutral-500">Biaya Layanan</span>
          <span className="text-sm text-neutral-900">
            <CurrencyDisplay value={props.fee} />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-neutral-500">Total Pembayaran</span>
          <CurrencyDisplay className="text-primary-default text-lg font-semibold" value={props.totalPayable} />
        </div>
        {props.onClick && (
          <PrimaryButton disabled={props.isDisabled} onClick={handleClick} loading={props.isLoading} label="Bayar Sekarang" />
        )}
      </div>
    </SectionCard>
  );
}
