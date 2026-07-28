import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceItemEntity } from "@/features/invoice/domain/entities/invoice-item";
import { PriceSource } from "@/features/invoice/domain/enums/price-source";
import { InvoiceDetailEntity } from "@/features/invoice/domain/types/invoice-detail";

/**
 * Whether a grosir tier produced this line's price.
 *
 * The single sanctioned determination. Never compare `price` against `listPrice`: a tier
 * priced equal to the list price compares equal, and the line would silently render as
 * base-priced.
 */
export function isTierPricedItem(item: InvoiceItemEntity): boolean {
  return item.priceSource === PriceSource.TIER;
}

export function isIncomingInvoice(invoice: InvoiceDetailEntity): invoice is IncomingInvoiceEntity {
  return invoice instanceof IncomingInvoiceEntity;
}

export function isOutgoingInvoice(invoice: InvoiceDetailEntity): invoice is OutgoingInvoiceEntity {
  return invoice instanceof OutgoingInvoiceEntity;
}
