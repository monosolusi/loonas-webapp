import React from "react";

interface ExtraInvoiceNoteProps {
  title: string;
  children: React.ReactNode;
}

export function ExtraInvoiceNote(props: ExtraInvoiceNoteProps) {
  return (
    <div className="flex-1 flex-col space-y-1">
      <div className="font-semibold text-neutral-500">{props.title}</div>
      <div className="text-neutral-300">{props.children}</div>
    </div>
  );
}
