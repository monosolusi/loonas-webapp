import { ComponentType, ReactNode } from "react";

/** Wizard step identifiers. "method" is the entry; the rest are method-specific. */
export type PaymentHandlerStep = "method" | "nominal" | "confirm";

export type CancelGuardConfig = {
  title: string;
  description: string;
  confirmLabel: string;
};

export type PaymentMethodHandler = {
  /** Identifier matched against `paymentGateway.type` (case-insensitive). */
  type: string;
  /** Ordered list of steps for this method. Always begins with "method". */
  steps: PaymentHandlerStep[];
  /** Step the wizard advances to after this method is picked. Must be in `steps`. */
  initialStep: Exclude<PaymentHandlerStep, "method">;
  /** Optional wrapper that owns method-specific state shared across steps. */
  Provider?: ComponentType<{ children: ReactNode }>;
  /** Body for the "nominal" step. Required iff `steps` contains "nominal". */
  NominalComponent?: ComponentType;
  /** Body for the "confirm" step. */
  ConfirmComponent: ComponentType;
  /** When defined, ✕ on the wizard header opens a confirmation dialog before cancelling. */
  cancelGuard?: CancelGuardConfig;
};
