"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { KycReviewServiceImpl } from "@/features/kyc-review/data/sources/kyc-review";
import { KycReviewRepositoryImpl } from "@/features/kyc-review/data/repositories/kyc-review";
import {
  GetVerificationWorkUseCase,
  GetVerificationWorkUseCaseParams,
} from "@/features/kyc-review/domain/usecases/get-verification-work.usecases";
import { VerificationWorkDetailEntity } from "@/features/kyc-review/domain/entities/verification-work-detail";
import {
  GetVerificationWorkFetcherParams,
  UseGetVerificationWorkParams,
  UseGetVerificationWorkReturnType,
} from "@/features/kyc-review/presentations/hooks/use-get-verification-work.types";

async function GetVerificationWorkFetcher([_, params]: [
  string,
  GetVerificationWorkFetcherParams,
]): Promise<VerificationWorkDetailEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const kycReviewRepository = new KycReviewRepositoryImpl(new KycReviewServiceImpl(new HttpRequest()));
  const useCase = new GetVerificationWorkUseCase(kycReviewRepository, sessionRepository);

  const result = await useCase.execute(new GetVerificationWorkUseCaseParams(params.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.NOT_FOUND);
  return result.data;
}

export function useGetVerificationWork(params: UseGetVerificationWorkParams): UseGetVerificationWorkReturnType {
  const clerk = useClerk();

  const { data, isLoading, error, mutate } = useSWR(
    ["get-verification-work", { ...params, clerk }],
    GetVerificationWorkFetcher,
  );

  if (isLoading) return { work: null, loading: true, error: null, refresh: null };
  if (error) return { work: null, loading: false, error, refresh: null };
  if (!data) return { work: null, loading: true, error: null, refresh: null };
  return { work: data, loading: false, error: null, refresh: mutate };
}
