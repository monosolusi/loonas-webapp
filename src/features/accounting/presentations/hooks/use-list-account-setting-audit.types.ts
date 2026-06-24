import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { AccountSettingAuditEntity } from "@/features/accounting/domain/entities/account-setting-audit";

export type UseListAccountSettingAuditParams = {
  readonly page?: number;
  readonly limit?: number;
};

export type ListAccountSettingAuditFetcherParams = UseListAccountSettingAuditParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: PaginatedData<AccountSettingAuditEntity>;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<PaginatedData<AccountSettingAuditEntity>>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseListAccountSettingAuditReturnType = InitialState | LoadedState | ErrorState;
