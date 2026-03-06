import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  invoiceId: string;
}

export function ActionButtons(props: ActionButtonsProps) {
  const router = useRouter();

  const handlePayLater = () => {
    router.push("/invoices");
  };

  const handlePaymentDone = () => {
    router.replace(`/invoices/${props.invoiceId}/disbursement-status`);
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <PrimaryButton label="Sudah Bayar" onClick={handlePaymentDone} />
      <SecondaryButton outlined label="Bayar Nanti" onClick={handlePayLater} />
    </div>
  );
}