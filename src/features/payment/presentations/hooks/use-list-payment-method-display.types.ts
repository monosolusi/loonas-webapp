import { useClerk } from "@clerk/nextjs";

export type ListPaymentMethodDisplayFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};
