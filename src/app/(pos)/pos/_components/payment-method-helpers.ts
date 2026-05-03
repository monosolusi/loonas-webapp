import { PricingEntity } from "@/features/payment/domain/entities/pricing";

const TYPE_LABELS: Record<string, string> = {
  cash: "Tunai",
  qris: "QR",
  credit_card: "Kartu Kredit",
  debit_card: "Kartu Debit",
  card: "Kartu",
  ewallet: "E-wallet",
  bank_transfer: "Transfer Bank",
};

export function paymentTypeLabel(type: string): string {
  const key = String(type ?? "").toLowerCase();
  return TYPE_LABELS[key] ?? "";
}

export function paymentFeeLabel(pricing: PricingEntity): string | null {
  const { baseFee, percentageFee } = pricing;
  if (!baseFee && !percentageFee) return null;

  const parts: string[] = [];
  if (percentageFee && percentageFee > 0) {
    parts.push(`${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(percentageFee)} %`);
  }
  if (baseFee && baseFee > 0) {
    parts.push(`Rp ${baseFee.toLocaleString("id-ID")}`);
  }
  return parts.length > 0 ? parts.join(" + ") : null;
}
