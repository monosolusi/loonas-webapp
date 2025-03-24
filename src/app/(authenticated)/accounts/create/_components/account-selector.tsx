import { SelectorItem } from "@/core/presentations/components/selector-item";
import React from "react";

export function AccountSelector({ img, title, href, description, disabled }: {
  img?: string;
  title: string;
  href: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <SelectorItem
      image={img ? { src: img } : undefined}
      title={title}
      href={href}
      description={description}
      disabled={disabled}
    />
  );
}