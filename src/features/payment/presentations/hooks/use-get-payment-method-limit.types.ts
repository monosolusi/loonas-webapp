import { useClerk } from "@clerk/nextjs";

export type UseGetPaymentMethodLimitProps = {
  id: string;
};

export type GetPaymentMethodLimitFetcherParams = UseGetPaymentMethodLimitProps & {
  clerk: ReturnType<typeof useClerk>;
};
