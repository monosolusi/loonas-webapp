"use client";

import { useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useDeleteLedgerAccount } from "@/features/accounting/presentations/hooks/use-delete-ledger-account";
import { ServerError } from "@/core/resources/server-error";
import { useCoaAccounts } from "@/app/(authenticated)/accounting/accounts/_providers/coa-accounts-provider";
import { CoaAccountDeleteConfirmBody } from "@/app/(authenticated)/accounting/accounts/_components/coa-account-delete-confirm-body";
import { CoaAccountDeleteJournalLinesBody } from "@/app/(authenticated)/accounting/accounts/_components/coa-account-delete-journal-lines-body";
import { CoaAccountDeleteMappingBody } from "@/app/(authenticated)/accounting/accounts/_components/coa-account-delete-mapping-body";
import { CoaAccountDeleteChildrenBody } from "@/app/(authenticated)/accounting/accounts/_components/coa-account-delete-children-body";
import { CoaAccountDeleteSeededBody } from "@/app/(authenticated)/accounting/accounts/_components/coa-account-delete-seeded-body";

type GuardCode =
  | "ACCOUNT_HAS_JOURNAL_LINES"
  | "ACCOUNT_REFERENCED_BY_MAPPING"
  | "VALIDATION_FAILED"
  | "SEEDED_ACCOUNT_IMMUTABLE_FIELDS";

export function CoaAccountDeleteDialog() {
  const { showToast } = useToast();
  const { deletingItem, setDeletingItem } = useCoaAccounts();
  const { trigger, isMutating } = useDeleteLedgerAccount();

  const [guardCode, setGuardCode] = useState<GuardCode | null>(null);
  const [journalLineCount, setJournalLineCount] = useState<number | null>(null);

  const handleClose = () => {
    if (isMutating) return;
    setDeletingItem(null);
    setGuardCode(null);
    setJournalLineCount(null);
  };

  const handleDelete = async () => {
    if (!deletingItem || isMutating) return;
    setGuardCode(null);
    setJournalLineCount(null);
    try {
      await trigger({ id: deletingItem.id });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_LEDGER_ACCOUNTS);
      showToast("Akun berhasil dihapus.", "success");
      setDeletingItem(null);
    } catch (err) {
      if (err instanceof ServerError) {
        const code = err.code as GuardCode;
        if (
          code === "ACCOUNT_HAS_JOURNAL_LINES" ||
          code === "ACCOUNT_REFERENCED_BY_MAPPING" ||
          code === "VALIDATION_FAILED" ||
          code === "SEEDED_ACCOUNT_IMMUTABLE_FIELDS"
        ) {
          setGuardCode(code);
          if (code === "ACCOUNT_HAS_JOURNAL_LINES") {
            // journal_line_count may be nested under details.details per plan risk note
            const count =
              err.details?.details?.journal_line_count ??
              err.details?.journal_line_count ??
              null;
            setJournalLineCount(typeof count === "number" ? count : null);
          }
        } else {
          showToast(err.message, "error");
        }
      } else {
        showToast("Terjadi kesalahan jaringan. Silakan coba lagi.", "error");
      }
    }
  };

  const account = deletingItem;

  return (
    <LoonasDialog
      title="Hapus Akun"
      width="sm"
      open={!!account}
      onClose={handleClose}
      allowDismiss={!isMutating}
    >
      <div className="mt-4 flex flex-col gap-y-5">
        {!guardCode && account && (
          <CoaAccountDeleteConfirmBody accountName={account.name} accountCode={account.code} />
        )}
        {guardCode === "ACCOUNT_HAS_JOURNAL_LINES" && account && (
          <CoaAccountDeleteJournalLinesBody
            accountName={account.name}
            accountCode={account.code}
            accountId={account.id}
            journalLineCount={journalLineCount}
          />
        )}
        {guardCode === "ACCOUNT_REFERENCED_BY_MAPPING" && account && (
          <CoaAccountDeleteMappingBody accountName={account.name} accountCode={account.code} />
        )}
        {guardCode === "VALIDATION_FAILED" && account && (
          <CoaAccountDeleteChildrenBody accountName={account.name} accountCode={account.code} />
        )}
        {guardCode === "SEEDED_ACCOUNT_IMMUTABLE_FIELDS" && <CoaAccountDeleteSeededBody />}

        <DialogFooter>
          {!guardCode ? (
            <>
              <SecondaryButton outlined label="Batal" onClick={handleClose} disabled={isMutating} />
              <DangerButton label="Hapus" loading={isMutating} onClick={handleDelete} className="w-auto px-6" />
            </>
          ) : (
            <PrimaryButton label="Tutup" onClick={handleClose} className="w-auto px-6" autoFocus />
          )}
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
