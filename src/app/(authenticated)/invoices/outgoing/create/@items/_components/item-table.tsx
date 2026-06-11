import React, { useMemo } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { AddItemTableButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-table-button";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { EditRowButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/edit-row-button";
import { DeleteRowButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/delete-row-button";

export interface ItemRow {
  name: string;
  description?: string;
  qty: number;
  price: number;
  discountType: DiscountType;
  discount: number;
  taxBase: number;
  tax: number;
  taxType: TaxType;
  total: number;
}

interface ItemTableProps {
  data: ItemRow[];
}

export function ItemTable(props: ItemTableProps) {
  const totalTaxBase = useMemo(() => {
    return props.data.reduce((sum, row) => sum + row.taxBase, 0);
  }, [props.data]);

  const totalTax = useMemo(() => {
    return props.data.reduce((sum, row) => sum + row.tax, 0);
  }, [props.data]);

  const totalAmount = useMemo(() => {
    return props.data.reduce((sum, row) => sum + row.total, 0);
  }, [props.data]);

  const nonTaxableAmount = useMemo(() => {
    return props.data.filter((row) => row.taxType === TaxType.NON_TAXABLE).reduce((sum, row) => sum + row.total, 0);
  }, [props.data]);

  const formatDiscount = (row: ItemRow): string | null => {
    if (!row.discountType || !row.discount) return null;
    if (row.discountType === DiscountType.PERCENTAGE) return `${row.discount}%`;
    if (row.discountType === DiscountType.FIXED) return IDRFormatter.toCurrency(row.discount);
    return null;
  };

  return (
    <div className="overflow-hidden rounded-sm shadow-sm ring-1 ring-black/5">
      {/* Item rows */}
      <div className="divide-y divide-neutral-200 bg-white">
        {props.data.map((row, index) => (
          <div key={index} className="group cursor-pointer px-4 py-3 hover:bg-neutral-50">
            <div className="flex items-start justify-between gap-x-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-neutral-500 group-hover:underline">{row.name}</div>
                {row.description && <div className="text-xs text-neutral-300">{row.description}</div>}
              </div>
              <div className="flex shrink-0 items-center gap-x-3">
                <span className="text-sm font-semibold text-neutral-500">{IDRFormatter.toCurrency(row.total)}</span>
                <div className="flex items-center gap-x-2">
                  <EditRowButton dataIndex={index} />
                  <DeleteRowButton data={{ name: row.name }} dataIndex={index} />
                </div>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-1 text-xs text-neutral-200">
              <span>{row.qty} × {IDRFormatter.toCurrency(row.price)}</span>
              {formatDiscount(row) && (
                <>
                  <span>·</span>
                  <span>Diskon: {formatDiscount(row)}</span>
                </>
              )}
              {row.taxBase > 0 && (
                <>
                  <span>·</span>
                  <span>DPP: {IDRFormatter.toCurrency(row.taxBase)}</span>
                </>
              )}
              {row.tax > 0 && (
                <>
                  <span>·</span>
                  <span>Pajak: {IDRFormatter.toCurrency(row.tax)}</span>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add item row */}
        <div className="cursor-pointer py-1">
          <AddItemTableButton />
        </div>
      </div>

      {/* Summary footer */}
      <div className="divide-y divide-neutral-200 bg-neutral-50 text-sm">
        <div className="flex items-baseline justify-end gap-x-4 px-4 pt-4 pb-2">
          <span>Dasar Pengenaan Pajak (DPP)</span>
          <span className="w-36 text-right">{totalTaxBase === 0 ? "-" : IDRFormatter.toCurrency(totalTaxBase)}</span>
        </div>
        <div className="flex items-baseline justify-end gap-x-4 px-4 py-2">
          <span>Total Pajak</span>
          <span className="w-36 text-right">{totalTax === 0 ? "-" : IDRFormatter.toCurrency(totalTax)}</span>
        </div>
        <div className="flex items-baseline justify-end gap-x-4 px-4 py-2">
          <span>Total Non-Pajak</span>
          <span className="w-36 text-right">
            {nonTaxableAmount === 0 ? "-" : IDRFormatter.toCurrency(nonTaxableAmount)}
          </span>
        </div>
        <div className="flex items-baseline justify-end gap-x-4 px-4 pt-2 pb-4">
          <span>Grand Total Faktur</span>
          <span className="w-36 text-right font-bold underline">
            {totalAmount === 0 ? "-" : IDRFormatter.toCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
