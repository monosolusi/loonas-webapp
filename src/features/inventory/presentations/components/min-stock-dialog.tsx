"use client";

import { useEffect, useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { NumberInput } from "@/core/presentations/components/text-inputs/number-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { useUpdateStockItem } from "@/features/inventory/presentations/hooks/use-update-stock-item";
import { INVENTORY_SWR_KEYS } from "@/features/inventory/presentations/constants/swr-keys";

type MinStockDialogProps = {
  stockItem: StockItemEntity | null;
  onClose: () => void;
};

export function MinStockDialog({ stockItem, onClose }: MinStockDialogProps) {
  const { showToast } = useToast();
  const { trigger: updateStockItem, isMutating } = useUpdateStockItem();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (stockItem) setValue(stockItem.minStock ?? 0);
  }, [stockItem]);

  const handleSave = async () => {
    if (!stockItem || isMutating) return;

    const minStock = value > 0 ? value : null;

    try {
      await updateStockItem({ id: stockItem.id, minStock });
      await revalidateSWRKey(INVENTORY_SWR_KEYS.LIST_STOCK_ITEMS);
      showToast("Stok minimum berhasil diperbarui");
      onClose();
    } catch {
      showToast("Gagal memperbarui stok minimum", "error");
    }
  };

  return (
    <LoonasDialog title="Atur Stok Minimum" width="sm" open={!!stockItem} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <p className="text-sm text-neutral-300">
          Atur batas minimum stok untuk <span className="font-medium text-neutral-500">{stockItem?.itemName}</span>.
          Notifikasi akan muncul saat stok di bawah batas ini.
        </p>
        <NumberInput
          label="Stok Minimum"
          placeholder="Contoh: 10"
          value={value}
          onChange={setValue}
          allowDecimal={false}
        />
        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={onClose} />
          <PrimaryButton label="Simpan" loading={isMutating} onClick={handleSave} className="w-auto px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
