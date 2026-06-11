import { useClerk } from "@clerk/nextjs";

export type ListPartnerBankAccountFetcherParams = {
  partner?: { id: string };
  clerk: ReturnType<typeof useClerk>;
};

export type UseListPartnerBankAccountProps = Omit<ListPartnerBankAccountFetcherParams, "clerk">;
