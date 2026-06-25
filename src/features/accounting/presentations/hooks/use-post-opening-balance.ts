"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { OpeningBalanceRepositoryImpl } from "@/features/accounting/data/repositories/opening-balance";
import { OpeningBalanceServiceImpl } from "@/features/accounting/data/sources/opening-balance";
import {
  PostOpeningBalanceUseCase,
  PostOpeningBalanceUseCaseParams,
  PostOpeningBalanceLineInput,
} from "@/features/accounting/domain/usecases/post-opening-balance.usecases";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";

type PostOpeningBalanceTriggerParams = {
  asOf: string;
  lines: PostOpeningBalanceLineInput[];
  idempotencyKey: string;
};

type PostOpeningBalanceFetcherParams = PostOpeningBalanceTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function PostOpeningBalanceFetcher(
  _: string,
  { arg }: { arg: PostOpeningBalanceFetcherParams },
): Promise<JournalEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new OpeningBalanceRepositoryImpl(new OpeningBalanceServiceImpl(new HttpRequest()));
  const uc = new PostOpeningBalanceUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new PostOpeningBalanceUseCaseParams(arg.asOf, arg.lines, arg.idempotencyKey),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function usePostOpeningBalance() {
  return useSWRMutationClerk("post-opening-balance", PostOpeningBalanceFetcher);
}
