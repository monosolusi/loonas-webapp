import { useClerk } from "@clerk/nextjs";

export type ListPartnerFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};
