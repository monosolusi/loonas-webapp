"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import { getPaymentMethodHandler } from "@/app/(pos)/pos/_payment-methods/registry";
import { PaymentMethodTile } from "@/app/(pos)/pos/_components/payment-method-tile";
import { getPaymentMethodIconSrc } from "@/app/(pos)/pos/_components/payment-method-icon";

type CheckoutStepMethodBodyListProps = {
  methods: PaymentMethodEntity[];
  onSelect: (method: PaymentMethodEntity) => void;
};

export function CheckoutStepMethodBodyList({ methods, onSelect }: CheckoutStepMethodBodyListProps) {
  const sorted = useMemo(() => [...methods].sort((a, b) => a.sortOrder - b.sortOrder), [methods]);

  if (sorted.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-sm text-neutral-300">
        Tidak ada metode pembayaran aktif. Aktifkan setidaknya satu metode di Pengaturan.
      </div>
    );
  }

  const isSingle = sorted.length === 1;

  return (
    <div className={clsx("grid gap-4 px-6 pt-6 pb-8", isSingle ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
      {sorted.map((method) => {
        const gateway = method.paymentGateway;
        const hasHandler = getPaymentMethodHandler(gateway.type) !== null;
        const unsupported = gateway.requiresSchemeSelection || !hasHandler;
        const description = unsupported ? "Belum didukung" : gateway.description || "—";

        return (
          <PaymentMethodTile
            key={gateway.id}
            iconSrc={getPaymentMethodIconSrc(gateway.type)}
            title={gateway.title}
            description={description}
            disabled={unsupported}
            onClick={() => onSelect(method)}
          />
        );
      })}
    </div>
  );
}
