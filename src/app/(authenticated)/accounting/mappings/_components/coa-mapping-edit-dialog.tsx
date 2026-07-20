"use client";

import { useEffect, useMemo, useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useUpdateCoaMapping } from "@/features/accounting/presentations/hooks/use-update-coa-mapping";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";
import { useCoaMappings } from "@/app/(authenticated)/accounting/mappings/_providers/coa-mappings-provider";
import { CoaMappingFormDialog } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-form-dialog";
import { CoaMappingLineFormItem } from "@/app/(authenticated)/accounting/mappings/_components/coa-mapping-form.types";

function toFormItems(mapping: CoaMappingEntity): CoaMappingLineFormItem[] {
  return mapping.lines.map((line) => ({
    key: crypto.randomUUID(),
    account: line.account,
    position: line.position,
    label: line.label ?? "",
  }));
}

function newEmptyLine(): CoaMappingLineFormItem {
  return {
    key: crypto.randomUUID(),
    account: null,
    position: "debit",
    label: "",
  };
}

export function CoaMappingEditDialog() {
  const { showToast } = useToast();
  const { editingItem, setEditingItem, entityTypes } = useCoaMappings();
  const { trigger, isMutating } = useUpdateCoaMapping();

  const [lines, setLines] = useState<CoaMappingLineFormItem[]>([]);

  useEffect(() => {
    if (editingItem) {
      setLines(toFormItems(editingItem));
    } else {
      setLines([]);
    }
  }, [editingItem]);

  const isValid = useMemo(() => {
    if (lines.length < 2) return false;
    if (!lines.every((l) => l.account !== null)) return false;
    const hasDebit = lines.some((l) => l.position === "debit");
    const hasCredit = lines.some((l) => l.position === "credit");
    return hasDebit && hasCredit;
  }, [lines]);

  const handleAddLine = () => {
    setLines((prev) => [...prev, newEmptyLine()]);
  };

  const handleRemoveLine = (key: string) => {
    setLines((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.key !== key)));
  };

  const handleLineChange = (key: string, updates: Partial<CoaMappingLineFormItem>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...updates } : l)));
  };

  const handleClose = () => {
    if (isMutating) return;
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!editingItem || !isValid || isMutating) return;
    try {
      await trigger({
        id: editingItem.id,
        lines: lines.map((l, i) => ({
          accountId: l.account!.id,
          position: l.position,
          label: l.label.trim() || undefined,
          sortOrder: i,
        })),
      });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_COA_MAPPINGS);
      showToast("Pemetaan berhasil diubah", "success");
      setEditingItem(null);
    } catch (err) {
      const message = err instanceof ServerError ? err.message : "Gagal menyimpan pemetaan";
      showToast(message, "error");
    }
  };

  return (
    <CoaMappingFormDialog
      open={!!editingItem}
      title="Ubah Pemetaan Akun"
      submitLabel="Simpan Perubahan"
      entityTypes={entityTypes}
      entityType={editingItem?.entityType ?? ""}
      entityId={editingItem?.entityId ?? ""}
      lines={lines}
      isSubmitting={isMutating}
      isValid={isValid}
      immutableMeta
      onEntityTypeChange={() => {}}
      onEntityIdChange={() => {}}
      onLineChange={handleLineChange}
      onAddLine={handleAddLine}
      onRemoveLine={handleRemoveLine}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}
