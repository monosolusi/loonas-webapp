"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void | Promise<void>;
  label?: string;
}

export function BackButton(props: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (props.onClick) props.onClick();
    else router.back();
  };

  return (
    <SecondaryButton
      outlined
      label={props.label ?? "Kembali"}
      leftIcon={<ArrowLeftIcon className="size-4" />}
      onClick={handleClick}
    />
  );
}
