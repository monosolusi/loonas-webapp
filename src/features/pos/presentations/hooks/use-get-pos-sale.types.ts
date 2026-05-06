import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";

export type GetPosSaleFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  id: string;
};

type InitialState = {
  status: "loading";
  sale: null;
  error: null;
};

type LoadedState = {
  status: "loaded";
  sale: PosSaleEntity;
  error: null;
};

type ErrorState = {
  status: "error";
  sale: null;
  error: ServerError;
};

export type UseGetPosSaleState = InitialState | LoadedState | ErrorState;
