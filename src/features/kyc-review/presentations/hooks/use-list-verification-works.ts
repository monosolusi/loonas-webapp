"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { DataFailed } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { KycReviewServiceImpl } from "@/features/kyc-review/data/sources/kyc-review";
import { KycReviewRepositoryImpl } from "@/features/kyc-review/data/repositories/kyc-review";
import {
  ListVerificationWorksUseCase,
  ListVerificationWorksUseCaseParams,
} from "@/features/kyc-review/domain/usecases/list-verification-works.usecases";
import { VerificationWorkSummaryEntity } from "@/features/kyc-review/domain/entities/verification-work-summary";
import {
  ListVerificationWorksFetcherParams,
  UseListVerificationWorksParams,
  UseListVerificationWorksReturnType,
} from "@/features/kyc-review/presentations/hooks/use-list-verification-works.types";

async function ListVerificationWorksFetcher([_, params]: [
  string,
  ListVerificationWorksFetcherParams,
]): Promise<PaginatedData<VerificationWorkSummaryEntity>> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const kycReviewRepository = new KycReviewRepositoryImpl(new KycReviewServiceImpl(new HttpRequest()));
  const useCase = new ListVerificationWorksUseCase(kycReviewRepository, sessionRepository);

  const result = await useCase.execute(
    new ListVerificationWorksUseCaseParams(params.status, params.page, params.limit),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useListVerificationWorks(params: UseListVerificationWorksParams): UseListVerificationWorksReturnType {
  const clerk = useClerk();

  const { data, isLoading, error, mutate } = useSWR(
    ["list-verification-works", { ...params, clerk }],
    ListVerificationWorksFetcher,
  );

  if (isLoading) return { works: null, meta: null, loading: true, error: null, refresh: null };
  if (error) return { works: null, meta: null, loading: false, error, refresh: null };
  if (!data) return { works: null, meta: null, loading: true, error: null, refresh: null };
  return { works: data.data, meta: data.meta, loading: false, error: null, refresh: mutate };
}
