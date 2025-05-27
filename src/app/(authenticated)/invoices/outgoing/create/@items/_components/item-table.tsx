import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { TableContainer } from "@/core/presentations/components/table-container";
import React, { useMemo } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import {
  DiscountType,
  TaxType
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import {
  AddItemTableButton
} from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-table-button";

export interface ItemRow {
  name: string;
  description?: string;
  qty: number;
  price: number;
  discountType?: DiscountType;
  discount?: number;
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

  const generateDiscountString = (discountType?: DiscountType, discount?: number) => {
    if (!discountType || !discount) return "-";
    if (discountType === DiscountType.PERCENTAGE) return `${discount}%`;
    if (discountType === DiscountType.FIXED) return IDRFormatter.toCurrency(discount);
    return "-";
  };


  const formattedData = useMemo(() => {
    return props.data.map((row) => ({
      className: "group hover:bg-gray-50 cursor-pointer",
      row: [
        {
          node: (
            <div className="flex flex-col space-y-1">
              <div className="text-gray-900 font-bold group-hover:underline">
                {row.name}
              </div>
              {row.description && (<span className="text-xs text-gray-500">
                {row.description}
              </span>)}
            </div>
          ),
          hideOnMobile: false
        },
        { node: `${row.qty} / ${IDRFormatter.toCurrency(row.price)}`, hideOnMobile: false, className: "text-right" },
        {
          node: generateDiscountString(row.discountType, row.discount),
          hideOnMobile: false,
          className: "text-right"
        },
        {
          node: row.taxBase === 0 ? "-" : IDRFormatter.toCurrency(row.taxBase),
          hideOnMobile: false,
          className: "text-right"
        },
        { node: row.tax === 0 ? "-" : IDRFormatter.toCurrency(row.tax), hideOnMobile: false, className: "text-right" },
        { node: IDRFormatter.toCurrency(row.total), hideOnMobile: false, className: "text-right" },
        {
          node: (
            <div className="flex justify-center">
              <PencilSquareIcon className="size-5 text-gray-500" />
            </div>
          ),
          hideOnMobile: false
        }
      ]
    }));
  }, [props.data]);

  return (
    <TableContainer>
      <Table>
        <TableHeader items={[
          { node: "Nama Produk", hideOnMobile: false },
          { node: "Qty / Harga", hideOnMobile: false, className: "text-right" },
          { node: "Diskon", hideOnMobile: false, className: "text-right" },
          { node: "DPP", hideOnMobile: false, className: "text-right" },
          { node: "Pajak", hideOnMobile: false, className: "text-right" },
          { node: "Jumlah", hideOnMobile: false, className: "text-right" },
          { node: "", hideOnMobile: false }
        ]} />
        <TableBody items={[
          ...formattedData,
          {
            className: "cursor-pointer",
            row: [
              {
                node: <AddItemTableButton />,
                hideOnMobile: false,
                colSpan: 7
              }
            ]
          }
        ]} />
        <tfoot className="divide-y divide-gray-200 bg-gray-50">
        <tr>
          <td colSpan={5} className="text-sm text-right px-3 pt-4 pb-2">
            Dasar Pengenaan Pajak (DPP)
          </td>
          <td className="text-sm text-right px-3 pt-4 pb-2">
            {totalTaxBase === 0 ? "-" : IDRFormatter.toCurrency(totalTaxBase)}
          </td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={5} className="text-sm text-right px-3 py-2">
            Total Pajak
          </td>
          <td className="text-sm text-right px-3 py-2">
            {totalTax === 0 ? "-" : IDRFormatter.toCurrency(totalTax)}
          </td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={5} className="text-sm text-right px-3 py-2">
            Total Non-Pajak
          </td>
          <td className="text-sm text-right px-3 py-2">
            {nonTaxableAmount === 0 ? "-" : IDRFormatter.toCurrency(nonTaxableAmount)}
          </td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={5} className="text-sm text-right px-3 pt-2 pb-4">
            Grand Total Faktur
          </td>
          <td className="text-sm text-right font-bold underline px-3 pt-2 pb-4">
            {totalAmount === 0 ? "-" : IDRFormatter.toCurrency(totalAmount)}
          </td>
          <td></td>
        </tr>
        </tfoot>
      </Table>
    </TableContainer>
  );
}
