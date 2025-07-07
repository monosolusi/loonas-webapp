"use client";

import { useEffect, useState } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

interface CurrencyDisplayProps {
  value: number;
  className?: string;
}

export function CurrencyDisplay({ value, className }: CurrencyDisplayProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(IDRFormatter.toCurrency(value));
  }, [value]);

  if (formatted === null) return null;
  return <span className={className}>{formatted}</span>;
}
