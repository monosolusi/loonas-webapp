"use client";

import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React, { useMemo } from "react";
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

  const renderedLabel = useMemo(() => {
    if (props.label) return props.label;
    return "Kembali";
  }, [props.label]);

  return (
    <OutlinedButton onClick={handleClick}>
      <ArrowLeftIcon className="mt-0.5 mr-1 size-4" />
      {renderedLabel}
    </OutlinedButton>
  );
}
