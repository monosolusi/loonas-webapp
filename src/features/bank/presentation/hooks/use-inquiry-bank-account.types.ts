import { useClerk } from "@clerk/nextjs";

export type VerifyBankAccountTriggerParams = {
  bankId: string;
  accountNumber: string;
};

export type VerifyBankAccountFetcherParams = VerifyBankAccountTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};
