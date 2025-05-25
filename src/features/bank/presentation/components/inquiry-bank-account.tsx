import { FilledButton } from "@/core/presentations/components/filled-button";
import { useInquiryBankAccount } from "@/features/bank/presentation/hooks/use-inqury-bank-account";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";

interface InquiryBankAccountProps {
  bankId?: string;
  accountNumber?: string;
  onInquired?: (result: AccountInquiryResultEntity) => void;
}

export function InquiryBankAccount(props: InquiryBankAccountProps) {
  const { trigger, isMutating } = useInquiryBankAccount();

  const handleInquireClick = async () => {
    if (!props.bankId || !props.accountNumber) return;
    if (!props.onInquired) return;
    if (isMutating) return;

    const result = await trigger({
      bankId: props.bankId,
      accountNumber: props.accountNumber
    });

    props.onInquired(result);
  };

  return (
    <FilledButton
      type="button"
      onClick={handleInquireClick}
      disabled={isMutating || !props.bankId || !props.accountNumber}
      className="w-full"
    >
      {isMutating ? "Memverifikasi..." : "Verifikasi Rekening"}
    </FilledButton>
  );
}
