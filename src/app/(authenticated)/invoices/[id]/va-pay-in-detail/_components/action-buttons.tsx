import { FilledButton } from "@/core/presentations/components/filled-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import React from "react";
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
    router.push(`/invoices/${props.invoiceId}/disbursement-status`);
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <FilledButton onClick={handlePaymentDone}>
        Sudah Bayar
      </FilledButton>
      <SecondaryButton outlined label="Bayar Nanti" onClick={handlePayLater} />
    </div>
  );
}