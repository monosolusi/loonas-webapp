import { ExtraInvoiceNote } from "@/app/(authenticated)/invoices/_components/extra-invoice-note";

interface TncProps {
  tnc?: string;
}

export function Tnc(props: TncProps) {
  return <ExtraInvoiceNote title="Syarat & Ketentuan">{props.tnc}</ExtraInvoiceNote>;
}
