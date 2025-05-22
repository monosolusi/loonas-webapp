import React from "react";

export function Table(props: { children: React.ReactNode; }) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      {props.children}
    </table>
  );
}
