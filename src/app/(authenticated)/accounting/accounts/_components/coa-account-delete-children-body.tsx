"use client";

type CoaAccountDeleteChildrenBodyProps = {
  accountName: string;
  accountCode: string;
};

export function CoaAccountDeleteChildrenBody({ accountName }: CoaAccountDeleteChildrenBodyProps) {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-sm font-semibold text-neutral-500">Akun ini tidak dapat dihapus.</p>
      <p className="text-sm text-neutral-400">
        Akun &ldquo;{accountName}&rdquo; memiliki sub-akun. Hapus atau pindahkan sub-akun terlebih dahulu, lalu coba
        lagi.
      </p>
    </div>
  );
}
