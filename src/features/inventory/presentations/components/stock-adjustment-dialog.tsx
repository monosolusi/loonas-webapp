"use client";

import { useEffect, useMemo, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockAdjustmentReasonType } from "@/features/inventory/domain/enums/stock-adjustment-reason";
import {
  admitsCounted,
  admitsBothChannels,
  isNoteRequired,
} from "@/features/inventory/domain/helpers/stock-adjustment-reason";
import { INVENTORY_SWR_KEYS } from "@/features/inventory/presentations/constants/swr-keys";
import { useAdjustStockItem } from "@/features/inventory/presentations/hooks/use-adjust-stock-item";
import { StockAdjustmentBlockedDialog } from "@/features/inventory/presentations/components/stock-adjustment-blocked-dialog";
import { StockAdjustmentFormDialog } from "@/features/inventory/presentations/components/stock-adjustment-form-dialog";
import { shouldRotateIdempotencyKey } from "@/features/invoice/presentations/helpers/idempotency-rotation";

type Channel = "counted" | "removed" | "";

type StockAdjustmentDialogProps = {
  stockItem: StockItemEntity | null;
  onClose: () => void;
};

const IDEMPOTENCY_KEY_CODES = new Set(["IDEMPOTENCY_KEY_CONFLICT", "IDEMPOTENCY_KEY_IN_PROGRESS", "IDEMPOTENCY_KEY_REQUIRED"]);
const BOOK_QUANTITY_CHANGED_CODE = "STOCK_ADJUSTMENT_BOOK_QUANTITY_CHANGED";

export function StockAdjustmentDialog({ stockItem, onClose }: StockAdjustmentDialogProps) {
  const { showToast } = useToast();
  const { trigger: adjustStockItem, isMutating } = useAdjustStockItem();

  const [reason, setReason] = useState<string>("");
  const [channel, setChannel] = useState<Channel>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [expectedBookQuantity, setExpectedBookQuantity] = useState<number>(0);
  const [error, setError] = useState<ServerError | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);

  useEffect(() => {
    if (stockItem) {
      setReason("");
      setChannel("");
      setQuantity(0);
      setNote("");
      setExpectedBookQuantity(stockItem.currentStock);
      setError(null);
      setIdempotencyKey(null);
    }
  }, [stockItem]);

  const reasonTyped = reason as StockAdjustmentReasonType | "";
  const reasonSet = reason !== "";

  // The active channel for submission: the user's pick for shrinkage, or the
  // sole admitted channel for every other reason.
  const submitChannel: Channel = useMemo(() => {
    if (!reasonSet) return "";
    const r = reasonTyped as StockAdjustmentReasonType;
    if (admitsBothChannels(r)) return channel;
    return admitsCounted(r) ? "counted" : "removed";
  }, [reasonSet, reasonTyped, channel]);

  const isValid = useMemo(() => {
    if (!reasonSet || !stockItem) return false;
    if (submitChannel === "") return false;
    if (quantity < 0) return false;
    if (submitChannel === "removed" && quantity === 0) return false;
    const r = reasonTyped as StockAdjustmentReasonType;
    if (isNoteRequired(r) && note.trim() === "") return false;
    return true;
  }, [reasonSet, stockItem, submitChannel, quantity, reasonTyped, note]);

  const handleReasonChange = (value: string) => {
    setReason(value);
    setChannel("");
    setQuantity(0);
    setError(null);
  };

  const handleClose = () => {
    if (isMutating) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!stockItem || !isValid || isMutating || submitChannel === "") return;

    const key = idempotencyKey ?? crypto.randomUUID();
    setIdempotencyKey(key);
    const r = reasonTyped as StockAdjustmentReasonType;
    const noteValue = note.trim() ? note.trim() : null;

    try {
      await adjustStockItem({
        stockItemId: stockItem.id,
        channel: submitChannel as "counted" | "removed",
        quantity,
        reason: r,
        note: noteValue,
        expectedBookQuantity: submitChannel === "counted" ? expectedBookQuantity : undefined,
        idempotencyKey: key,
      });

      // Revalidate ALL inventory SWR keys — the min-stock dialog only
      // revalidates LIST_STOCK_ITEMS; that gap is the precedent to avoid.
      await revalidateSWRKey(
        INVENTORY_SWR_KEYS.LIST_STOCK_ITEMS,
        INVENTORY_SWR_KEYS.LIST_LOW_STOCK_ITEMS,
        INVENTORY_SWR_KEYS.LIST_NEGATIVE_STOCK_ITEMS,
        INVENTORY_SWR_KEYS.GET_STOCK_ITEM,
        INVENTORY_SWR_KEYS.LIST_STOCK_MOVEMENTS,
      );
      showToast("Penyesuaian stok berhasil", "success");
      onClose();
    } catch (err) {
      const serverError = err instanceof ServerError ? err : new ServerError(ErrorCodes.UNKNOWN, { message: "Gagal menyimpan penyesuaian" });

      if (shouldRotateIdempotencyKey(serverError.httpCode, serverError.code)) {
        setIdempotencyKey(null);
      }

      if (IDEMPOTENCY_KEY_CODES.has(serverError.code)) {
        showToast(serverError.message, "error");
        return;
      }

      if (serverError.code === BOOK_QUANTITY_CHANGED_CODE) {
        const actual = serverError.details?.actual_book_quantity;
        if (typeof actual === "number") {
          setExpectedBookQuantity(actual);
        }
      }

      setError(serverError);
    }
  };

  // The BE rejects an adjustment outright when the starting balance is already
  // negative — on either channel (422 STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE). Put
  // the guard here, in the one component every entry point renders, so every
  // entry point gets the same behaviour by construction. Entry points now also
  // hide the "Sesuaikan Stok" option on a negative item — that row-level gate is
  // the first line, this guard is the last: SWR list data can go stale between
  // render and click, so the balance may have gone negative in between. Both dialogs are
  // rendered unconditionally and driven by `open`: Headless UI wraps each
  // `Dialog` in a `Transition`, which plays the leave animation before removing
  // the subtree, so the outgoing dialog fades out properly. An early return that
  // swaps which one is rendered tears it down synchronously and the leave never
  // plays. Only one is ever open, and the closed one is gone from the DOM.
  const isBlocked = stockItem?.isNegativeBalance ?? false;

  return (
    <>
      <StockAdjustmentBlockedDialog open={!!stockItem && isBlocked} stockItem={stockItem} onClose={onClose} />
      <StockAdjustmentFormDialog
        open={!!stockItem && !isBlocked}
        stockItem={stockItem}
        expectedBookQuantity={expectedBookQuantity}
        reason={reason}
        channel={channel}
        quantity={quantity}
        note={note}
        isValid={isValid}
        error={error}
        isMutating={isMutating}
        onReasonChange={handleReasonChange}
        onChannelChange={(c) => {
          setChannel(c);
          setQuantity(0);
          setError(null);
        }}
        onQuantityChange={(v) => {
          setQuantity(v);
          setError(null);
        }}
        onNoteChange={(v) => {
          setNote(v);
          setError(null);
        }}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </>
  );
}