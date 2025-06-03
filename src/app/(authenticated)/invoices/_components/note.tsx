import { ExtraInvoiceNote } from "@/app/(authenticated)/invoices/_components/extra-invoice-note";

interface NoteProps {
  note?: string;
}

export function Note(props: NoteProps) {
  return <ExtraInvoiceNote title="Keterangan">{props.note}</ExtraInvoiceNote>;
}
