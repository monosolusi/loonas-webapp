"use client";

import React, { useMemo } from "react";
import { TableContainer } from "@/core/presentations/components/table-container";
import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";

export interface ClientItem {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface ClientTableProps {
  data: ClientItem[];
  onItemSelected?: (item: ClientItem) => void;
}

export function ClientTable(props: ClientTableProps) {

  const handleSelect = (item: ClientItem) => {
    if (props.onItemSelected) props.onItemSelected(item);
  };

  const generatedData = useMemo(() => {
    return props.data.map((client) => ({
      row: [
        { node: client.name, hideOnMobile: false },
        { node: client.email, hideOnMobile: true },
        { node: client.phoneNumber, hideOnMobile: false },
        {
          node: (
            <div
              className="text-primary-default hover:text-primary-900 cursor-pointer"
              onClick={() => handleSelect(client)}
            >
              Pilih
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
          { node: "Nama", hideOnMobile: false },
          { node: "Email", hideOnMobile: true },
          { node: "Nomor Telpon", hideOnMobile: false },
          { node: "", hideOnMobile: false }
        ]} />
        <TableBody items={generatedData} />
      </Table>
    </TableContainer>
  );
}
