import { useClerk } from "@clerk/nextjs";
import { PaginatedData, PaginationMeta } from "@/core/resources/paginated";
import { VerificationWorkSummaryEntity } from "@/features/kyc-review/domain/entities/verification-work-summary";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ServerError } from "@/core/resources/server-error";
import { KeyedMutator } from "swr";

export type UseListVerificationWorksParams = {
  status?: VerificationWorkStatus;
  page?: number;
  limit?: number;
};

export type ListVerificationWorksFetcherParams = UseListVerificationWorksParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = { works: null; meta: null; loading: true; error: null; refresh: null };
type LoadedState = {
  works: VerificationWorkSummaryEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
  refresh: KeyedMutator<PaginatedData<VerificationWorkSummaryEntity>>;
};
type ErrorState = { works: null; meta: null; loading: false; error: ServerError; refresh: null };

export type UseListVerificationWorksReturnType = InitialState | LoadedState | ErrorState;
