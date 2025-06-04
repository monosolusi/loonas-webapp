import React from "react";
import { DateTime } from "luxon";

interface SignatureProps {
  signature?: File | null;
  signatureUrl?: string;
  invoiceDate: DateTime;
  signerName: string;
}

export function Signature(props: SignatureProps) {
  return (
    <div className="flex flex-col items-end space-y-4">
      <div className="text-gray-500">{props.invoiceDate.setLocale("id-id").toFormat("dd MMMM yyyy")}</div>
      {props.signature ? (
        <img alt="signature" className="" src={URL.createObjectURL(props.signature)} />
      ) : props.signatureUrl ? (
        <img alt="signature" className="" src={props.signatureUrl} />
      ) : (
        <div className="bg-gray-50 px-8 py-16 text-center font-semibold text-gray-500">Tidak memiliki tanda tangan</div>
      )}

      <div className="text-gray-500">{props.signerName}</div>
    </div>
  );
}
