import React from "react";

interface BillToProps {
  name: string;
  phoneNumber: string;
  email: string;
}

export function BilLTo(props: BillToProps) {
  return (
    <>
      <div className="flex-1 text-gray-500 italic">Tagihan Untuk</div>
      <div className="flex-1 text-base font-semibold text-gray-900">{props.name}</div>
      <div className="flex-1 text-gray-500">Telp. {props.phoneNumber}</div>
      <div className="flex-1 text-gray-500">Email. {props.email}</div>
    </>
  );
}
