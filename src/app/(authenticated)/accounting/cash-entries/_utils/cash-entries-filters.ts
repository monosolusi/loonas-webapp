import { DateTime } from "luxon";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { ListCashEntriesUseCaseParams } from "@/features/accounting/domain/usecases/list-cash-entries.usecases";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";

type DateRange = { from: Date | undefined; to: Date | undefined };

/**
 * Parse the `?direction=` URL param into a `CashEntryDirection`. Any value other than the two
 * live enum members (`in` | `out`) — missing, empty, or unknown — resolves to `undefined`,
 * i.e. "Semua" (no direction filter). Never throws on a malformed/stale URL.
 */
export function parseDirectionParam(raw: string | null): CashEntryDirection | undefined {
  if (raw === CashEntryDirection.In) return CashEntryDirection.In;
  if (raw === CashEntryDirection.Out) return CashEntryDirection.Out;
  return undefined;
}

type ResolveListParamsArgs = {
  page: number;
  direction: CashEntryDirection | undefined;
  range: DateRange;
};

/**
 * Serialise the list page's filter state into `ListCashEntriesUseCaseParams`. `dateFrom`/`dateTo`
 * are both-or-neither: emitted only when both bounds of `range` are present, a partial pick
 * emits neither (the endpoint itself 400s on a lone `date_from`/`date_to`).
 */
export function resolveListParams({ page, direction, range }: ResolveListParamsArgs): ListCashEntriesUseCaseParams {
  const hasCompleteRange = range.from !== undefined && range.to !== undefined;

  return {
    page,
    limit: DEFAULT_PAGE_SIZE,
    direction,
    dateFrom: hasCompleteRange ? DateTime.fromJSDate(range.from as Date).toFormat("yyyy-MM-dd") : undefined,
    dateTo: hasCompleteRange ? DateTime.fromJSDate(range.to as Date).toFormat("yyyy-MM-dd") : undefined,
  };
}
