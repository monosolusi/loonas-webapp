const ICON_BY_TYPE: Record<string, string> = {
  cash: "/assets/images/cash-icon-neutral-400-w24-h24.svg",
  qris: "/assets/images/qris-icon-neutral-400-w24-h24.svg",
  credit_card: "/assets/images/card-icon-neutral-400-w24-h24.svg",
  debit_card: "/assets/images/card-icon-neutral-400-w24-h24.svg",
  card: "/assets/images/card-icon-neutral-400-w24-h24.svg",
  voucher: "/assets/images/voucher-icon-neutral-400-w24-h24.svg",
};

const FALLBACK_ICON = "/assets/images/card-icon-neutral-400-w24-h24.svg";

export function getPaymentMethodIconSrc(type: string): string {
  return ICON_BY_TYPE[String(type ?? "").toLowerCase()] ?? FALLBACK_ICON;
}
