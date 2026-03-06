"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useListPaymentMethodDisplay } from "@/features/payment/presentations/hooks/use-list-payment-method-display";
import { PaymentMethodOptionItem } from "@/features/invoice/presentations/components/payment-method-option-item";
import { PaymentMethodCategoryCard } from "@/features/payment/presentations/components/payment-method-category-card";

export default function SelectPaymentMethodPages() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { invoices, recipient, bankAccount, paymentMethod, setPaymentMethod } = useCreateIncomingInvoiceProvider();
  const { data: paymentMethods, isLoading: isPaymentMethodLoading } = useListPaymentMethodDisplay();
  const [selectedGroup, setSelectedGroup] = useState<string>();

  const isDataComplete = useMemo(() => {
    return (
      !!recipient &&
      !!bankAccount &&
      invoices.length > 0 &&
      paymentMethods &&
      paymentMethods.length > 0 &&
      !isPaymentMethodLoading
    );
  }, [recipient, bankAccount, invoices, paymentMethods, isPaymentMethodLoading]);

  const totalAmount = useMemo(() => {
    return invoices.reduce((acc, curr) => acc + curr.amount, 0);
  }, [invoices]);

  if (currentStep !== "select-payment-method" || !isDataComplete) return null;
  return (
    <div className="flex flex-col gap-y-6">
      {/* Title & Description */}
      <div className="flex flex-col">
        <div className="text-2xl leading-8 font-bold text-neutral-400">Metode Pembayaran</div>
        <div className="text-base leading-6 font-normal">Pilih metode pembayaran yang paling nyaman untuk Anda.</div>
      </div>

      {/*  Summary */}
      <div className="bg-primary-300 rounded-lg">
        <div className="flex flex-row">
          {/*  Total */}
          <div className="flex flex-1 flex-col gap-y-2 self-center p-6">
            <div className="flex flex-row items-center gap-x-2">
              <div className="size-1.5 rounded-full bg-white"></div>
              <div className="text-primary-100 text-xs leading-4 font-bold tracking-wide uppercase">
                Total Pembayaran
              </div>
            </div>

            <div className="text-2xl leading-9 font-bold tracking-tight text-white">
              {IDRFormatter.toCurrency(totalAmount + (paymentMethod?.display.feeInNumber || 0))}
            </div>

            <div className="flex flex-row items-center gap-x-1.5 border-t border-t-white/10 pt-2">
              <Image src="/assets/images/check-icon-success-300-w40-h40.svg" alt="" width={10} height={10} />
              <div className="text-primary-100 text-xs leading-4">Termasuk pajak & layanan</div>
            </div>
          </div>

          {/*  Recipient Detail */}
          <div className="flex flex-1 flex-col gap-y-4 rounded-r-lg border border-l-0 border-neutral-100 bg-white p-6">
            {/* Client Name */}
            <div className="flex flex-row gap-x-3 border-b border-b-neutral-200 pb-3">
              <div className="flex size-8 flex-row items-center justify-center rounded-lg bg-neutral-100">
                <Image src="/assets/images/shop-icon-neutral-500-w16-h16.svg" alt="" width={16} height={16} />
              </div>
              <div className="flex flex-col">
                <div className="text-xs leading-4 text-neutral-300 uppercase">Client</div>
                <div className="text-sm leading-5 font-semibold">{recipient!.name}</div>
              </div>
            </div>

            {/* Client Bank Account */}
            <div className="flex flex-row gap-x-3 border-b border-b-neutral-200 pb-3">
              <div className="flex size-8 flex-row items-center justify-center rounded-lg bg-neutral-100">
                <Image src="/assets/images/building-icon-neutral-500-w16-h16.svg" alt="" width={16} height={16} />
              </div>
              <div className="flex flex-col">
                <div className="text-xs leading-4 text-neutral-300 uppercase">Rekening Tujuan</div>
                <div className="text-sm leading-5 font-semibold">{bankAccount!.bankName}</div>
                <div className="text-sm leading-5 font-semibold">{bankAccount!.accountNumber}</div>
                <div className="text-xs leading-4">{bankAccount!.accountHolderName}</div>
              </div>
            </div>

            {/*  Subtotal */}
            <div className="flex flex-row justify-between">
              <div className="flex-1 text-sm leading-5">Subtotal</div>
              <div className="flex-1 text-right text-sm leading-5 font-semibold">
                {IDRFormatter.toCurrency(totalAmount)}
              </div>
            </div>

            {/* Biaya Admin */}
            <div className="flex flex-row justify-between">
              <div className="flex-1 text-sm leading-5">Biaya Admin</div>
              <div className="flex-1 text-right text-sm leading-5 font-semibold">
                {!!paymentMethod ? paymentMethod.display.feeInString : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Payment Method List */}
      <div className="flex flex-col gap-y-4">
        {paymentMethods!.map((category) => (
          <PaymentMethodCategoryCard
            key={category.type}
            title={category.title}
            description={category.description}
            isExpanded={selectedGroup === category.type}
            onToggle={() => setSelectedGroup((prev) => (prev === category.type ? undefined : category.type))}
          >
            {category.selections.map((selection) => (
              <PaymentMethodOptionItem
                key={selection.scheme?.id || selection.gateway.id}
                selection={selection}
              />
            ))}
          </PaymentMethodCategoryCard>
        ))}
      </div>
    </div>
  );
}
