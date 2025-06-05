"use client";

import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { useParams } from "next/navigation";
import { ErrorDisplay } from "@/core/presentations/components/error-display";

export function ErrorDisplayImpl() {
  const { id } = useParams<{ id: string }>();
  const { error } = useGetOutgoingInvoice({ id });

  if (!error) return null;
  console.error(error);
  
  return <ErrorDisplay>{error.message}</ErrorDisplay>;
}
