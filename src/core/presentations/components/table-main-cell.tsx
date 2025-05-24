import React from "react";
import Link from "next/link";

interface TableMainCellProps {
  href: string;
  children: React.ReactNode;
}

export function TableMainCell(props: TableMainCellProps) {
  return (
    <Link
      className="font-bold text-primary-default  hover:underline line-clamp-2"
      href={props.href}>
      {props.children}
    </Link>
  );
}
