import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { TableContainer } from "@/core/presentations/components/table-container";
import React, { useMemo } from "react";
import {
  DiscountType,
  useCreateOutgoingInvoice,
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { TaxType } from "@/features/tax/domain/enums/tax-type";

export function InvoiceItemTable() {
  const { items } = useCreateOutgoingInvoice();

  const totalTaxBase = useMemo(() => {
    return items.reduce((sum, row) => sum + row.taxBase, 0);
  }, [items]);

  const totalTax = useMemo(() => {
    return items.reduce((sum, row) => sum + row.tax, 0);
  }, [items]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, row) => sum + row.total, 0);
  }, [items]);

  const nonTaxableAmount = useMemo(() => {
    return items.filter((row) => row.taxType === TaxType.NON_TAXABLE).reduce((sum, row) => sum + row.total, 0);
  }, [items]);

  const generateDiscountString = (discountType?: DiscountType, discount?: number) => {
    if (!discountType || !discount) return "-";
    if (discountType === DiscountType.PERCENTAGE) return `${discount}%`;
    if (discountType === DiscountType.FIXED) return IDRFormatter.toCurrency(discount);
    return "-";
  };

  const formattedItems = useMemo(() => {
    if (!items) return [];
    return items.map((item) => ({
      row: [
        {
          node: (
            <div className="flex flex-col space-y-1">
              <div className="font-bold text-gray-900 group-hover:underline">{item.name}</div>
              <span className="text-xs text-gray-500">{item.description}</span>
            </div>
          ),
          hideOnMobile: false,
        },
        {
          node: `${item.qty} / ${IDRFormatter.toCurrency(item.price)}`,
          hideOnMobile: false,
          className: "text-right",
        },
        {
          node: generateDiscountString(item.discountType, item.discount),
          hideOnMobile: false,
          className: "text-right",
        },
        {
          node: item.taxBase ? "-" : IDRFormatter.toCurrency(item.taxBase),
          hideOnMobile: false,
          className: "text-right",
        },
        {
          node: item.tax ? "-" : IDRFormatter.toCurrency(item.tax),
          hideOnMobile: false,
          className: "text-right",
        },
        { node: IDRFormatter.toCurrency(110000), hideOnMobile: false, className: "text-right" },
      ],
    }));
  }, [items]);

  return (
    <TableContainer className="rounded-xs shadow-none">
      <Table>
        <TableHeader
          items={[
            { node: "Nama Produk", hideOnMobile: false },
            { node: "Qty / Harga", hideOnMobile: false, className: "text-right" },
            { node: "Diskon", hideOnMobile: false, className: "text-right" },
            { node: "DPP", hideOnMobile: false, className: "text-right" },
            { node: "Pajak", hideOnMobile: false, className: "text-right" },
            { node: "Jumlah", hideOnMobile: false, className: "text-right" },
          ]}
        />
        <TableBody items={formattedItems} />
        <tfoot className="divide-y divide-gray-200 bg-gray-50">
          <tr>
            <td colSpan={5} className="px-3 pt-4 pb-2 text-right text-sm">
              Dasar Pengenaan Pajak (DPP)
            </td>
            <td className="px-3 pt-4 pb-2 text-right text-sm">
              {totalTaxBase === 0 ? "-" : IDRFormatter.toCurrency(totalTaxBase)}
            </td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={5} className="px-3 py-2 text-right text-sm">
              Total Pajak
            </td>
            <td className="px-3 py-2 text-right text-sm">{totalTax === 0 ? "-" : IDRFormatter.toCurrency(totalTax)}</td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={5} className="px-3 py-2 text-right text-sm">
              Total Non-Pajak
            </td>
            <td className="px-3 py-2 text-right text-sm">
              {nonTaxableAmount === 0 ? "-" : IDRFormatter.toCurrency(nonTaxableAmount)}
            </td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={5} className="px-3 pt-2 pb-4 text-right text-sm">
              Grand Total Faktur
            </td>
            <td className="px-3 pt-2 pb-4 text-right text-sm font-bold underline">
              {totalAmount === 0 ? "-" : IDRFormatter.toCurrency(totalAmount)}
            </td>
          </tr>
        </tfoot>
      </Table>
    </TableContainer>
  );
}
