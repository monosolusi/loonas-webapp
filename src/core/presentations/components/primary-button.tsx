"use client";

import clsx from "clsx";
import { Button, ButtonProps } from "@/core/presentations/components/button";
import { useMemo } from "react";

type PrimaryButtonProps = { inverse?: boolean } & ButtonProps;

export function PrimaryButton(props: PrimaryButtonProps) {
  const cleanedProps = useMemo(() => {
    const { inverse, ...rest } = props;
    return rest;
  }, [props]);

  return (
    <Button
      {...cleanedProps}
      label={props.label}
      className={clsx(
        props.className,
        "cursor-not-allowed disabled:bg-neutral-200 disabled:text-white",
        props.inverse ? "text-primary-300 bg-white" : "bg-primary-300 text-white",
      )}
    />
  );
}
