"use client";

import clsx from "clsx";
import { Button, ButtonProps } from "@/core/presentations/components/buttons/button";
import { useMemo } from "react";

type DangerButtonProps = {
  outlined?: boolean;
} & ButtonProps;

export function DangerButton(props: DangerButtonProps) {
  const { outlined = false, className, ...buttonProps } = props;

  const variantClasses = useMemo(() => {
    if (outlined) {
      return "border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500/10";
    }

    return "bg-red-500 text-white hover:bg-red-600";
  }, [outlined]);

  return (
    <Button
      {...buttonProps}
      className={clsx(
        "transition-colors duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        outlined
          ? "disabled:border-neutral-200 disabled:bg-transparent disabled:text-neutral-200"
          : "disabled:bg-neutral-200 disabled:text-white",
        variantClasses,
        className,
      )}
    />
  );
}
