"use client";

import { PlusIcon } from "@heroicons/react/16/solid";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { ServerError } from "@/core/resources/server-error";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";
import { MAX_TIER_ROWS } from "@/features/product/presentations/helpers/price-tier-form";
import { OffendingVariant } from "@/features/product/presentations/helpers/price-tier-error";
import {
  PriceTierFormRow,
  PriceTierRowErrors,
} from "@/features/product/presentations/types/price-tier-form.types";
import { PriceTierModeRadio } from "@/app/(authenticated)/products/_components/price-tier-mode-radio";
import { PriceTierRow } from "@/app/(authenticated)/products/_components/price-tier-row";
import { PriceTierErrorBlock } from "@/app/(authenticated)/products/_components/price-tier-error-block";
import { PriceTierLoadError } from "@/app/(authenticated)/products/_components/price-tier-load-error";

type PriceTierFormDialogProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  submitLabel: string;
  tierMode: TierModeType;
  rows: PriceTierFormRow[];
  rowErrors: PriceTierRowErrors;
  formError: string | null;
  offendingVariants: OffendingVariant[];
  loadError: ServerError | null;
  loading: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  onTierModeChange: (mode: TierModeType) => void;
  onRowChange: (key: string, updates: Partial<PriceTierFormRow>) => void;
  onAddRow: () => void;
  onRemoveRow: (key: string) => void;
  onRetryLoad: () => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function PriceTierFormDialog(props: PriceTierFormDialogProps) {
  const canAddRow = props.rows.length < MAX_TIER_ROWS;

  return (
    <LoonasDialog
      title={props.title}
      width="2xl"
      open={props.open}
      onClose={props.onClose}
      allowDismiss={!props.isSubmitting}
    >
      <div className="mt-2 flex flex-col gap-y-5">
        {props.subtitle && <p className="text-sm text-neutral-300">{props.subtitle}</p>}

        {props.loadError ? (
          <PriceTierLoadError error={props.loadError} onRetry={props.onRetryLoad} />
        ) : props.loading ? (
          <div className="flex flex-col gap-y-3">
            <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
            <div className="h-11 animate-pulse rounded-lg bg-neutral-100" />
            <div className="h-11 animate-pulse rounded-lg bg-neutral-100" />
          </div>
        ) : (
          <>
            <PriceTierModeRadio
              value={props.tierMode}
              onChange={props.onTierModeChange}
              disabled={props.isSubmitting}
            />

            <div className="flex flex-col gap-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-neutral-500">Tingkat Harga</span>
                <span className="text-xs text-neutral-300">Maks. {MAX_TIER_ROWS} tingkat</span>
              </div>

              {props.rows.length === 0 ? (
                <p className="rounded-lg border border-dashed border-neutral-100 px-4 py-6 text-center text-sm text-neutral-300">
                  Belum ada tingkat harga. Varian ini dijual dengan harga dasar.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-[1fr_1fr_32px] gap-x-3 px-0.5">
                    <span className="text-xs text-neutral-300">Jumlah Minimal</span>
                    <span className="text-xs text-neutral-300">Harga per Unit</span>
                    <span />
                  </div>

                  <div className="flex flex-col gap-y-2">
                    {props.rows.map((row) => (
                      <PriceTierRow
                        key={row.key}
                        row={row}
                        error={props.rowErrors[row.key]}
                        onChange={(updates) => props.onRowChange(row.key, updates)}
                        onRemove={() => props.onRemoveRow(row.key)}
                        disabled={props.isSubmitting}
                      />
                    ))}
                  </div>
                </>
              )}

              <SecondaryButton
                outlined
                label="Tambah Tingkat"
                leftIcon={<PlusIcon className="size-4" />}
                onClick={props.onAddRow}
                className="w-auto px-4"
                disabled={props.isSubmitting || !canAddRow}
              />
            </div>

            {props.formError && (
              <PriceTierErrorBlock message={props.formError} offendingVariants={props.offendingVariants} />
            )}
          </>
        )}

        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={props.onClose} disabled={props.isSubmitting} />
          <PrimaryButton
            label={props.submitLabel}
            disabled={!props.isValid || !!props.loadError || props.loading}
            loading={props.isSubmitting}
            onClick={props.onSubmit}
            className="w-auto px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
