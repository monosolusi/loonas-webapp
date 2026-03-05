"use client";

import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PaymentMethodCategoryCard } from "@/features/payment/presentations/components/payment-method-category-card";
import { PaymentMethodOptionCard } from "@/features/payment/presentations/components/payment-method-option-card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { PublicOutgoingInvoiceEntity } from "@/features/invoice/domain/entities/public-outgoing-invoice";

interface SelectedPaymentMethod {
  id: string;
  title: string;
  requiresSchemeSelection: boolean;
  schemes?: { id: string; imageUrl: string; name: string }[];
  pricing: { base: number; percentage: number };
}

interface SelectPaymentMethodImplProps {
  value?: SelectedPaymentMethod;
  selectedScheme?: string;
  onChange?: (value: SelectedPaymentMethod, schemeId?: string) => void;
}

type PaymentMethod = PublicOutgoingInvoiceEntity["paymentMethods"][number];

interface PaymentMethodCategory {
  key: string;
  title: string;
  description: string;
  methods: PaymentMethod[];
}

/**
 * Derives a category key from a payment method title.
 * e.g. "Installment Credit Card - 3 months" → "Credit Card"
 *      "Credit Card" → "Credit Card"
 *      "Virtual Account" → "Virtual Account"
 */
function getCategoryKey(title: string): string {
  let base = title.replace(/^Installment\s+/i, "");
  base = base.replace(/\s+-\s+\d+\s+months?$/i, "");
  return base.trim();
}

function groupPaymentMethods(methods: PaymentMethod[]): PaymentMethodCategory[] {
  const categoryMap = new Map<string, PaymentMethod[]>();
  const categoryOrder: string[] = [];

  for (const method of methods) {
    const key = getCategoryKey(method.title);
    if (!categoryMap.has(key)) {
      categoryMap.set(key, []);
      categoryOrder.push(key);
    }
    categoryMap.get(key)!.push(method);
  }

  return categoryOrder.map((key) => {
    const groupMethods = categoryMap.get(key)!;
    const allSchemeNames = groupMethods.flatMap((m) => m.schemes.map((s) => s.name));
    const uniqueSchemeNames = [...new Set(allSchemeNames)];

    return {
      key,
      title: key,
      description: uniqueSchemeNames.join(", ") || `Bayar dengan ${key}`,
      methods: groupMethods,
    };
  });
}

function formatFeeLabel(pricing: { base: number; percentage: number }, invoiceTotal: number): string {
  const totalFee = pricing.base + (invoiceTotal * pricing.percentage) / 100;
  if (totalFee === 0) return "gratis";
  return IDRFormatter.toCurrency(totalFee);
}

export function SelectPaymentMethodImpl(props: SelectPaymentMethodImplProps) {
  const { id } = useParams<{ id: string }>();
  const { invoice } = useGetPublicOutgoingInvoice({ id });
  const [expandedCategory, setExpandedCategory] = useState<string>();

  const categories = useMemo(() => {
    if (!invoice) return [];
    return groupPaymentMethods(invoice.paymentMethods);
  }, [invoice]);

  const handleSelectMethod = (method: PaymentMethod, schemeId?: string) => {
    if (!props.onChange) return;
    props.onChange(
      {
        id: method.id,
        title: method.title,
        requiresSchemeSelection: method.requiresSchemeSelection,
        schemes: method.schemes.map((s) => ({ id: s.id, imageUrl: s.imageUrl, name: s.name })),
        pricing: method.pricing,
      },
      schemeId,
    );
  };

  if (!invoice) return null;
  return (
    <div className="flex flex-col gap-y-4">
      {categories.map((category) => (
        <PaymentMethodCategoryCard
          key={category.key}
          title={category.title}
          description={category.description}
          isExpanded={expandedCategory === category.key}
          onToggle={() => setExpandedCategory((prev) => (prev === category.key ? undefined : category.key))}
        >
          {category.methods.map((method) =>
            method.requiresSchemeSelection ? (
              method.schemes.map((scheme) => (
                <PaymentMethodOptionCard
                  key={scheme.id}
                  title={`${scheme.name} — ${method.title}`}
                  feeLabel={formatFeeLabel(method.pricing, invoice.summary.total)}
                  isSelected={props.value?.id === method.id && props.selectedScheme === scheme.id}
                  isDisabled={!method.isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMethod(method, scheme.id);
                  }}
                  iconSrc={scheme.imageUrl}
                />
              ))
            ) : (
              <PaymentMethodOptionCard
                key={method.id}
                title={method.title}
                feeLabel={formatFeeLabel(method.pricing, invoice.summary.total)}
                isSelected={props.value?.id === method.id}
                isDisabled={!method.isActive}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMethod(method);
                }}
              />
            ),
          )}
        </PaymentMethodCategoryCard>
      ))}
    </div>
  );
}
