"use client";

type CoaAccountDeleteConfirmBodyProps = {
  accountName: string;
  accountCode: string;
};

export function CoaAccountDeleteConfirmBody({ accountName, accountCode }: CoaAccountDeleteConfirmBodyProps) {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-sm text-neutral-400">Apakah Anda yakin ingin menghapus akun ini?</p>
      <p className="text-sm font-semibold text-neutral-500">
        &ldquo;{accountName}&rdquo; ({accountCode})
      </p>
      <p className="text-sm text-neutral-300">Tindakan ini tidak dapat dibatalkan.</p>
    </div>
  );
}
