"use client";

import { useEffect } from "react";
import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { useParams } from "next/navigation";
import { ErrorDisplay } from "@/core/presentations/components/error-display";

export function ErrorDisplayImpl() {
  const { id } = useParams<{ id: string }>();
  const { error } = useGetOutgoingInvoice({ id });

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  if (!error) return null;
  return <ErrorDisplay>{error.message}</ErrorDisplay>;
}
