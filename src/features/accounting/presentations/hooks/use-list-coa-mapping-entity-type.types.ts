import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";

export type ListCoaMappingEntityTypeFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  entityTypes: null;
  loading: true;
  error: null;
};

type LoadedState = {
  entityTypes: CoaMappingEntityTypeEntity[];
  loading: false;
  error: null;
};

type ErrorState = {
  entityTypes: null;
  loading: false;
  error: ServerError;
};

export type UseListCoaMappingEntityTypeReturnType = InitialState | LoadedState | ErrorState;
