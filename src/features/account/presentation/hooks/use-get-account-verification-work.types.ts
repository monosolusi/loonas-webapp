import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";

export type GetAccountVerificationWorkProps = {
  /** Truthy enables the fetch; the value (account id) also discriminates the SWR cache key — intentionally NOT a boolean. */
  enabled?: string | null;
};

export type GetAccountVerificationWorkFetcherParams = GetAccountVerificationWorkProps & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  verificationWork: null;
  loading: true;
  error: null;
  refresh: null;
};

type LoadedState = {
  verificationWork: AccountVerificationWorkEntity;
  loading: false;
  error: null;
  refresh: KeyedMutator<AccountVerificationWorkEntity>;
};

type ErrorState = {
  verificationWork: null;
  loading: false;
  error: ServerError;
  refresh: null;
};

export type UseGetAccountVerificationWorkReturnType = InitialState | LoadedState | ErrorState;
