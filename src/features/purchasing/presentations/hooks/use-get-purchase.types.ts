import { ServerError } from "@/core/resources/server-error";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";

type InitialState = {
  purchase: null;
  loading: true;
  error: null;
};

type LoadedState = {
  purchase: PurchaseEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  purchase: null;
  loading: false;
  error: ServerError;
};

export type UseGetPurchaseReturnType = InitialState | LoadedState | ErrorState;
