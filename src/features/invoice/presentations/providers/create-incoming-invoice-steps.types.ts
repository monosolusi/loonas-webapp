export type Step =
  | "select-client"
  | "select-client.create-new"
  | "invoices"
  | "client-bank-account"
  | "client-bank-account.create-new"
  | "select-payment-method"
  | "payment"
  | "invoice-created";

export type CreateIncomingInvoiceStepsProviderProps = {
  children: React.ReactNode;
};

export type CreateIncomingInvoiceStepsContextProps = {
  currentStep: Step;
  setCurrentStep?: (step: Step) => void;
};
