"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { useFinaliseInvoice } from "@/features/invoice/presentations/hooks/use-finalise-invoice";
import { useDeleteInvoice } from "@/features/invoice/presentations/hooks/use-delete-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ServerError } from "@/core/resources/server-error";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { DraftActionCard } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/draft-action-card";

export function DraftActionCardImpl() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { invoice, loading } = useGetInvoice({ id });
  const { trigger: finalise, isMutating: finalising, error: finaliseError } = useFinaliseInvoice();
  const { trigger: remove, isMutating: deleting, error: deleteError } = useDeleteInvoice();
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (loading || !invoice || !(invoice instanceof OutgoingInvoiceEntity)) return null;
  if (invoice.status !== OutgoingInvoiceStatus.DRAFT) return null;

  const recipientName = invoice.recipient.fullName;

  // `/finalise` drives the full first-time flow DRAFT -> READY_TO_SEND -> SENT: it generates the
  // PDF and dispatches the notification to the recipient in one call. There is no separate send
  // step here (`/send` is re-send only, valid once the invoice is already SENT).
  const handleSend = async () => {
    try {
      await finalise({ invoice: { id } });
      setSendConfirmOpen(false);
      await revalidateSWRKey(INVOICE_SWR_KEYS.GET_INVOICE, INVOICE_SWR_KEYS.LIST_INVOICES);
      // On success the status leaves DRAFT and this component unmounts.
    } catch {
      // Failure is surfaced via the hook's `error` state; close the dialog so the card can show it.
      setSendConfirmOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      await remove({ invoice: { id } });
      setDeleteConfirmOpen(false);
      revalidateSWRKey(INVOICE_SWR_KEYS.LIST_INVOICES, INVOICE_SWR_KEYS.GET_INVOICE_SUMMARY);
      router.push("/invoices/outgoing");
    } catch {
      setDeleteConfirmOpen(false);
    }
  };

  const activeError = finaliseError ?? deleteError;
  const errorMessage = activeError instanceof ServerError ? activeError.message : undefined;

  return (
    <>
      <DraftActionCard
        onContinue={() => setSendConfirmOpen(true)}
        onDiscard={() => setDeleteConfirmOpen(true)}
        errorMessage={errorMessage}
      />

      <ConfirmationDialog
        open={sendConfirmOpen}
        onClose={() => setSendConfirmOpen(false)}
        title="Kirim Faktur"
        description={
          <>
            Faktur akan difinalisasi dan dikirim ke{" "}
            <span className="font-semibold text-neutral-500">{recipientName}</span>. Setelah dikirim, faktur tidak bisa
            diubah lagi.
          </>
        }
        confirmLabel="Kirim Faktur"
        confirmVariant="primary"
        loading={finalising}
        onConfirm={handleSend}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Hapus Draf"
        description="Draf faktur ini akan dihapus permanen dan tidak bisa dikembalikan."
        confirmLabel="Hapus Draf"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
