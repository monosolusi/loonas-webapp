import { useInquiryBankAccount } from "@/features/bank/presentation/hooks/use-inqury-bank-account";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import { useMemo } from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { ButtonProps } from "@/core/presentations/components/buttons/button";

type InquiryBankAccountProps = {
  bankId?: string;
  accountNumber?: string;
  onInquired?: (result: AccountInquiryResultEntity) => void;
} & Omit<ButtonProps, "label" | "type" | "onClick" | "className">;

export function InquiryBankAccount(props: InquiryBankAccountProps) {
  const { trigger, isMutating } = useInquiryBankAccount();

  const onInquireClick = async () => {
    if (!props.bankId || !props.accountNumber) return;
    if (!props.onInquired) return;
    if (isMutating) return;

    const result = await trigger({
      bankId: props.bankId,
      accountNumber: props.accountNumber,
    });

    props.onInquired(result);
  };

  const disabled = useMemo(() => {
    return isMutating || !props.bankId || !props.accountNumber;
  }, [isMutating, props.bankId, props.accountNumber]);

  const label = useMemo(() => {
    return isMutating ? "Memverifikasi..." : "Verifikasi Rekening";
  }, [isMutating]);

  const cleanedProps = useMemo(() => {
    const { onInquired, bankId, accountNumber, ...rest } = props;
    return rest;
  }, [props]);

  return (
    <PrimaryButton
      {...cleanedProps}
      type="button"
      onClick={onInquireClick}
      disabled={disabled}
      className="w-full"
      label={label}
    />
  );
}
