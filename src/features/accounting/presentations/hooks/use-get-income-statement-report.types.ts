import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GetIncomeStatementReportUseCaseResult } from "@/features/accounting/domain/usecases/get-income-statement-report.usecases";

export type UseGetIncomeStatementReportParams = {
  readonly enabled: boolean;
  readonly from: string;
  readonly to: string;
  readonly compareFrom?: string;
  readonly compareTo?: string;
};

export type GetIncomeStatementReportFetcherParams = Omit<UseGetIncomeStatementReportParams, "enabled"> & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: GetIncomeStatementReportUseCaseResult;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GetIncomeStatementReportUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetIncomeStatementReportReturnType = InitialState | LoadedState | ErrorState;
