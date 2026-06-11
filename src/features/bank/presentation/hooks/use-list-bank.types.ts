import { useClerk } from "@clerk/nextjs";

export type ListBankFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};
