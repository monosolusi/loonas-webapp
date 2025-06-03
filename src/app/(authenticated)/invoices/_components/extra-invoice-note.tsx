import React from "react";

interface ExtraInvoiceNoteProps {
  title: string;
  children: React.ReactNode;
}

export function ExtraInvoiceNote(props: ExtraInvoiceNoteProps) {
  return (
    <div className="flex-1 flex-col space-y-1">
      <div className="font-semibold text-gray-900">{props.title}</div>
      <div className="text-gray-500">{props.children}</div>
    </div>
  );
}
