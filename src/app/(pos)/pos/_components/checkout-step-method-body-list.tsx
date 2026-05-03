"use client";

import { useMemo } from "react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import { getPaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/registry";
import { ProductListRow } from "@/app/(pos)/pos/_components/product-list-row";
import { paymentFeeLabel, paymentTypeLabel } from "@/app/(pos)/pos/_components/payment-method-helpers";

type CheckoutStepMethodBodyListProps = {
  methods: PaymentMethodEntity[];
  onSelect: (method: PaymentMethodEntity) => void;
};

export function CheckoutStepMethodBodyList({ methods, onSelect }: CheckoutStepMethodBodyListProps) {
  const sorted = useMemo(() => [...methods].sort((a, b) => a.sortOrder - b.sortOrder), [methods]);

  if (sorted.length === 0) {
    return (
      <span className="text-sm text-neutral-300">
        Tidak ada metode pembayaran aktif. Aktifkan setidaknya satu metode di Pengaturan.
      </span>
    );
  }

  return (
    <div className="flex flex-col">
      {sorted.map((method) => {
        const gateway = method.paymentGateway;
        const hasHandler = getPaymentMethodHandler(gateway.type) !== null;
        const unsupported = gateway.requiresSchemeSelection || !hasHandler;
        const feeLabel = paymentFeeLabel(gateway.pricing);
        const typeLabel = paymentTypeLabel(gateway.type);

        return (
          <ProductListRow
            key={gateway.id}
            primaryLabel={gateway.title}
            disabled={unsupported}
            right={
              <>
                {feeLabel && <span className="text-xs text-neutral-400">{feeLabel}</span>}
                {typeLabel && <span className="text-xs text-neutral-300">{typeLabel}</span>}
                {unsupported ? (
                  <StatusChip label="Belum didukung" variant="neutral" compact />
                ) : (
                  <ChevronRightIcon className="size-4 text-neutral-200" />
                )}
              </>
            }
            onClick={() => onSelect(method)}
          />
        );
      })}
    </div>
  );
}
