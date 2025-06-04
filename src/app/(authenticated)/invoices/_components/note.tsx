import { ExtraInvoiceNote } from "@/app/(authenticated)/invoices/_components/extra-invoice-note";

interface NoteProps {
  note?: string;
}

export function Note(props: NoteProps) {
  if (!props.note) return null;
  return <ExtraInvoiceNote title="Keterangan">{props.note}</ExtraInvoiceNote>;
}
