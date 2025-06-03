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
        <img alt="signature" className="w-1/2" src={URL.createObjectURL(props.signature)} />
      ) : props.signatureUrl ? (
        <img alt="signature" className="w-1/2" src={props.signatureUrl} />
      ) : (
        <div className="w-1/2 bg-gray-50 py-16 text-center font-semibold text-gray-500">
          Tidak memiliki tanda tangan
        </div>
      )}

      <div className="text-gray-500">{props.signerName}</div>
    </div>
  );
}
