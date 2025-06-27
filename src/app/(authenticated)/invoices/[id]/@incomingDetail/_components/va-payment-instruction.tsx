import { Card } from "@/core/presentations/components/card";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { DateTime } from "luxon";

interface VirtualAccountPaymentInstructionProps {
  paymentMethod: string;
  accountNumber: string;
  amountToPay: number;
  expireAt: DateTime;
}

export function VirtualAccountPaymentInstruction(props: VirtualAccountPaymentInstructionProps) {
  return (
    <Card>
      <div className="flex flex-col">
        <div className="mb-4 text-lg font-semibold">Petunjuk Pembayaran</div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="text-sm text-gray-600">Metode Pembayaran</div>
            <div className="font-bold">{props.paymentMethod}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-600">Nomor Virtual Account</div>
            <div className="font-bold">{props.accountNumber}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-600">Nominal Pembayaran</div>
            <div className="font-bold">{IDRFormatter.toCurrency(props.amountToPay)}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-gray-600">Bayar Sebelum</div>
            <div className="font-bold">{props.expireAt.toFormat("dd LLLL yyyy hh:mm")}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
