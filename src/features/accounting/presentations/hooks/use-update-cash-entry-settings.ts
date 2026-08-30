"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_MUTATION_KEYS, ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CashEntrySettingsRepositoryImpl } from "@/features/accounting/data/repositories/cash-entry-settings";
import { CashEntrySettingsServiceImpl } from "@/features/accounting/data/sources/cash-entry-settings";
import { CashEntrySettingsEntity } from "@/features/accounting/domain/entities/cash-entry-settings";
import {
  UpdateCashEntrySettingsUseCase,
  UpdateCashEntrySettingsUseCaseParams,
} from "@/features/accounting/domain/usecases/update-cash-entry-settings.usecases";

type UpdateCashEntrySettingsTriggerParams = {
  defaultIncomeAccountId?: string | null;
  defaultExpenseAccountId?: string | null;
};
type UpdateCashEntrySettingsFetcherParams = UpdateCashEntrySettingsTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function UpdateCashEntrySettingsFetcher(
  _: string,
  { arg }: { arg: UpdateCashEntrySettingsFetcherParams },
): Promise<CashEntrySettingsEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CashEntrySettingsRepositoryImpl(new CashEntrySettingsServiceImpl(new HttpRequest()));
  const uc = new UpdateCashEntrySettingsUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new UpdateCashEntrySettingsUseCaseParams(arg.defaultIncomeAccountId, arg.defaultExpenseAccountId),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  // Fire-and-forget: `revalidateSWRKey` refetches and rethrows on a failed refetch, so
  // awaiting it here would report a successful update as failed.
  void revalidateSWRKey(ACCOUNTING_SWR_KEYS.GET_CASH_ENTRY_SETTINGS).catch(() => {});
  return result.data;
}

export function useUpdateCashEntrySettings() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.UPDATE_CASH_ENTRY_SETTINGS, UpdateCashEntrySettingsFetcher);
}
