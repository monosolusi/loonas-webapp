// Canonical example: types sibling file for a get hook.
// Source: src/features/production/presentations/hooks/use-get-production-record.types.ts
// NOTE: predates the non-null `refresh` convention — its cited source has no retry
// consumer. New hooks MUST follow SKILL.md rule 7: `refresh: KeyedMutator<T>` on every
// union member, never `null`. See CLAUDE.md (LNS-757).

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
