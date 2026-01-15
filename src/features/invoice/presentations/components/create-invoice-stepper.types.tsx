export type State = "active" | "default";

export type CreateInvoiceStepperProps = {
  title: string;
  description: string;
  iconPath: {
    default: string;
    active: string;
  };
  state?: State;
};

export type StateValue = {
  backgroundColor: string;
  borderColor: string;
  description?: string;
  descriptionForeground: string;
  iconPath?: string;
};
