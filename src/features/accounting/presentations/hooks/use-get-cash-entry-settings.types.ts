import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { CashEntrySettingsEntity } from "@/features/accounting/domain/entities/cash-entry-settings";

export type GetCashEntrySettingsFetcherParams = {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: CashEntrySettingsEntity;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<CashEntrySettingsEntity>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<CashEntrySettingsEntity>;
};

export type UseGetCashEntrySettingsReturnType = InitialState | LoadedState | ErrorState;
