import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { TableContainer } from "@/core/presentations/components/table-container";
import React, { useMemo } from "react";

export interface BankAccountItem {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface BankAccountProps {
  data: BankAccountItem[];
}

export function BankAccount(props: BankAccountProps) {
  const formattedData = useMemo(() => {
    return props.data.map((bank) => ({
      row: [
        { node: bank.bankName, hideOnMobile: false },
        { node: bank.accountNumber, hideOnMobile: false },
        { node: bank.accountHolderName, hideOnMobile: false }
      ]
    }));
  }, [props.data]);

  return (
    <TableContainer>
      <Table>
        <TableHeader items={[
          { node: "Nama Bank", hideOnMobile: false },
          { node: "No. Rekening", hideOnMobile: false },
          { node: "Atas Nama", hideOnMobile: false }
        ]} />
        <TableBody items={formattedData} />
      </Table>
    </TableContainer>
  );
}
