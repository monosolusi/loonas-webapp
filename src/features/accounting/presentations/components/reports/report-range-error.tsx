type ReportRangeErrorProps = {
  readonly message: string;
};

export function ReportRangeError({ message }: ReportRangeErrorProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
      {message}
    </div>
  );
}
