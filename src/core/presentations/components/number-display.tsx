type NumberDisplayProps = {
  value: number;
  prefix?: string;
  suffix?: string;
};

export function NumberDisplay({ value, prefix, suffix }: NumberDisplayProps) {
  const formatted = value.toLocaleString("id-ID");

  return (
    <>
      {prefix && <span>{prefix} </span>}
      {formatted}
      {suffix && <> {suffix}</>}
    </>
  );
}
