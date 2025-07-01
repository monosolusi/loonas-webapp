import React from "react";

interface CardDetailItemProps {
  label: string;
  children: React.ReactNode;
}

export function CardDetailItem(props: CardDetailItemProps) {
  return (
    <div className="flex flex-col">
      <div className="flex-1 text-xs font-semibold text-gray-900">{props.label}</div>
      <div className="flex-1 text-base text-gray-500">{props.children}</div>
    </div>
  );
}
