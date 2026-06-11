import { useClerk } from "@clerk/nextjs";

export type CreatePartnerBankAccountTriggerParams = {
  bank: { id: string };
  accountNumber: string;
  accountHolderName: string;
  partner: { id: string };
};

export type CreatePartnerBankAccountFetcherParams = CreatePartnerBankAccountTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};
