"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { ACCOUNTING_MUTATION_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PphFinalSettleRepositoryImpl } from "@/features/accounting/data/repositories/pph-final-settle";
import { PphFinalSettleServiceImpl } from "@/features/accounting/data/sources/pph-final-settle";
import {
  SettlePphFinalUseCase,
  SettlePphFinalUseCaseParams,
  SettlePphFinalResult,
} from "@/features/accounting/domain/usecases/settle-pph-final.usecases";

type SettlePphFinalTriggerParams = {
  cashAccountId: string;
  amount: number;
  journalDate: string;
  memo?: string;
  idempotencyKey: string;
};

type SettlePphFinalFetcherParams = SettlePphFinalTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function SettlePphFinalFetcher(
  _: string,
  { arg }: { arg: SettlePphFinalFetcherParams },
): Promise<SettlePphFinalResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new PphFinalSettleRepositoryImpl(new PphFinalSettleServiceImpl(new HttpRequest()));
  const uc = new SettlePphFinalUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new SettlePphFinalUseCaseParams(arg.cashAccountId, arg.amount, arg.journalDate, arg.memo, arg.idempotencyKey),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useSettlePphFinal() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.SETTLE_PPH_FINAL, SettlePphFinalFetcher);
}
