import React from "react";

interface SenderInformationProps {
  senderName: string;
  address: string;
  phoneNumber?: string;
  email?: string;
}

export function SenderInformation(props: SenderInformationProps) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="font-light text-gray-500 italic">Informasi Perusahaan</div>
      <h3 className="text-xl font-semibold text-gray-900">{props.senderName}</h3>
      <div className="font-light text-gray-500">{props.address}</div>
      {props.phoneNumber && <div className="font-light text-gray-500">Telp. {props.phoneNumber}</div>}
      {props.email && <div className="font-light text-gray-500">Email: {props.email}</div>}
    </div>
  );
}
