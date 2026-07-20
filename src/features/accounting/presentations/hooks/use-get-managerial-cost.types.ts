import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { ManagerialCostProjectionEntity } from "@/features/accounting/domain/entities/managerial-cost-projection";

export type GetManagerialCostFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  periodId: string;
  variantId?: string;
};

export type UseGetManagerialCostParams = {
  periodId: string;
  variantId?: string;
  enabled?: boolean;
};

type InitialState = { status: "initial"; projections: []; isAllocated: false; loading: false; error: null };
type LoadingState = { status: "loading"; projections: []; isAllocated: false; loading: true; error: null };
type LoadedState = {
  status: "loaded";
  projections: ManagerialCostProjectionEntity[];
  isAllocated: boolean;
  loading: false;
  error: null;
};
type ErrorState = { status: "error"; projections: []; isAllocated: false; loading: false; error: ServerError };

export type UseGetManagerialCostState = InitialState | LoadingState | LoadedState | ErrorState;
