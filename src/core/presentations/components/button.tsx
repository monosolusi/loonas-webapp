import React, { useMemo } from "react";
import clsx from "clsx";

export type ButtonProps = {
  rightIcon?: React.ReactNode; // Must be width and height props of 16x16
  label: string;
} & React.ComponentPropsWithoutRef<"button">;

export function Button(props: ButtonProps) {
  const cleanedButtonProps = useMemo(() => {
    const { label, className, rightIcon, ...rest } = props;
    return rest;
  }, [props]);

  return (
    <button
      {...cleanedButtonProps}
      className={clsx(
        "flex h-11 cursor-pointer flex-row items-center justify-center rounded-lg p-3.5",
        props.className,
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        <span className="text-base">{props.label}</span>
        {props.rightIcon && <div className="shrink-0">{props.rightIcon}</div>}
      </div>
    </button>
  );
}
