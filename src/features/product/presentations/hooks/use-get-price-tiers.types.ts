import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";

export type GetPriceTiersFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  productId: string;
  variantId: string;
};

type InitialState = {
  status: "loading";
  schedule: null;
  error: null;
};

type LoadedState = {
  status: "loaded";
  schedule: PriceTierScheduleEntity;
  error: null;
};

type ErrorState = {
  status: "error";
  schedule: null;
  error: ServerError;
};

export type UseGetPriceTiersState = (InitialState | LoadedState | ErrorState) & {
  refresh: () => void;
};
