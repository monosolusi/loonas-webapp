import { ServerError } from "@/core/resources/server-error";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";

type InitialState = {
  record: null;
  loading: true;
  error: null;
};

type LoadedState = {
  record: ProductionRecordEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  record: null;
  loading: false;
  error: ServerError;
};

export type UseGetProductionRecordReturnType = InitialState | LoadedState | ErrorState;
