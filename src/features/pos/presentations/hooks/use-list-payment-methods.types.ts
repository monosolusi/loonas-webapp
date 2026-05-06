import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";

export type ListPaymentMethodsFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  isEnabled?: boolean;
};

type InitialState = {
  status: "loading";
  paymentMethods: null;
  error: null;
};

type LoadedState = {
  status: "loaded";
  paymentMethods: PaymentMethodEntity[];
  error: null;
};

type ErrorState = {
  status: "error";
  paymentMethods: null;
  error: ServerError;
};

export type UseListPaymentMethodsState = InitialState | LoadedState | ErrorState;
