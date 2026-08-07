"use client";

import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { NumberInput } from "@/core/presentations/components/text-inputs/number-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ServerError } from "@/core/resources/server-error";
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

const REASON_OPTIONS = (Object.values(StockAdjustmentReason) as StockAdjustmentReasonType[]).map((value) => ({
  label: StockAdjustmentReasonLabel[value],
  value,
}));

const NEGATIVE_BALANCE_CODE = "STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE";

export function StockAdjustmentFormDialog(props: StockAdjustmentFormDialogProps) {
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

  const isNegativeBalanceError = props.error?.code === NEGATIVE_BALANCE_CODE;

  return (
    <LoonasDialog title="Sesuaikan Stok" width="lg" open={props.open} onClose={props.onClose}>
      <div className="mt-2 flex flex-col gap-y-5">
        {props.stockItem && (
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-medium text-neutral-500">{props.stockItem.itemName}</span>
            {props.stockItem.variantName && (
              <span className="text-xs text-neutral-300">{props.stockItem.variantName}</span>
            )}
          </div>
        )}

        <SelectInput
          label="Alasan Penyesuaian"
          value={props.reason}
          options={REASON_OPTIONS}
          onChange={props.onReasonChange}
          placeholder="Pilih alasan penyesuaian"
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
          <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-start gap-x-2">
              <ExclamationCircleIcon className="mt-0.5 size-5 shrink-0 text-error-300" />
              <span className="text-sm leading-5 text-neutral-400">{props.error.message}</span>
            </div>
            {isNegativeBalanceError && (
              <Link href="/purchasing/create" className="w-auto sm:w-fit">
                <SecondaryButton outlined label="Catat Pembelian" className="w-full px-6 sm:w-auto" />
              </Link>
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
            className="w-auto px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}