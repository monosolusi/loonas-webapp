import { useClerk } from "@clerk/nextjs";
import { VerificationWorkDetailEntity } from "@/features/kyc-review/domain/entities/verification-work-detail";
import { ServerError } from "@/core/resources/server-error";
import { KeyedMutator } from "swr";

export type UseGetVerificationWorkParams = {
  id: string;
};

export type GetVerificationWorkFetcherParams = UseGetVerificationWorkParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = { work: null; loading: true; error: null; refresh: null };
type LoadedState = {
  work: VerificationWorkDetailEntity;
  loading: false;
  error: null;
  refresh: KeyedMutator<VerificationWorkDetailEntity>;
};
type ErrorState = { work: null; loading: false; error: ServerError; refresh: null };

export type UseGetVerificationWorkReturnType = InitialState | LoadedState | ErrorState;
