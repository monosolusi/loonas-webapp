import { InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { TableMainCell } from "@/core/presentations/components/table-main-cell";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { TableContainer } from "@/core/presentations/components/table-container";
import { Table } from "@/core/presentations/components/table";

export interface TableItem {
  invoiceId: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: DateTime;
}

interface InvoiceTableProps {
  data: TableItem[];
}

export function InvoiceTable(props: InvoiceTableProps) {
  const formatId = (id: string) => {
    return id.split("-").at(0)?.toUpperCase();
  };

  const formattedData = useMemo(() => {
    return props.data.map((item) => ({
      row: [
        {
          node: <TableMainCell href={`/invoices/incoming/${item.invoiceId}`}>{formatId(item.invoiceId)}</TableMainCell>,
          hideOnMobile: false
        },
        { node: IDRFormatter.toCurrency(item.amount), hideOnMobile: false },
        { node: <InvoiceStatusChip status={item.status} />, hideOnMobile: true },
        { node: item.createdAt.setLocale("id").toFormat("dd LLL yyyy, HH:mm"), hideOnMobile: false }
      ]
    }));
  }, [props.data]);

  return (
    <TableContainer>
      <Table>
        <TableHeader items={[
          { node: "No. Faktur", hideOnMobile: false },
          { node: "Total Tagihan", hideOnMobile: false },
          { node: "Status", hideOnMobile: true },
          { node: "Tanggal Dibuat", hideOnMobile: false }
        ]} />
        <TableBody items={formattedData} />
      </Table>
    </TableContainer>
  );
}
