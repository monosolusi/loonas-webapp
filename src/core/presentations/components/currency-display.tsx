"use client";

import { useEffect, useState } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

interface CurrencyDisplayProps {
  value: number;
}

export function CurrencyDisplay({ value }: CurrencyDisplayProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(IDRFormatter.toCurrency(value));
  }, [value]);

  if (formatted === null) return null;
  return <span>{formatted}</span>;
}
