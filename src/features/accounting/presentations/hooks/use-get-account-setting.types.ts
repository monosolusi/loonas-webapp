import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { AccountSettingEntity } from "@/features/accounting/domain/entities/account-setting";

export type GetAccountSettingFetcherParams = {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: AccountSettingEntity;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<AccountSettingEntity>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetAccountSettingReturnType = InitialState | LoadedState | ErrorState;
