import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

/**
 * Formats an amount in the currency the ledger reports it in. Sign-free by contract: a
 * movement's `amount` is always positive (`CHECK (amount > 0)`) and the sign is carried by
 * `direction`, so this helper applies no sign of its own and never takes one as input.
 */
export function formatMoney(amount: number, currency: string): string {
  if (currency === "IDR") return IDRFormatter.toCurrency(amount);
  return `${currency} ${IDRFormatter.toThousand(amount)}`;
}
