import { Table } from "@/core/presentations/components/table";
import { TableBody } from "@/core/presentations/components/table-body";
import { TableContainer } from "@/core/presentations/components/table-container";
import { TableHeader } from "@/core/presentations/components/table-header";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { DateTime } from "luxon";

interface DocumentTableProps {
  data: {
    documentName: string;
    invoiceNumber?: string;
    notes?: string;
    invoiceDate: DateTime;
    dueDate: DateTime;
    amount: number;
  }[];
}

export function DocumentTable(props: DocumentTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHeader
          items={[
            { node: "Dokumen", hideOnMobile: false },
            { node: "Tanggal Faktur", hideOnMobile: true },
            { node: "Tanggal Jatuh Tempo", hideOnMobile: true },
            { node: "Jumlah", hideOnMobile: true },
          ]}
        />
        <TableBody
          items={props.data.map((item) => ({
            row: [
              {
                node: (
                  <div className="flex flex-col space-y-1">
                    <div className="text-xs text-gray-500">{item.invoiceNumber}</div>
                    <div className="font-semibold text-gray-900">
                      <div className="max-w-[220px] overflow-hidden overflow-ellipsis">{item.documentName}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div className="max-w-[220px] overflow-hidden overflow-ellipsis">{item.notes}</div>
                    </div>
                  </div>
                ),
                hideOnMobile: false,
              },
              {
                node: item.invoiceDate.setLocale("id-id").toLocaleString(DateTime.DATE_FULL),
                hideOnMobile: true,
              },
              {
                node: item.dueDate.setLocale("id-id").toLocaleString(DateTime.DATE_FULL),
                hideOnMobile: true,
              },
              {
                node: IDRFormatter.toCurrency(item.amount),
                hideOnMobile: true,
              },
            ],
          }))}
        />
      </Table>
    </TableContainer>
  );
}
