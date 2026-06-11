import Image from "next/image";

export interface BankAccountRow {
  id: string;
  bankName: string;
  maskedAccountNumber: string;
  accountHolderName: string;
}

interface BankAccountsTableProps {
  rows: BankAccountRow[];
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50">
        <Image src="/assets/images/credit-card-icon-neutral-400-w16-h16.svg" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col items-center gap-y-1 text-center">
        <p className="text-sm font-semibold text-neutral-500">Belum ada rekening bank</p>
        <p className="text-sm text-neutral-300">Tambahkan rekening bank untuk menerima pembayaran faktur.</p>
      </div>
    </div>
  );
}

export function BankAccountsTable(props: BankAccountsTableProps) {
  if (props.rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-[2fr_1.5fr_2fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">Bank</span>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">No. Rekening</span>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">Nama Pemilik</span>
      </div>
      {props.rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[2fr_1.5fr_2fr] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0"
        >
          <span className="text-sm font-semibold text-neutral-500">{row.bankName}</span>
          <span className="font-mono text-sm text-neutral-400">{row.maskedAccountNumber}</span>
          <span className="text-sm text-neutral-400">{row.accountHolderName}</span>
        </div>
      ))}
    </div>
  );
}
