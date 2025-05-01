"use client";

import React from "react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { PaymentGatewayProvider, usePaymentGateway } from "@/features/payment/presentations/providers/payment-gateway";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { RadioGroup } from "@headlessui/react";
import { 
  CreditCardIcon, 
  QrCodeIcon, 
  BanknotesIcon, 
  BuildingLibraryIcon 
} from "@heroicons/react/24/outline";

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

  // Function to get the appropriate icon based on payment method title
  const getPaymentIcon = (title: string) => {
    switch (title) {
      case "Credit Card":
        return <CreditCardIcon className="h-10 w-10 text-gray-600" />;
      case "QRIS":
        return <QrCodeIcon className="h-10 w-10 text-gray-600" />;
      case "Virtual Account":
        return <BanknotesIcon className="h-10 w-10 text-gray-600" />;
      default:
        return <CreditCardIcon className="h-10 w-10 text-gray-600" />;
    }
  };

  // Function to get the appropriate bank icon based on scheme name
  const getBankIcon = (name: string) => {
    // We're using a generic bank icon for all banks since we don't have specific icons
    return <BuildingLibraryIcon className="h-8 w-8 text-gray-600" />;
  };

  // Calculate total invoice amount
  const totalAmount = invoiceDocuments.reduce((sum, doc) => sum + doc.amount, 0);

  const handleSelectGateway = (gateway: PaymentGatewayEntity) => {
    setPaymentGateway?.(gateway);

    // For gateways that don't require scheme selection, automatically select the first scheme
    if (!gateway.requiresSchemeSelection) {
      setPaymentScheme?.(gateway.schemes[0]);
    } else {
      // For gateways that require scheme selection (like Virtual Account), user needs to select a specific scheme
      setPaymentScheme?.(undefined);
    }
  };

  const handleSelectScheme = (scheme: PaymentSchemeEntity) => {
    setPaymentScheme?.(scheme);
  };

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

  if (loading) {
    return <div className="mt-4">Loading payment methods...</div>;
  }

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
          <RadioGroup value={paymentGateway || null} onChange={handleSelectGateway}>
            <RadioGroup.Label className="sr-only">Metode Pembayaran</RadioGroup.Label>
            <div className="space-y-4">
              {paymentGateways.map((gateway) => (
                <RadioGroup.Option
                  key={gateway.id}
                  value={gateway}
                  className={({ checked }) => `
                    relative rounded-lg border p-4 cursor-pointer focus:outline-none
                    ${checked ? 'border-primary-default ring-1 ring-primary-default' : 'border-gray-200'}
                  `}
                >
                  {({ checked }) => (
                    <div className="flex items-center">
                      {/* Left: Icon/Logo */}
                      <div className="flex-shrink-0 mr-4">
                        {gateway.schemes.length > 0 ? (
                          <img
                            src={gateway.schemes[0].logoUrl}
                            alt={gateway.title}
                            className="h-10 w-10 object-contain"
                          />
                        ) : (
                          getPaymentIcon(gateway.title)
                        )}
                      </div>

                      {/* Center: Payment method info */}
                      <div className="flex-1 min-w-0">
                        <RadioGroup.Label as="h3" className="text-base font-medium text-gray-900">
                          {gateway.title}
                        </RadioGroup.Label>
                        <div className="mt-1 flex flex-wrap items-center">
                          {gateway.schemes.length > 0 && !gateway.requiresSchemeSelection && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              {gateway.schemes.map((scheme) => (
                                <span key={scheme.id}>{scheme.name}</span>
                              )).reduce((prev, curr, i) => [prev, <span key={i} className="mx-1">•</span>, curr] as any)}
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Estimasi Pencairan: 1 hari kerja</p>
                      </div>

                      {/* Right: Fees */}
                      <div className="flex-shrink-0 ml-4 text-right">
                        <p className="text-sm font-medium text-gray-900">Fee</p>
                        <p className="text-sm text-gray-700">
                          {formatFeeText(gateway)}
                        </p>
                      </div>

                      {/* Radio button */}
                      <div className="flex-shrink-0 ml-4">
                        <span
                          className={`${
                            checked ? 'bg-primary-default border-transparent' : 'bg-white border-gray-300'
                          } rounded-full h-5 w-5 flex items-center justify-center border`}
                        >
                          {checked && (
                            <span className="rounded-full bg-white h-2 w-2" />
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>

          {/* Scheme selection for gateways that require it */}
          {paymentGateway?.requiresSchemeSelection && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Pilih Bank:</h3>
              <div className="grid grid-cols-3 gap-4">
                {paymentGateway.schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className={`flex cursor-pointer flex-col items-center rounded-md border p-3 ${
                      paymentScheme?.id === scheme.id
                        ? 'border-primary-default bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectScheme(scheme)}
                  >
                    <img
                      src={scheme.logoUrl}
                      alt={scheme.name}
                      className="h-8 w-auto object-contain"
                    />
                    <span className="mt-2 text-xs text-gray-700">{scheme.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                <span className="text-gray-900 font-medium">{IDRFormatter.toCurrency(calculateFees(paymentGateway))}</span>
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