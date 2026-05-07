import { DateTime } from "luxon";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { PayInDetailStatus } from "@/features/pos/domain/enums/pay-in-detail-status";
import { PayInMethod } from "@/features/pos/domain/enums/pay-in-method";

export type PosSaleStatusKind = "paid" | "pending";
export type PosSaleSettlementKind = "settled" | "settling" | "na";

/**
 * Cashier-facing "did we receive the customer's payment?" signal.
 * Reads pay_in_detail.status directly. Cash is atomically PAID; QRIS flips
 * PENDING_PAYMENT → PAID via webhook. Any other status (or null) is treated
 * defensively as pending.
 */
export function derivePosSaleStatusKind(sale: PosSaleEntity): PosSaleStatusKind {
  return sale.payInDetail?.status === PayInDetailStatus.PAID ? "paid" : "pending";
}

/**
 * Operator-facing "has the money settled to the merchant bank?" signal.
 * Drives off invoice.status (PENDING_BANK_TRANSFER → PAID after Xendit
 * settlement). Cash has no settlement step.
 */
export function derivePosSaleSettlementKind(sale: PosSaleEntity): PosSaleSettlementKind {
  if (sale.payInDetail?.method !== PayInMethod.QRIS) return "na";
  if (sale.status === OutgoingInvoiceStatus.PAID) return "settled";
  if (sale.status === OutgoingInvoiceStatus.PENDING_BANK_TRANSFER) return "settling";
  return "na";
}

export function isPosSalePending(sale: PosSaleEntity): boolean {
  return derivePosSaleStatusKind(sale) === "pending";
}

export function isPosSaleQris(sale: PosSaleEntity): boolean {
  return sale.payInDetail?.method === PayInMethod.QRIS;
}

export function formatPayInMethodLabel(method: PayInMethod | null | undefined): string {
  if (method === PayInMethod.CASH) return "Tunai";
  if (method === PayInMethod.QRIS) return "QRIS";
  return "—";
}

export function formatPosSaleDateTime(iso: string): string {
  const dt = DateTime.fromISO(iso);
  return dt.isValid ? dt.setLocale("id-ID").toFormat("dd LLL yyyy, HH:mm") : iso;
}

export function formatPosSaleTimeOnly(iso: string): string {
  const dt = DateTime.fromISO(iso);
  return dt.isValid ? dt.setLocale("id-ID").toFormat("dd LLL, HH:mm") : iso;
}
