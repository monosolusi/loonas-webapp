"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { NumberInput } from "@/core/presentations/components/text-inputs/number-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useLatchedValue } from "@/core/presentations/hooks/use-latched-value";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import {
  StockAdjustmentReason,
  StockAdjustmentReasonType,
  StockAdjustmentReasonLabel,
} from "@/features/inventory/domain/enums/stock-adjustment-reason";
import {
  admitsCounted,
  admitsBothChannels,
  isNoteRequired,
} from "@/features/inventory/domain/helpers/stock-adjustment-reason";
import { ChannelOption } from "@/features/inventory/presentations/components/stock-adjustment-channel-option";
import { stockRecoveryActions } from "@/features/inventory/presentations/helpers/stock-item-actions";

type Channel = "counted" | "removed" | "";

type StockAdjustmentFormDialogProps = {
  open: boolean;
  stockItem: StockItemEntity | null;
  expectedBookQuantity: number;
  reason: string;
  channel: Channel;
  quantity: number;
  note: string;
  isValid: boolean;
  error: ServerError | null;
  isMutating: boolean;
  onReasonChange: (value: string) => void;
  onChannelChange: (channel: "counted" | "removed") => void;
  onQuantityChange: (value: number) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const REASON_OPTIONS: SearchComboboxOption[] = (
  Object.values(StockAdjustmentReason) as StockAdjustmentReasonType[]
).map((value) => ({
  id: value,
  label: StockAdjustmentReasonLabel[value],
}));

export function StockAdjustmentFormDialog(props: StockAdjustmentFormDialogProps) {
  const selectedReason = useMemo(
    () => REASON_OPTIONS.find((opt) => opt.id === props.reason) ?? null,
    [props.reason],
  );

  // The parent nulls `stockItem` the instant the dialog closes, while the panel
  // is still playing its leave transition. Latch it so the header and the
  // recovery CTAs stay put while it fades.
  const stockItem = useLatchedValue(props.stockItem);

  const reasonTyped = props.reason as StockAdjustmentReasonType | "";
  const reasonSet = reasonTyped !== "" && reasonTyped in StockAdjustmentReasonLabel;
  const showChannelPicker = reasonSet && admitsBothChannels(reasonTyped as StockAdjustmentReasonType);

  // The active channel is the user's pick for shrinkage, or the sole admitted
  // channel for every other reason. Empty until a reason is chosen.
  let activeChannel: Channel = props.channel;
  if (reasonSet && !showChannelPicker) {
    const r = reasonTyped as StockAdjustmentReasonType;
    activeChannel = admitsCounted(r) ? "counted" : "removed";
  }

  const showCounted = activeChannel === "counted";
  const showRemoved = activeChannel === "removed";
  const noteRequired = reasonSet && isNoteRequired(reasonTyped as StockAdjustmentReasonType);

  // Reachable only through the stale-data race the dialog-level guard exists
  // for: the row menu no longer hides "Sesuaikan Stok" on a negative balance —
  // picking it opens the blocked dialog instead — so this error block only
  // fires when the balance went negative between the list render and submit
  // (list said non-negative, BE says negative). Same rule, same source as the
  // blocked dialog.
  const isNegativeBalanceError = props.error?.code === ErrorCodes.STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE.code;
  const recoveryActions = stockItem ? stockRecoveryActions(stockItem) : [];

  return (
    <LoonasDialog title="Sesuaikan Stok" width="lg" open={props.open} onClose={props.onClose}>
      <div className="mt-2 flex flex-col gap-y-5">
        {stockItem && (
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-medium text-neutral-500">{stockItem.itemName}</span>
            {stockItem.variantName && <span className="text-xs text-neutral-300">{stockItem.variantName}</span>}
          </div>
        )}

        <SearchCombobox
          label="Alasan Penyesuaian"
          options={REASON_OPTIONS}
          value={selectedReason}
          onChange={(opt) => props.onReasonChange(opt?.id ?? "")}
          placeholder="Pilih alasan penyesuaian"
          emptyMessage="Alasan tidak ditemukan"
          required
          disabled={props.isMutating}
        />

        {showChannelPicker && (
          <div className="flex flex-col gap-y-2">
            <span className="text-base">Metode Pencatatan</span>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ChannelOption
                label="Hitung fisik (opname)"
                description="Catat hasil hitung ulang stok"
                selected={props.channel === "counted"}
                disabled={props.isMutating}
                onClick={() => props.onChannelChange("counted")}
              />
              <ChannelOption
                label="Catat jumlah yang hilang"
                description="Sudah tahu berapa yang hilang"
                selected={props.channel === "removed"}
                disabled={props.isMutating}
                onClick={() => props.onChannelChange("removed")}
              />
            </div>
          </div>
        )}

        {showCounted && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4">
            <NumberInput
              label="Jumlah Fisik"
              placeholder="Contoh: 100"
              value={props.quantity}
              onChange={props.onQuantityChange}
              allowDecimal={true}
              disabled={props.isMutating}
            />
            <div className="flex flex-col gap-2">
              <span className="text-base">Saldo Buku Saat Ini</span>
              <div className="flex h-11 items-center rounded-lg border border-solid border-neutral-100 bg-neutral-50 px-3">
                <span className="text-base text-neutral-300">
                  <NumberDisplay value={props.expectedBookQuantity} />
                </span>
              </div>
            </div>
          </div>
        )}

        {showRemoved && (
          <NumberInput
            label="Jumlah yang Hilang"
            placeholder="Contoh: 5"
            value={props.quantity}
            onChange={props.onQuantityChange}
            allowDecimal={true}
            disabled={props.isMutating}
          />
        )}

        <TextInput
          label={noteRequired ? "Catatan" : "Catatan (opsional)"}
          placeholder={noteRequired ? "Wajib diisi — catat kejadian dan kapan" : "Catatan tambahan (opsional)"}
          value={props.note}
          onChange={props.onNoteChange}
          disabled={props.isMutating}
          required={noteRequired}
        />

        {props.error && (
          <div
            className="border-error-300/20 bg-error-300/5 flex flex-col gap-y-3 rounded-lg border px-4 py-3"
            role="alert"
          >
            <div className="flex items-start gap-x-2">
              <ExclamationCircleIcon className="text-error-300 mt-0.5 size-5 shrink-0" />
              <span className="text-error-300 text-sm leading-5">{props.error.message}</span>
            </div>
            {isNegativeBalanceError && (
              <div className="flex flex-col gap-2 sm:flex-row">
                {recoveryActions.map((action) => (
                  <Link key={action.href} href={action.href} className="w-full sm:w-auto">
                    <SecondaryButton outlined label={action.label} className="w-full px-6 sm:w-auto" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={props.onClose} disabled={props.isMutating} />
          <PrimaryButton
            label="Simpan Penyesuaian"
            disabled={!props.isValid}
            loading={props.isMutating}
            onClick={props.onSubmit}
            className="px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
