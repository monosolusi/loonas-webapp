import DoneAnimation from "../_static-files/done-animation.json";
import PaperPlaneAnimation from "../_static-files/paper-plane-animation.json";
import PeopleWaitingAnimation from "../_static-files/people-waiting.json";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { CurrentStatus } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/current-status";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";

export function CurrentStatusImpl() {
  const { paymentRequest } = usePaymentRequest();

  const getDetail = (status: PaymentRequestStatus) => {
    if (status === PaymentRequestStatus.PENDING_PAYMENT) {
      return {
        title: "Menunggu Pembayaran",
        description: "Yuk, selesaikan pembayaran sesuai petunjuk yang ada.",
        lottieFile: PeopleWaitingAnimation
      };
    } else if (status === PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY) {
      return {
        title: "Pembayaran Diterima",
        description: "Pembayaran sudah kami terima, sekarang dana sedang kami kirim ke bank penerima.",
        lottieFile: PaperPlaneAnimation
      };
    } else if (status === PaymentRequestStatus.COMPLETED) {
      return {
        title: "Selesai",
        description: "Pembayaran sudah kami terima, dan dana sudah kami kirim ke bank penerima.",
        lottieFile: DoneAnimation
      };
    } else return null;
  };

  if (!paymentRequest) return null;
  if (!(getDetail(paymentRequest.status))) return null;
  return (
    <CurrentStatus
      title={getDetail(paymentRequest.status)?.title ?? ""}
      description={getDetail(paymentRequest.status)?.description ?? ""}
      lottieFile={getDetail(paymentRequest.status)?.lottieFile ?? null}
    />
  );
}