import { ServerError } from "@/core/resources/server-error";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

type InitialState = {
  stockItem: null;
  loading: true;
  error: null;
};

type LoadedState = {
  stockItem: StockItemEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  stockItem: null;
  loading: false;
  error: ServerError;
};

export type UseGetStockItemReturnType = InitialState | LoadedState | ErrorState;
