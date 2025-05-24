import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { TableContainer } from "@/core/presentations/components/table-container";
import React, { useMemo } from "react";
import { TableMainCell } from "@/core/presentations/components/table-main-cell";

export interface ClientItem {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface ClientTableProps {
  data: ClientItem[];
}

export function ClientTable(props: ClientTableProps) {

  const generatedBodyItems = useMemo(() => {
    return props.data.map((client) => ({
      row: [
        {
          node: <TableMainCell href={`/clients/${client.id}`}>{client.name}</TableMainCell>,
          hideOnMobile: false
        },
        { node: client.email, hideOnMobile: true },
        { node: client.phoneNumber, hideOnMobile: false }
      ]
    }));
  }, [props.data]);

  return (
    <TableContainer>
      <Table>
        <TableHeader items={[
          { node: "Nama", hideOnMobile: false },
          { node: "Email", hideOnMobile: true },
          { node: "Nomor Telpon", hideOnMobile: false }
        ]} />
        <TableBody items={generatedBodyItems} />
      </Table>
    </TableContainer>
  );
}
