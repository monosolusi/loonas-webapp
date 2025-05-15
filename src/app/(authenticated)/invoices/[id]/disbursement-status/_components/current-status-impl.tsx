import DoneAnimation from "../_static-files/done-animation.json";
import PaperPlaneAnimation from "../_static-files/paper-plane-animation.json";
import PeopleWaitingAnimation from "../_static-files/people-waiting.json";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { CurrentStatus } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/current-status";

export function CurrentStatusImpl() {
  const currentStatus = PaymentRequestStatus.PENDING_PAYMENT;

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

  if (!(getDetail(currentStatus))) return null;
  return (
    <CurrentStatus
      title={getDetail(currentStatus)?.title ?? ""}
      description={getDetail(currentStatus)?.description ?? ""}
      lottieFile={getDetail(currentStatus)?.lottieFile ?? null}
    />
  );
}