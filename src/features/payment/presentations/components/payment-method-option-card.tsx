"use client";

import Image from "next/image";
import clsx from "clsx";

interface PaymentMethodOptionCardProps {
  title: string;
  feeLabel: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  iconSrc?: string;
}

export function PaymentMethodOptionCard(props: PaymentMethodOptionCardProps) {
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-4 rounded-lg border p-4",
        props.isDisabled ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50" : "cursor-pointer",
        !props.isDisabled && props.isSelected && "border-primary-300 bg-primary-300/5",
        !props.isDisabled && !props.isSelected && "border-neutral-200",
      )}
      onClick={props.onClick}
    >
      <div className="flex size-10 flex-row items-center justify-center rounded-lg border border-neutral-100">
        {props.iconSrc && props.iconSrc.startsWith("http") ? (
          <img src={props.iconSrc} alt="" className="h-5 w-5 object-contain" />
        ) : (
          <Image
            src={props.iconSrc ?? "/assets/images/credit-card-icon-neutral-400-w16-h16.svg"}
            alt=""
            width={20}
            height={20}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className={clsx("text-sm leading-5 font-bold", props.isDisabled && "text-neutral-400")}>
          {props.title}
        </div>
        <div className={clsx("text-xs leading-4", props.isDisabled && "text-neutral-400")}>
          Biaya {props.feeLabel}
        </div>
      </div>
      <div
        className={clsx(
          "size-5 rounded-full border-2",
          props.isDisabled
            ? "border-neutral-200 bg-neutral-100"
            : props.isSelected
              ? "border-primary-300 bg-primary-300"
              : "border-neutral-300 bg-white",
        )}
      />
    </div>
  );
}
