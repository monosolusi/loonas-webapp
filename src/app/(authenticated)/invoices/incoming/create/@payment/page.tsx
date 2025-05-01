"use client";

import React from "react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { PaymentGatewayProvider, usePaymentGateway } from "@/features/payment/presentations/providers/payment-gateway";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { SchemeSelection } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/scheme-selection";
import { PaymentMethod } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/payment-method";

function PaymentMethodContent() {
  const { currentStep, nextStep } = useCreateIncomingInvoiceSteps();
  const { paymentGateways, loading } = usePaymentGateway();
  const {
    receiver,
    bankAccount,
    paymentGateway,
    paymentScheme,
    setPaymentGateway,
    setPaymentScheme,
    invoiceDocuments
  } = useCreateIncomingInvoice();

  // Calculate total invoice amount
  const totalAmount = invoiceDocuments.reduce((sum, doc) => sum + doc.amount, 0);


  // Calculate fees
  const calculateFees = (gateway: PaymentGatewayEntity) => {
    const baseFee = gateway.pricing.baseFee;
    const percentageFee = (gateway.pricing.percentageFee / 100) * totalAmount;
    return baseFee + percentageFee;
  };

  // Format fee display text
  const formatFeeText = (gateway: PaymentGatewayEntity) => {
    const hasBaseFee = gateway.pricing.baseFee > 0;
    const hasPercentageFee = gateway.pricing.percentageFee > 0;

    if (hasBaseFee && hasPercentageFee) {
      return `${IDRFormatter.toCurrency(gateway.pricing.baseFee)} + ${gateway.pricing.percentageFee}%`;
    } else if (hasBaseFee) {
      return IDRFormatter.toCurrency(gateway.pricing.baseFee);
    } else if (hasPercentageFee) {
      return `${gateway.pricing.percentageFee}%`;
    } else {
      return "Gratis";
    }
  };

  // Calculate total to be paid
  const calculateTotalToBePaid = () => {
    if (!paymentGateway) return totalAmount;
    return totalAmount + calculateFees(paymentGateway);
  };

  if (currentStep !== 4) return null;
  if (loading) return <div className="mt-4">Loading payment methods...</div>;
  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Pilih Metode Pembayaran</h1>
          <p className="mt-2 text-sm text-gray-700">
            Pilih metode pembayaran yang ingin kamu gunakan untuk membayar faktur ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Payment methods */}
        <div className="lg:col-span-2">
          <PaymentMethod />
          <SchemeSelection />
        </div>

        {/* Right column - Payment details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Detail Pembayaran</h2>

          {/* Recipient info */}
          {receiver && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Penerima</h3>
              <p className="text-sm text-gray-900">{receiver.name}</p>
            </div>
          )}

          {/* Bank account info */}
          {bankAccount && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Rekening Tujuan</h3>
              <p className="text-sm text-gray-900">{bankAccount.bankName} - {bankAccount.accountNumber}</p>
              <p className="text-sm text-gray-900">{bankAccount.accountHolderName}</p>
            </div>
          )}

          {/* Invoice list */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Faktur</h3>
            <div className="space-y-2">
              {invoiceDocuments.map((doc, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {doc.invoiceNumber || `Faktur ${index + 1}`}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {IDRFormatter.toCurrency(doc.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total Faktur</span>
              <span className="text-gray-900 font-medium">{IDRFormatter.toCurrency(totalAmount)}</span>
            </div>

            {paymentGateway && (paymentGateway.pricing.baseFee > 0 || paymentGateway.pricing.percentageFee > 0) && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  Biaya {paymentGateway.title} ({formatFeeText(paymentGateway)})
                </span>
                <span
                  className="text-gray-900 font-medium">{IDRFormatter.toCurrency(calculateFees(paymentGateway))}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-medium mt-4">
              <span className="text-gray-900">Total Pembayaran</span>
              <span className="text-primary-default">{IDRFormatter.toCurrency(calculateTotalToBePaid())}</span>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6">
            <FilledButton
              disabled={!paymentGateway || (paymentGateway.requiresSchemeSelection && !paymentScheme)}
              type="button"
              onClick={() => nextStep?.()}
              className="w-full"
            >
              Bayar Sekarang
            </FilledButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodPage() {
  return (
    <PaymentGatewayProvider>
      <PaymentMethodContent />
    </PaymentGatewayProvider>
  );
}