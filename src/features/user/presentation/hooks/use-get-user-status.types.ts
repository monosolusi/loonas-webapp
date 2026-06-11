import { useClerk } from "@clerk/nextjs";

export type GetUserStatusFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};
