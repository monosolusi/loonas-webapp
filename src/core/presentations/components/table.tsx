import React from "react";

export function Table(props: { children: React.ReactNode; }) {
  return (
    <table className="min-w-full divide-y divide-gray-300 table-auto md:table-fixed">
      {props.children}
    </table>
  );
}
