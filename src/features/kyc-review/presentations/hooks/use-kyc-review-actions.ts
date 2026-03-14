"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { useClerk } from "@clerk/nextjs";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { KycReviewServiceImpl } from "@/features/kyc-review/data/sources/kyc-review";
import { KycReviewRepositoryImpl } from "@/features/kyc-review/data/repositories/kyc-review";
import {
  ClaimVerificationWorkUseCase,
  ClaimVerificationWorkUseCaseParams,
} from "@/features/kyc-review/domain/usecases/claim-verification-work.usecases";
import {
  ReviewVerificationWorkUseCase,
  ReviewVerificationWorkUseCaseParams,
} from "@/features/kyc-review/domain/usecases/review-verification-work.usecases";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { ReviewAction } from "@/features/kyc-review/domain/enums/review-action";

type ClerkInstance = ReturnType<typeof useClerk>;

export type ReviewPhase =
  | "idle"
  | "claiming"
  | "review-form"
  | "submitting"
  | "done"
  | "completed"
  | "claim-error"
  | "review-error";

function deriveInitialPhase(workStatus: VerificationWorkStatus): ReviewPhase {
  switch (workStatus) {
    case VerificationWorkStatus.IN_QUEUE:
      return "idle";
    case VerificationWorkStatus.PROCESSING:
      return "review-form";
    case VerificationWorkStatus.DONE:
    case VerificationWorkStatus.FAILED:
      return "completed";
  }
}

async function ClaimWorkFetcher(
  _: string,
  { arg }: { arg: { id: string; clerk: ClerkInstance } },
): Promise<{ id: string }> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const kycReviewRepository = new KycReviewRepositoryImpl(new KycReviewServiceImpl(new HttpRequest()));
  const useCase = new ClaimVerificationWorkUseCase(kycReviewRepository, sessionRepository);

  const result = await useCase.execute(new ClaimVerificationWorkUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

async function ReviewWorkFetcher(
  _: string,
  { arg }: { arg: { id: string; action: ReviewAction; notes?: string; clerk: ClerkInstance } },
): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const kycReviewRepository = new KycReviewRepositoryImpl(new KycReviewServiceImpl(new HttpRequest()));
  const useCase = new ReviewVerificationWorkUseCase(kycReviewRepository, sessionRepository);

  const result = await useCase.execute(
    new ReviewVerificationWorkUseCaseParams({
      id: arg.id,
      action: arg.action,
      notes: arg.notes,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
}

interface UseKycReviewActionsParams {
  workId: string;
  workStatus: VerificationWorkStatus;
  onClaimed?: () => void;
}

export function useKycReviewActions({ workId, workStatus, onClaimed }: UseKycReviewActionsParams) {
  const clerk = useClerk();
  const initialPhase = deriveInitialPhase(workStatus);
  const [phase, setPhase] = useState<ReviewPhase>(initialPhase);
  const [processingWorkId, setProcessingWorkId] = useState<string | null>(
    workStatus === VerificationWorkStatus.PROCESSING ? workId : null,
  );
  const [reviewOutcome, setReviewOutcome] = useState<ReviewAction | null>(null);

  const { trigger: claimTrigger, error: claimError } = useSWRMutation(
    `claim-verification-work-${workId}`,
    ClaimWorkFetcher,
  );
  const { trigger: reviewTrigger, error: reviewError } = useSWRMutation(
    `review-verification-work-${workId}`,
    ReviewWorkFetcher,
  );

  async function startReview() {
    try {
      setPhase("claiming");
      const newWork = await claimTrigger({ id: workId, clerk });
      if (!newWork) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      setProcessingWorkId(newWork.id);
      setPhase("review-form");
      onClaimed?.();
    } catch {
      setPhase("claim-error");
    }
  }

  async function submitReview(params: { action: ReviewAction; notes?: string }) {
    if (!processingWorkId) return;
    try {
      setPhase("submitting");
      await reviewTrigger({ id: processingWorkId, action: params.action, notes: params.notes, clerk });
      setReviewOutcome(params.action);
      setPhase("done");
    } catch {
      setPhase("review-error");
    }
  }

  function retryReview() {
    setPhase("review-form");
  }

  return {
    phase,
    workStatus,
    processingWorkId,
    reviewOutcome,
    claimError: claimError as ServerError | null,
    reviewError: reviewError as ServerError | null,
    startReview,
    submitReview,
    retryReview,
  };
}
