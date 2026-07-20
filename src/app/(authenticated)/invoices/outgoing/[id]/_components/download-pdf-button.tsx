"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";

export function DownloadPdfButton() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });

  if (!invoice || loading || !(invoice instanceof OutgoingInvoiceEntity)) return null;
  const pdfUrl = invoice.pdf?.publicUrl;
  const fileName = invoice.pdf?.name ?? `${invoice.invoiceNumber ?? "invoice"}.pdf`;

  if (!pdfUrl) return null;

  const onDownload = async () => {
    try {
      const response = await fetch(pdfUrl, { credentials: "omit", mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (_) {
      // Fallback: open in new tab (won't replace current window)
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  return <SecondaryButton outlined label="Download PDF" onClick={onDownload} />;
}
