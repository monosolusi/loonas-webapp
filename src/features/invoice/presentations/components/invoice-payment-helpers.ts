import { DateTime } from "luxon";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import { CashPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/cash-pay-in-detail";
import { QrisPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/qris-pay-in-detail";

export type InvoicePaymentStatusKind = "paid" | "pending";
export type InvoiceSettlementKind = "settled" | "settling" | "na";

/**
 * Cashier-facing "did we receive the customer's payment?" signal.
 * Reads pay_in_detail.detail.status directly. Cash is atomically PAID; QRIS
 * flips PENDING_PAYMENT → PAID via webhook. Any other status (or null) is
 * treated defensively as pending.
 */
export function deriveInvoicePaymentStatusKind(invoice: OutgoingInvoiceEntity): InvoicePaymentStatusKind {
  return invoice.payInDetail?.detail?.status === PayInStatus.PAID ? "paid" : "pending";
}

/**
 * Operator-facing "has the money settled to the merchant bank?" signal.
 * Drives off invoice.status (PENDING_BANK_TRANSFER → PAID after Xendit
 * settlement). Cash has no settlement step.
 */
export function deriveInvoiceSettlementKind(invoice: OutgoingInvoiceEntity): InvoiceSettlementKind {
  if (invoice.payInDetail?.detail?.type !== PayInType.QRIS) return "na";
  if (invoice.status === OutgoingInvoiceStatus.PAID) return "settled";
  if (invoice.status === OutgoingInvoiceStatus.PENDING_BANK_TRANSFER) return "settling";
  return "na";
}

export function isInvoicePaymentPending(invoice: OutgoingInvoiceEntity): boolean {
  return deriveInvoicePaymentStatusKind(invoice) === "pending";
}

export function isInvoicePayInQris(invoice: OutgoingInvoiceEntity): boolean {
  return invoice.payInDetail?.detail instanceof QrisPayInDetailEntity;
}

export function isInvoicePayInCash(invoice: OutgoingInvoiceEntity): boolean {
  return invoice.payInDetail?.detail instanceof CashPayInDetailEntity;
}

export function formatPayInMethodLabel(type: PayInType | null | undefined): string {
  if (type === PayInType.CASH) return "Tunai";
  if (type === PayInType.QRIS) return "QRIS";
  return "—";
}

export function formatInvoiceDateTime(dt: DateTime): string {
  return dt.isValid ? dt.setLocale("id-ID").toFormat("dd LLL yyyy, HH:mm") : "";
}

export function formatInvoiceTimeOnly(dt: DateTime): string {
  return dt.isValid ? dt.setLocale("id-ID").toFormat("dd LLL, HH:mm") : "";
}
