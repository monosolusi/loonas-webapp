import { KeyedMutator } from "swr";
import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";

export type GetCashEntryFetcherParams = {
  readonly id: string;
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: CashEntryEntity;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<CashEntryEntity>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<CashEntryEntity>;
};

export type UseGetCashEntryReturnType = InitialState | LoadedState | ErrorState;
