"use client";

import { PlusIcon } from "@heroicons/react/16/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";
import { CoaMappingLineRow } from "@/app/(authenticated)/chart-of-accounts/mappings/_components/coa-mapping-line-row";
import { CoaMappingLineFormItem } from "@/app/(authenticated)/chart-of-accounts/mappings/_components/coa-mapping-form.types";

type CoaMappingFormDialogProps = {
  open: boolean;
  title: string;
  submitLabel: string;
  entityTypes: CoaMappingEntityTypeEntity[];
  entityType: string;
  entityId: string;
  lines: CoaMappingLineFormItem[];
  isSubmitting: boolean;
  isValid: boolean;
  immutableMeta?: boolean;
  onEntityTypeChange: (value: string) => void;
  onEntityIdChange: (value: string) => void;
  onLineChange: (key: string, updates: Partial<CoaMappingLineFormItem>) => void;
  onAddLine: () => void;
  onRemoveLine: (key: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function CoaMappingFormDialog(props: CoaMappingFormDialogProps) {
  const entityTypeOptions = props.entityTypes.map((t) => ({ label: t.label, value: t.type }));

  return (
    <LoonasDialog title={props.title} width="2xl" open={props.open} onClose={props.onClose}>
      <div className="mt-2 flex flex-col gap-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4">
          <SelectInput
            label="Jenis Transaksi"
            value={props.entityType}
            options={entityTypeOptions}
            onChange={props.onEntityTypeChange}
            placeholder="Pilih jenis transaksi"
            required
            disabled={props.immutableMeta}
          />
          <TextInput
            label="Context ID"
            description="Kosongkan untuk default global"
            placeholder="UUID varian / akun (opsional)"
            value={props.entityId}
            onChange={props.onEntityIdChange}
            disabled={props.immutableMeta}
          />
        </div>

        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-neutral-500">Baris Jurnal</span>
            <span className="text-xs text-neutral-300">Min. 2 baris: 1 debit + 1 kredit</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[2fr_1fr_1.5fr_40px] gap-x-3 px-0.5">
                <span className="text-xs text-neutral-300">Akun</span>
                <span className="text-xs text-neutral-300">Posisi</span>
                <span className="text-xs text-neutral-300">Label</span>
                <span />
              </div>

              <div className="flex flex-col gap-y-2">
                {props.lines.map((line) => (
                  <CoaMappingLineRow
                    key={line.key}
                    line={line}
                    onChange={(updates) => props.onLineChange(line.key, updates)}
                    onRemove={() => props.onRemoveLine(line.key)}
                    canRemove={props.lines.length > 2}
                    disabled={props.isSubmitting}
                  />
                ))}
              </div>
            </div>
          </div>

          <SecondaryButton
            outlined
            label="Tambah Baris"
            leftIcon={<PlusIcon className="size-4" />}
            onClick={props.onAddLine}
            className="w-auto px-4"
            disabled={props.isSubmitting}
          />
        </div>

        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={props.onClose} />
          <PrimaryButton
            label={props.submitLabel}
            disabled={!props.isValid}
            loading={props.isSubmitting}
            onClick={props.onSubmit}
            className="w-auto px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
