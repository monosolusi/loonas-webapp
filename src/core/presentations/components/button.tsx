import React, { useMemo } from "react";
import clsx from "clsx";
import { Spinner } from "@/core/presentations/components/spinner";

export type ButtonProps = {
  leftIcon?: React.ReactNode; // Must be width and height props of 16x16
  rightIcon?: React.ReactNode; // Must be width and height props of 16x16
  label: string;
  loading?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

export function Button(props: ButtonProps) {
  const cleanedButtonProps = useMemo(() => {
    const { label, className, leftIcon, rightIcon, loading, ...rest } = props;
    return rest;
  }, [props]);

  return (
    <button
      {...cleanedButtonProps}
      className={clsx(
        "flex h-11 cursor-pointer flex-row items-center justify-center rounded-lg p-3.5",
        props.className,
      )}
      disabled={props.loading || props.disabled}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        {props.leftIcon && !props.loading && <div className="shrink-0">{props.leftIcon}</div>}
        {props.loading ? <Spinner /> : <span className="text-base">{props.label}</span>}
        {props.rightIcon && !props.loading && <div className="shrink-0">{props.rightIcon}</div>}
      </div>
    </button>
  );
}
