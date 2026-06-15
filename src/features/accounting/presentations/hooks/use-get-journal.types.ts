import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";

export type GetJournalFetcherParams = {
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
  readonly data: JournalEntity;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<JournalEntity>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetJournalReturnType = InitialState | LoadedState | ErrorState;
