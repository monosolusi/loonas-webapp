"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { ACCOUNTING_MUTATION_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { FinalIncomeTaxSettleRepositoryImpl } from "@/features/accounting/data/repositories/final-income-tax-settle";
import { FinalIncomeTaxSettleServiceImpl } from "@/features/accounting/data/sources/final-income-tax-settle";
import {
  SettleFinalIncomeTaxUseCase,
  SettleFinalIncomeTaxUseCaseParams,
  SettleFinalIncomeTaxResult,
} from "@/features/accounting/domain/usecases/settle-final-income-tax.usecases";

type SettleFinalIncomeTaxTriggerParams = {
  cashAccountId: string;
  amount: number;
  journalDate: string;
  memo?: string;
  idempotencyKey: string;
};

type SettleFinalIncomeTaxFetcherParams = SettleFinalIncomeTaxTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function SettleFinalIncomeTaxFetcher(
  _: string,
  { arg }: { arg: SettleFinalIncomeTaxFetcherParams },
): Promise<SettleFinalIncomeTaxResult> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new FinalIncomeTaxSettleRepositoryImpl(new FinalIncomeTaxSettleServiceImpl(new HttpRequest()));
  const uc = new SettleFinalIncomeTaxUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new SettleFinalIncomeTaxUseCaseParams(arg.cashAccountId, arg.amount, arg.journalDate, arg.memo, arg.idempotencyKey),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useSettleFinalIncomeTax() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.SETTLE_FINAL_INCOME_TAX, SettleFinalIncomeTaxFetcher);
}
