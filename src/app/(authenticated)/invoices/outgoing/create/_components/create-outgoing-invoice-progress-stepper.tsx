import { ProgressStepper, ProgressStepperItem, StepStatus } from "@/core/presentations/components/progress-stepper";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useMemo } from "react";

const ORIGINAL_STEPS = [
  { id: "1", label: "Pilih Penerima", status: "current" },
  { id: "2", label: "Detail Tagihan", status: "upcoming" },
  { id: "3", label: "Pengaturan Pembayaran", status: "upcoming" },
  { id: "4", label: "Review & Kirim", status: "upcoming" }
];

export function CreateOutgoingInvoiceProgressStepper() {
  const { currentStep } = useCreateOutgoingInvoice();

  const generatedData: ProgressStepperItem[] = useMemo(() => {
    return ORIGINAL_STEPS.map((step, index) => {
      // Determine the status, currentStep > index, then it should be completed
      // If currentStep === index, then it should be current
      // If currentStep < index, then it should be upcoming

      const status: StepStatus = currentStep > index ? "completed" : currentStep === index ? "current" : "upcoming";
      return Object.assign({}, step, { status }) as ProgressStepperItem;
    });
  }, [currentStep]);

  return (
    <ProgressStepper data={generatedData} />
  );
}
