import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";

export type GetYearSummaryFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  year: number;
};

type InitialState = {
  summary: null;
  loading: true;
  error: null;
};

type LoadedState = {
  summary: YearEndSummaryEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  summary: null;
  loading: false;
  error: ServerError;
};

export type UseGetYearSummaryReturnType = InitialState | LoadedState | ErrorState;
