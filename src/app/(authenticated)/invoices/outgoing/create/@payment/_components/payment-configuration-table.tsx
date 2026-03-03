import React from "react";
import { Switch } from "@headlessui/react";
import { SelectInput } from "@/core/presentations/components/select-input";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import clsx from "clsx";

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
  chargeFeeOn: ChargeFeeOn;
}

interface PaymentConfigurationTableProps {
  data: PaymentConfigurationItem[];
  onEnableChange?: (params: { id: string; isEnabled: boolean }) => void;
  onChargeFeeOnChange?: (params: { id: string; chargeFeeOn: ChargeFeeOn }) => void;
}

function PaymentMethodCard(props: {
  item: PaymentConfigurationItem;
  onEnableChange?: (params: { id: string; isEnabled: boolean }) => void;
  onChargeFeeOnChange?: (params: { id: string; chargeFeeOn: ChargeFeeOn }) => void;
}) {
  const { item } = props;

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 rounded-lg border border-neutral-100 bg-white p-4 transition-all",
        !item.isEnabled && "opacity-50",
      )}
    >
      {/* Header: Toggle + Name */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <Switch
            checked={item.isEnabled}
            onChange={(checked) => props.onEnableChange?.({ id: item.id, isEnabled: checked })}
            className="group inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-neutral-100 transition data-[checked]:bg-primary-300"
          >
            <span className="size-4 translate-x-1 rounded-full bg-white shadow-sm transition group-data-[checked]:translate-x-6" />
          </Switch>
          <span className="text-base font-semibold text-gray-900">{item.name}</span>
        </div>
        <span className={clsx("text-xs font-medium", item.isEnabled ? "text-success-300" : "text-neutral-200")}>
          {item.isEnabled ? "Aktif" : "Non-Aktif"}
        </span>
      </div>

      {/* Schemes logos */}
      {item.paymentSchemes.length > 0 && (
        <div className="flex flex-row flex-wrap items-center gap-2">
          {item.paymentSchemes.map((scheme) => (
            <div key={scheme.name} className="flex h-8 items-center rounded-md border border-neutral-100 bg-white px-2">
              <img className="h-4 max-w-[48px] object-contain" alt={scheme.name} src={scheme.image} />
            </div>
          ))}
        </div>
      )}

      {/* Details: Fee + Charge selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-neutral-200">Biaya transaksi</span>
          <span className="text-sm font-medium text-gray-900">{item.feeInText}</span>
        </div>
        <div className="sm:w-[220px]">
          <SelectInput
            noLabel
            options={[
              { value: "INVOICE_RECEIVER", label: "Ditanggung Penerima" },
              { value: "INVOICE_SENDER", label: "Ditanggung Kamu" },
            ]}
            disabled={!item.isEnabled}
            value={item.chargeFeeOn}
            onChange={(value) => props.onChargeFeeOnChange?.({ id: item.id, chargeFeeOn: value as ChargeFeeOn })}
          />
        </div>
      </div>
    </div>
  );
}

export function PaymentConfigurationTable(props: PaymentConfigurationTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {props.data.map((item) => (
        <PaymentMethodCard
          key={item.id}
          item={item}
          onEnableChange={props.onEnableChange}
          onChargeFeeOnChange={props.onChargeFeeOnChange}
        />
      ))}
    </div>
  );
}
