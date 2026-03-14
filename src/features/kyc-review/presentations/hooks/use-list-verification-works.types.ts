import { useClerk } from "@clerk/nextjs";
import { VerificationWorkSummaryEntity } from "@/features/kyc-review/domain/entities/verification-work-summary";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ServerError } from "@/core/resources/server-error";
import { KeyedMutator } from "swr";

export type UseListVerificationWorksParams = {
  status?: VerificationWorkStatus;
};

export type ListVerificationWorksFetcherParams = UseListVerificationWorksParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = { works: null; loading: true; error: null; refresh: null };
type LoadedState = {
  works: VerificationWorkSummaryEntity[];
  loading: false;
  error: null;
  refresh: KeyedMutator<VerificationWorkSummaryEntity[]>;
};
type ErrorState = { works: null; loading: false; error: ServerError; refresh: null };

export type UseListVerificationWorksReturnType = InitialState | LoadedState | ErrorState;
