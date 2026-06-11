import Image from "next/image";
import {
  CreateInvoiceStepperProps,
  State,
  StateValue,
} from "@/features/invoice/presentations/components/create-invoice-stepper.types";
import { useMemo } from "react";

const STATE: Record<State, StateValue> = {
  active: {
    backgroundColor: "bg-primary-300/10",
    borderColor: "border-primary-300",
    description: "Sedang aktif",
    descriptionForeground: "text-primary-300",
  },
  completed: {
    backgroundColor: "bg-primary-300",
    borderColor: "border-primary-300",
    descriptionForeground: "text-neutral-400",
  },
  default: {
    backgroundColor: "bg-white",
    borderColor: "border-neutral-200",
    descriptionForeground: "text-neutral-400",
  },
};

export function CreateInvoiceStepper(props: CreateInvoiceStepperProps) {
  const { backgroundColor, borderColor, description, descriptionForeground, iconPath } = useMemo(() => {
    const iconPath =
      props.state === "completed"
        ? "/assets/images/check-icon-white-w18-h18.svg"
        : props.state === "active"
          ? props.iconPath.active
          : props.iconPath.default;
    return Object.assign({}, { description: props.description, iconPath }, STATE[props.state ?? "default"]);
  }, [props.state, props.iconPath, props.description]);

  return (
    <div className="flex flex-row items-center gap-x-4 p-2">
      <div
        className={`flex size-10 flex-col items-center justify-center rounded-lg border ${backgroundColor} ${borderColor}`}
      >
        <div className="size-4">
          <Image src={iconPath} alt="Document Icon" width={16} height={16} />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="text-sm leading-5 font-bold">{props.title}</div>
        <div className={`text-xs leading-4 ${descriptionForeground}`}>{description}</div>
      </div>
      {props.state === "active" && (
        <div className="size-4">
          <Image
            src="/assets/images/arrow-right-chevron-icon-primary-300-w16-h16.svg"
            alt="Arrow Right Chevron Icon"
            width={16}
            height={16}
          />
        </div>
      )}
    </div>
  );
}
