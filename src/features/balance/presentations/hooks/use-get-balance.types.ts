import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { BalanceEntity } from "@/features/balance/domain/entities/balance";

export type GetBalanceFetcherParams = {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly balance: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: KeyedMutator<BalanceEntity>;
};

type LoadedState = {
  readonly balance: BalanceEntity;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<BalanceEntity>;
};

type ErrorState = {
  readonly balance: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<BalanceEntity>;
};

// Every union member carries a non-null `refresh` — the LNS-755 acceptance criterion. A
// `refresh: null` member is what left the "Coba Lagi" button on cogs-block-error.tsx doing
// nothing in production, so typecheck is the enforcement here, not a runtime test.
export type UseGetBalanceReturnType = InitialState | LoadedState | ErrorState;
