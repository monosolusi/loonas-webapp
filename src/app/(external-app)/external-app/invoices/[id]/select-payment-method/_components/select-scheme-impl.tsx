"use client";

import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { SelectScheme } from "./select-scheme";
import React from "react";

interface SelectSchemeImplProps {
  selectedMethod?: {
    id: string;
    title: string;
    requiresSchemeSelection: boolean;
    schemes?: { id: string; imageUrl: string; name: string }[];
  };
  value?: string;
  onChange?: (value: string | undefined) => void;
}

export function SelectSchemeImpl(props: SelectSchemeImplProps) {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetPublicOutgoingInvoice({ id });

  if (!props.selectedMethod) return null;
  if (!invoice || loading || !props.selectedMethod.requiresSchemeSelection) return null;
  if (!props.selectedMethod.schemes || props.selectedMethod.schemes.length === 0) return null;
  return (
    <SelectScheme
      title={`Pilih ${props.selectedMethod.title}`}
      data={props.selectedMethod.schemes}
      value={props.value}
      onChange={props.onChange}
    />
  );
}
