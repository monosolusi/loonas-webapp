import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";

export const POS_RECEIPT_COPY = {
  HEADER_LABEL: "STRUK",
  SUBTOTAL_LABEL: "Subtotal",
  TOTAL_LABEL: "Total",
  METHOD_LABEL: "Metode Bayar",
  STATUS_LABEL: "Status Pembayaran",
  CUSTOMER_LABEL: "Pelanggan",
  CHANGE_LABEL: "Kembalian",
  SETTLEMENT_LABEL: "Settlement",
  NOTE_LABEL: "Catatan",
  TIER_BADGE_LABEL: "Grosir",
  TIER_BRACKET_LABEL: "Harga grosir · mulai",
  TIER_LIST_PRICE_LABEL: "Harga normal",
} as const;

export function formatPosReceiptPayInMethodLabel(type: PayInType | null | undefined): string {
  if (type === PayInType.CASH) return "Bayar Tunai";
  if (type === PayInType.QRIS) return "Bayar QRIS";
  return "—";
}
