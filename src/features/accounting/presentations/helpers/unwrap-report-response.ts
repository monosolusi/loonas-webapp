import { PaginationMeta } from "@/core/resources/paginated";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export type UnwrappedReportResponse<T> = {
  readonly data: T;
  readonly meta: PaginationMeta | null;
};

export type RawImbalance = {
  readonly is_balanced?: boolean;
  readonly delta?: number;
} | null | undefined;

export type NormalizedImbalance = {
  readonly isBalanced: boolean;
  readonly delta: number;
};

export function unwrapReportResponse<T>(raw: Record<string, any>): UnwrappedReportResponse<T> {
  if (raw?.data === undefined || raw?.data === null) {
    throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  }

  const meta: PaginationMeta | null = raw.meta
    ? {
        page: raw.meta.page ?? 1,
        limit: raw.meta.limit ?? 100,
        total: raw.meta.total ?? 0,
        totalPages: raw.meta.total_pages ?? 1,
      }
    : null;

  return { data: raw.data as T, meta };
}

export function mapImbalance(raw: RawImbalance): NormalizedImbalance {
  return {
    isBalanced: raw?.is_balanced ?? true,
    delta: raw?.delta ?? 0,
  };
}
