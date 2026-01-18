export type Step = "select-client" | "select-client.create-new" | "invoices";

export type CreateIncomingInvoiceStepsProviderProps = {
  children: React.ReactNode;
};

export type CreateIncomingInvoiceStepsContextProps = {
  currentStep: Step;
  setCurrentStep?: (step: Step) => void;
};
