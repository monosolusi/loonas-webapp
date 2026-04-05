import { TextInput, TextInputProps } from "@/core/presentations/components/text-inputs/text-input";

type NumberInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  allowDecimal?: boolean;
} & Omit<TextInputProps, "type" | "value" | "onChange">;

function formatDisplay(value: number | undefined): string {
  if (value === undefined || value === 0) return "";
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 10 }).format(value);
}

function parseInput(input: string): number {
  const cleaned = input.replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function NumberInput({
  value,
  onChange,
  allowDecimal = true,
  ...restProps
}: NumberInputProps) {
  const handleChange = (raw: string) => {
    const allowed = allowDecimal ? /[^0-9.,]/g : /[^0-9.]/g;
    const sanitized = raw.replace(allowed, "");
    onChange?.(parseInput(sanitized));
  };

  return (
    <TextInput
      {...restProps}
      type="text"
      inputMode="decimal"
      value={formatDisplay(value)}
      onChange={handleChange}
    />
  );
}
