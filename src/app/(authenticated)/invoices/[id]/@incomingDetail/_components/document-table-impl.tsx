"use client";

import { useGetIncomingInvoice } from "@/features/invoice/presentations/hooks/use-get-incoming-invoice";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { DocumentTable } from "./document-table";

export function DocumentTableImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetIncomingInvoice({ id, includes: "documents" });

  const data = useMemo(() => {
    console.log(invoice);
    if (!invoice?.documents) return [];
    return invoice.documents.map((doc) => ({
      documentName: doc.file?.name || "Dokumen Tanpa Nama",
      invoiceNumber: doc.invoiceNumber,
      notes: doc.note,
      invoiceDate: doc.invoiceDate,
      dueDate: doc.dueDate,
      amount: doc.amount,
    }));
  }, [invoice?.documents]);

  if (!invoice || loading) return null;
  return <DocumentTable data={data} />;
}
