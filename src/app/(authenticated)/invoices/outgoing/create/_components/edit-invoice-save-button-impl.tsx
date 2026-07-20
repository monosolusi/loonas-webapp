"use client";

import { useRouter } from "next/navigation";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useUpdateOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-update-outgoing-invoice";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

export function EditInvoiceSaveButtonImpl() {
  const router = useRouter();
  const { editingInvoiceId, recipient, invoiceDate, dueDate, items, note, tnc, signature, paymentConfiguration } =
    useCreateOutgoingInvoice();
  const { trigger, isMutating } = useUpdateOutgoingInvoice();

  const disabled = !editingInvoiceId || !recipient || items.length === 0 || paymentConfiguration.length === 0;

  const handleSave = async () => {
    if (!editingInvoiceId || !recipient) return;
    try {
      await trigger({
        id: editingInvoiceId,
        recipient,
        invoiceDate,
        dueDate,
        items,
        note,
        tnc,
        signature: signature ?? undefined,
        paymentConfiguration,
      });
      // PUT keeps the invoice in DRAFT — return to the detail page so the user can finalise & send.
      await revalidateSWRKey(INVOICE_SWR_KEYS.GET_INVOICE, INVOICE_SWR_KEYS.LIST_INVOICES);
      router.push(`/invoices/outgoing/${editingInvoiceId}`);
    } catch {
      // Error is surfaced by the SWR mutation state; keep the user on the review step to retry.
    }
  };

  return <PrimaryButton label="Simpan Perubahan" loading={isMutating} disabled={disabled} onClick={handleSave} />;
}
