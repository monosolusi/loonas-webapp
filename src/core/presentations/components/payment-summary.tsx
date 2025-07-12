import { DetailLineItem } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/detail-line-item";
import { Card } from "@/core/presentations/components/card";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { FilledButton } from "@/core/presentations/components/filled-button";

interface PaymentSummaryProps {
  selectedPaymentMethod: { title: string };
  invoiceValue: number;
  fee: number;
  totalPayable: number;
  isDisabled: boolean;
  onClick?: () => void | Promise<void>;
}

export function PaymentSummary(props: PaymentSummaryProps) {
  const handleClick = async () => {
    if (props.isDisabled) return;
    await props.onClick?.();
  };

  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pembayaran</h2>
        <DetailLineItem title="Metode Pembayaran" description={props.selectedPaymentMethod.title} />
        <DetailLineItem title="Nilai Faktur" description={<CurrencyDisplay value={props.invoiceValue} />} />
        <DetailLineItem title="Biaya Layanan" description={<CurrencyDisplay value={props.fee} />} />
        <DetailLineItem
          title="Total Pembayaran"
          description={
            <CurrencyDisplay className="text-primary-default text-lg font-semibold" value={props.totalPayable} />
          }
        />
        {props.onClick && (
          <FilledButton disabled={props.isDisabled} onClick={handleClick}>
            Bayar Sekarang
          </FilledButton>
        )}
      </div>
    </Card>
  );
}
