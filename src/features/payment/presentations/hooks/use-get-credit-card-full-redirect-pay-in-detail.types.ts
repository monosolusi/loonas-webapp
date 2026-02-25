import { useClerk } from "@clerk/nextjs";

export type UseGetCreditCardFullRedirectPayInDetailProps = {
  invoice: { id: string };
};

export type GetCreditCardFullRedirectPayInDetailFetcherParams = UseGetCreditCardFullRedirectPayInDetailProps & {
  clerk: ReturnType<typeof useClerk>;
};
