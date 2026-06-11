import { useClerk } from "@clerk/nextjs";

export type CreatePartnerFetcherProps = {
  name: string;
  email: string;
  phoneNumber: string;
};

export type CreatePartnerFetcherParams = CreatePartnerFetcherProps & {
  clerk: ReturnType<typeof useClerk>;
};
