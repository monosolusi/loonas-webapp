type NumberDisplayProps = {
  value: number;
  suffix?: string;
};

export function NumberDisplay({ value, suffix }: NumberDisplayProps) {
  const formatted = value.toLocaleString("id-ID");

  if (suffix) return <>{formatted} {suffix}</>;

  return <>{formatted}</>;
}
