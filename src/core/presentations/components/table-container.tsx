import React from "react";

export function TableContainer(props: { children: React.ReactNode; }) {
  return (
    <div className="inline-block min-w-full py-2 align-middle">
      <div className="overflow-hidden shadow-sm ring-1 ring-black/5 ">
        {props.children}
      </div>
    </div>
  );
}
