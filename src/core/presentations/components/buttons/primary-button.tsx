"use client";

import clsx from "clsx";
import { Button, ButtonProps } from "@/core/presentations/components/buttons/button";
import { useMemo } from "react";

type PrimaryButtonProps = {
  inverse?: boolean;
  outlined?: boolean;
} & ButtonProps;

export function PrimaryButton(props: PrimaryButtonProps) {
  const { inverse = false, outlined = false, className, ...buttonProps } = props;

  const variantClasses = useMemo(() => {
    if (outlined) {
      return inverse
        ? "border-2 border-white text-white bg-transparent hover:bg-white/10"
        : "border-2 border-primary-300 text-primary-300 bg-transparent hover:bg-primary-300/10";
    }

    return inverse
      ? "bg-white text-primary-300 hover:bg-white/90"
      : "bg-primary-300 text-white hover:bg-primary-300/90";
  }, [outlined, inverse]);

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
