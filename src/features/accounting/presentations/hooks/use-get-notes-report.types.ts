import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GetNotesReportUseCaseResult } from "@/features/accounting/domain/usecases/get-notes-report.usecases";

export type UseGetNotesReportParams = {
  readonly asOf: string;
};

export type GetNotesReportFetcherParams = UseGetNotesReportParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: KeyedMutator<GetNotesReportUseCaseResult>;
};

type LoadedState = {
  readonly data: GetNotesReportUseCaseResult;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GetNotesReportUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<GetNotesReportUseCaseResult>;
};

export type UseGetNotesReportReturnType = InitialState | LoadedState | ErrorState;
