import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";

export type UseListBalanceMovementsParams = {
  readonly page?: number;
  readonly limit?: number;
};

export type ListBalanceMovementFetcherParams = UseListBalanceMovementsParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly movements: null;
  readonly meta: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: KeyedMutator<PaginatedData<BalanceMovementEntity>>;
};

type LoadedState = {
  readonly movements: BalanceMovementEntity[];
  readonly meta: PaginatedData<BalanceMovementEntity>["meta"];
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<PaginatedData<BalanceMovementEntity>>;
};

type ErrorState = {
  readonly movements: null;
  readonly meta: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<PaginatedData<BalanceMovementEntity>>;
};

// Every union member carries a non-null `refresh` — the LNS-755 acceptance criterion, so
// LNS-756's retry button is wired to a live `mutate` in the one state it serves.
export type UseListBalanceMovementsReturnType = InitialState | LoadedState | ErrorState;
