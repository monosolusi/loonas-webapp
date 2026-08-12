"use client";

import clsx from "clsx";

type ChannelOptionProps = {
  label: string;
  description: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
};

export function ChannelOption(props: ChannelOptionProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={clsx(
        "flex flex-1 flex-col items-start gap-y-1 rounded-lg border border-solid p-3 text-left transition-all",
        props.selected ? "border-primary-300 bg-primary-300/5" : "border-neutral-100 bg-white hover:bg-neutral-50",
        props.disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span className={clsx("text-sm font-medium", props.selected ? "text-primary-300" : "text-neutral-500")}>
        {props.label}
      </span>
      <span className="text-xs text-neutral-300">{props.description}</span>
    </button>
  );
}