import { useEffect, useState } from "react";
import { TextInput, TextInputProps } from "@/core/presentations/components/text-inputs/text-input";

type NumberInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  allowDecimal?: boolean;
} & Omit<TextInputProps, "type" | "value" | "onChange">;

function formatForDisplay(value: number): string {
  if (value === 0) return "";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 10 }).format(value);
}

function parseToNumber(input: string): number {
  const cleaned = input.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function NumberInput({ value, onChange, allowDecimal = true, ...restProps }: NumberInputProps) {
  const [display, setDisplay] = useState(() => formatForDisplay(value ?? 0));

  useEffect(() => {
    const current = parseToNumber(display);
    if (value !== undefined && value !== current) {
      setDisplay(formatForDisplay(value));
    }
  }, [value]);

  const handleChange = (raw: string) => {
    const allowed = allowDecimal ? /[^0-9.,]/g : /[^0-9.]/g;
    const sanitized = raw.replace(allowed, "");
    setDisplay(sanitized);
    onChange?.(parseToNumber(sanitized));
  };

  const handleBlur = () => {
    const parsed = parseToNumber(display);
    setDisplay(formatForDisplay(parsed));
  };

  return (
    <TextInput
      {...restProps}
      type="text"
      inputMode="decimal"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}
