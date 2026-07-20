"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { ACCOUNTING_MUTATION_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { AccountSettingRepositoryImpl } from "@/features/accounting/data/repositories/account-setting";
import { AccountSettingServiceImpl } from "@/features/accounting/data/sources/account-setting";
import {
  UpdateAccountSettingUseCase,
  UpdateAccountSettingUseCaseParams,
  UpdateAccountSettingInput,
} from "@/features/accounting/domain/usecases/update-account-setting.usecases";

type UpdateAccountSettingTriggerParams = UpdateAccountSettingInput;
type UpdateAccountSettingFetcherParams = UpdateAccountSettingTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function UpdateAccountSettingFetcher(
  _: string,
  { arg }: { arg: UpdateAccountSettingFetcherParams },
) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new AccountSettingRepositoryImpl(new AccountSettingServiceImpl(new HttpRequest()));
  const uc = new UpdateAccountSettingUseCase(repo, sessionRepo);
  const { clerk: _clerk, ...params } = arg;
  const result = await uc.execute(new UpdateAccountSettingUseCaseParams(params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useUpdateAccountSetting() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.UPDATE_ACCOUNT_SETTING, UpdateAccountSettingFetcher);
}
