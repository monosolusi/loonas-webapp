"use client";

import { useEffect, useMemo, useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useCreateCoaMapping } from "@/features/accounting/presentations/hooks/use-create-coa-mapping";
import { useCoaMappings } from "@/app/(authenticated)/chart-of-accounts/mappings/_providers/coa-mappings-provider";
import { CoaMappingFormDialog } from "@/app/(authenticated)/chart-of-accounts/mappings/_components/coa-mapping-form-dialog";
import { CoaMappingLineFormItem } from "@/app/(authenticated)/chart-of-accounts/mappings/_components/coa-mapping-form.types";

function createEmptyLine(position: "debit" | "credit"): CoaMappingLineFormItem {
  return {
    key: crypto.randomUUID(),
    account: null,
    position,
    label: "",
  };
}

function initialLines(): CoaMappingLineFormItem[] {
  return [createEmptyLine("debit"), createEmptyLine("credit")];
}

export function CoaMappingCreateDialog() {
  const { showToast } = useToast();
  const { creatingOpen, setCreatingOpen, entityTypes } = useCoaMappings();
  const { trigger, isMutating } = useCreateCoaMapping();

  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [lines, setLines] = useState<CoaMappingLineFormItem[]>(initialLines);

  useEffect(() => {
    if (!creatingOpen) {
      setEntityType("");
      setEntityId("");
      setLines(initialLines());
    }
  }, [creatingOpen]);

  const isValid = useMemo(() => {
    if (!entityType) return false;
    if (lines.length < 2) return false;
    if (!lines.every((l) => l.account !== null)) return false;
    const hasDebit = lines.some((l) => l.position === "debit");
    const hasCredit = lines.some((l) => l.position === "credit");
    return hasDebit && hasCredit;
  }, [entityType, lines]);

  const handleAddLine = () => {
    setLines((prev) => [...prev, createEmptyLine("debit")]);
  };

  const handleRemoveLine = (key: string) => {
    setLines((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.key !== key)));
  };

  const handleLineChange = (key: string, updates: Partial<CoaMappingLineFormItem>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...updates } : l)));
  };

  const handleClose = () => {
    if (isMutating) return;
    setCreatingOpen(false);
  };

  const handleSubmit = async () => {
    if (!isValid || isMutating) return;
    try {
      await trigger({
        entityType,
        entityId: entityId.trim() || undefined,
        lines: lines.map((l, i) => ({
          accountId: l.account!.id,
          position: l.position,
          label: l.label.trim() || undefined,
          sortOrder: i,
        })),
      });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_COA_MAPPINGS);
      showToast("Pemetaan berhasil dibuat", "success");
      setCreatingOpen(false);
    } catch (err) {
      const message = err instanceof ServerError ? err.message : "Gagal menyimpan pemetaan";
      showToast(message, "error");
    }
  };

  return (
    <CoaMappingFormDialog
      open={creatingOpen}
      title="Tambah Pemetaan Akun"
      submitLabel="Simpan"
      entityTypes={entityTypes}
      entityType={entityType}
      entityId={entityId}
      lines={lines}
      isSubmitting={isMutating}
      isValid={isValid}
      onEntityTypeChange={setEntityType}
      onEntityIdChange={setEntityId}
      onLineChange={handleLineChange}
      onAddLine={handleAddLine}
      onRemoveLine={handleRemoveLine}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}
