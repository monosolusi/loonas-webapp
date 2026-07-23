import React from "react";

interface ListPageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function ListPageHeader({ title, subtitle, action }: ListPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="leading-6 text-neutral-300">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
