interface InvoiceRowItemProps {
  number: number;
  invoiceNumber: string;
  amount: string;
  date: string;
}

export function InvoiceRowItem(props: InvoiceRowItemProps) {
  return (
    <div className="flex flex-row gap-x-4 border-b border-b-neutral-100 px-6 py-4">
      <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100">
        <div className="text-xs leading-4 font-bold">{props.number}</div>
      </div>

      <div className="flex flex-1 flex-col gap-y-3">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm leading-5 font-medium">{props.invoiceNumber}</div>
            <div className="text-sm leading-5 font-bold">{props.amount}</div>
          </div>
          <div className="text-xs leading-4">{props.date}</div>
        </div>
      </div>
    </div>
  );
}
