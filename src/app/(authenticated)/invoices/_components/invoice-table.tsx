"use client";

import React, { useMemo } from "react";
import { DateTime } from "luxon";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { EmptyInvoiceState } from "@/app/(authenticated)/invoices/_components/empty-invoice-state";
import { TableContainer } from "@/core/presentations/components/table-container";
import { TableHeader } from "@/core/presentations/components/table-header";
import { Table } from "@/core/presentations/components/table";
import { TableBody } from "@/core/presentations/components/table-body";
import { InvoiceTypeIcon } from "@/app/(authenticated)/invoices/_components/invoice-type-icon";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import Link from "next/link";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";

export interface InvoiceRow {
  id: string;
  displayId: string;
  type: InvoiceType;
  partnerName: string;
  total: number;
  status: InvoiceStatus;
  createdAt: DateTime;
}

interface InvoiceTableProps {
  data: InvoiceRow[];
}

export function InvoiceTable(props: InvoiceTableProps) {
  const generatedBodyItems = useMemo(() => {
    return props.data.map((row) => ({
      row: [
        { node: <InvoiceTypeIcon type={row.type} />, hideOnMobile: true },
        {
          node: (
            <Link href={`/invoices/${row.id}`} className="text-primary-default line-clamp-2 font-bold hover:underline">
              {row.displayId}
            </Link>
          ),
          hideOnMobile: false,
        },
        { node: row.partnerName, hideOnMobile: false },
        { node: IDRFormatter.toCurrency(row.total), hideOnMobile: false },
        { node: <InvoiceStatusChip status={row.status} />, hideOnMobile: false },
        { node: row.createdAt.setLocale("id").toFormat("dd LLL yyyy, HH:mm"), hideOnMobile: false },
      ],
    }));
  }, [props.data]);

  if (props.data.length === 0) return <EmptyInvoiceState />;
  return (
    <TableContainer>
      <Table>
        <TableHeader
          items={[
            { node: <></>, hideOnMobile: false },
            { node: "ID Invoice", hideOnMobile: false },
            { node: "Nama Klien", hideOnMobile: false },
            { node: "Total", hideOnMobile: false },
            { node: "Status", hideOnMobile: false },
            { node: "Tanggal Dibuat", hideOnMobile: false },
          ]}
        />
        <TableBody items={generatedBodyItems} />
      </Table>
    </TableContainer>
  );
}
