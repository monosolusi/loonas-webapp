"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  OutgoingStep,
  useCreateOutgoingInvoice,
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useCreateNewPartnerProvider } from "@/features/partner/presentation/providers/create-new-partner";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { CreateInvoiceSendOptionsDialogImpl } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/send-options-dialog-impl";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";

const OUTGOING_STEP_MAP: OutgoingStep[] = [
  "select-recipient",
  "invoice-details",
  "payment-configuration",
  "review-and-send",
];

export function CreateOutgoingActionBar() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    recipient,
    isInvoiceDetailsStepClean,
    isPaymentConfigStepClean,
    items,
    paymentConfiguration,
    addInvoiceItem,
    updateInvoiceItem,
    editingItemIndex,
    setEditingItemIndex,
  } = useCreateOutgoingInvoice();
  const { create, loading: createPartnerLoading } = useCreateNewPartnerProvider();
  const addItemCtx = useAddItem();
  const [dialogOpen, setDialogOpen] = useState(false);

  const goToStep = (step: OutgoingStep) => {
    setCurrentStep?.(step);
  };

  const goToNextStep = () => {
    const currentIndex = OUTGOING_STEP_MAP.indexOf(currentStep);
    if (currentIndex < 0 || currentIndex >= OUTGOING_STEP_MAP.length - 1) return;
    goToStep(OUTGOING_STEP_MAP[currentIndex + 1]);
  };

  const goToPreviousStep = () => {
    const currentIndex = OUTGOING_STEP_MAP.indexOf(currentStep);
    if (currentIndex <= 0) return;
    goToStep(OUTGOING_STEP_MAP[currentIndex - 1]);
  };

  const isSendDisabled = useMemo(() => {
    if (!recipient) return true;
    if (items.length === 0) return true;
    if (paymentConfiguration.length === 0) return true;
    return false;
  }, [recipient, items, paymentConfiguration]);

  const handleSaveClient = async () => {
    if (!create) return;
    await create();
    goToStep("select-recipient");
  };

  const handleCancelItem = () => {
    addItemCtx.clearInput?.();
    setEditingItemIndex?.(null);
    goToStep("invoice-details");
  };

  const handleSaveItem = () => {
    if (addItemCtx.name.trim() === "" || addItemCtx.mustRecalculateTax) return;

    const itemData = {
      name: addItemCtx.name,
      description: addItemCtx.description,
      qty: addItemCtx.qty,
      price: addItemCtx.price,
      taxType: addItemCtx.taxType,
      tax: addItemCtx.tax,
      taxBase: addItemCtx.taxBase,
      discountType: addItemCtx.discountType,
      discount: addItemCtx.discount,
      total: addItemCtx.total,
    };

    if (currentStep === "invoice-details.edit-item" && editingItemIndex !== null) {
      updateInvoiceItem?.({ index: editingItemIndex, newData: itemData });
    } else {
      addInvoiceItem?.(itemData);
    }

    addItemCtx.clearInput?.();
    setEditingItemIndex?.(null);
    goToStep("invoice-details");
  };

  const isItemSaveDisabled = useMemo(() => {
    return addItemCtx.name.trim() === "" || addItemCtx.mustRecalculateTax;
  }, [addItemCtx.name, addItemCtx.mustRecalculateTax]);

  const handleSendCompleted = (item: OutgoingInvoiceEntity) => {
    setDialogOpen(false);
    router.push(`/invoices/${item.id}`);
  };

  const leftButton = useMemo(() => {
    switch (currentStep) {
      case "select-recipient":
        return <SecondaryButton outlined label="Batal" onClick={() => router.back()} />;
      case "select-recipient.create-new":
        return <SecondaryButton outlined label="Batal" onClick={() => goToStep("select-recipient")} />;
      case "invoice-details.add-item":
      case "invoice-details.edit-item":
        return <SecondaryButton outlined label="Batal" onClick={handleCancelItem} />;
      case "invoice-details":
        return <SecondaryButton outlined label="Kembali" onClick={goToPreviousStep} />;
      case "payment-configuration":
        return <SecondaryButton outlined label="Kembali" onClick={goToPreviousStep} />;
      case "review-and-send":
        return <SecondaryButton outlined label="Kembali" onClick={goToPreviousStep} />;
      default:
        return null;
    }
  }, [currentStep, router]);

  const rightButton = useMemo(() => {
    switch (currentStep) {
      case "select-recipient":
        return <PrimaryButton label="Selanjutnya" disabled={!recipient} onClick={goToNextStep} />;
      case "select-recipient.create-new":
        return (
          <PrimaryButton label="Simpan Klien" loading={createPartnerLoading} onClick={handleSaveClient} />
        );
      case "invoice-details.add-item":
      case "invoice-details.edit-item":
        return <PrimaryButton label="Simpan Item" disabled={isItemSaveDisabled} onClick={handleSaveItem} />;
      case "invoice-details":
        return <PrimaryButton label="Selanjutnya" disabled={!isInvoiceDetailsStepClean} onClick={goToNextStep} />;
      case "payment-configuration":
        return <PrimaryButton label="Selanjutnya" disabled={!isPaymentConfigStepClean} onClick={goToNextStep} />;
      case "review-and-send":
        return (
          <>
            <PrimaryButton label="Kirim Faktur" disabled={isSendDisabled} onClick={() => setDialogOpen(true)} />
            <CreateInvoiceSendOptionsDialogImpl
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onCompleted={handleSendCompleted}
            />
          </>
        );
      default:
        return null;
    }
  }, [currentStep, recipient, isInvoiceDetailsStepClean, isPaymentConfigStepClean, isSendDisabled, isItemSaveDisabled, dialogOpen, createPartnerLoading]);

  return (
    <div className="flex flex-row items-center justify-between border-t border-t-neutral-200 p-6">
      <div className="flex">{leftButton}</div>
      <div className="flex">{rightButton}</div>
    </div>
  );
}
