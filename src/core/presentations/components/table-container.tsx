import React from "react";

interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function TableContainer(props: TableContainerProps) {
  return (
    <div className="inline-block min-w-full py-2 align-middle">
      <div className={classNames("overflow-hidden rounded-md shadow-sm ring-1 ring-black/5", props.className)}>
        {props.children}
      </div>
    </div>
  );
}
