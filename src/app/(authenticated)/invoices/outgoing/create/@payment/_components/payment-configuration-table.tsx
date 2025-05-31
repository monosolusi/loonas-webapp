import React, { useMemo } from "react";
import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { Switch } from "@headlessui/react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TableContainer } from "@/core/presentations/components/table-container";

export interface PaymentSchemeItem {
  image: string;
  name: string;
}

export interface PaymentConfigurationItem {
  id: string;
  name: string;
  isEnabled: boolean;
  paymentSchemes: PaymentSchemeItem[];
  feeInText: string;
}

interface PaymentConfigurationTableProps {
  data: PaymentConfigurationItem[];
}

export function PaymentConfigurationTable(props: PaymentConfigurationTableProps) {
  const formattedData = useMemo(() => {
    return props.data.map((item) => ({
      row: [
        {
          node: (
            <div className="flex flex-col space-y-2">
              <div className="font-semibold text-gray-500">{item.name}</div>
              <div className="flex flex-row items-center space-x-2">
                <Switch
                  checked={true}
                  onChange={() => {}}
                  className="group data-checked:bg-primary-default inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition"
                >
                  <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
                </Switch>
                <div className="text-gray-900">Aktif</div>
              </div>
            </div>
          ),
          hideOnMobile: false,
        },
        {
          node: (
            <div className="flex flex-row space-x-3">
              {item.paymentSchemes.map((scheme) => (
                <img key={scheme.name} className="h-4 object-contain" alt={scheme.name} src={scheme.image} />
              ))}
            </div>
          ),
          hideOnMobile: true,
        },
        { node: item.feeInText, hideOnMobile: false },
        {
          node: (
            <SelectInput
              data={[
                {
                  value: "INVOICE_RECEIVER",
                  label: "Ditanggung Penerima",
                },
                { value: "INVOICE_SENDER", label: "Ditanggung Kamu" },
              ]}
            />
          ),
          hideOnMobile: false,
        },
      ],
    }));
  }, [props.data]);

  return (
    <TableContainer>
      <Table>
        <TableHeader
          items={[
            { node: "Status", hideOnMobile: false },
            { node: "Channel", hideOnMobile: true },
            { node: "Biaya", hideOnMobile: false },
            { node: "Penanggung Biaya", hideOnMobile: false },
          ]}
        />
        <TableBody items={formattedData} />
      </Table>
    </TableContainer>
  );
}
