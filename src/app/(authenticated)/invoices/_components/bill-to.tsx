import React from "react";

interface BillToProps {
  name: string;
  phoneNumber: string;
  email: string;
}

export function BillTo(props: BillToProps) {
  return (
    <>
      <div className="flex-1 text-neutral-300 italic">Tagihan Untuk</div>
      <div className="flex-1 text-base font-semibold text-neutral-500">{props.name}</div>
      <div className="flex-1 text-neutral-300">Telp. {props.phoneNumber}</div>
      <div className="flex-1 text-neutral-300">Email. {props.email}</div>
    </>
  );
}
