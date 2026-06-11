"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PaymentMethodRepositoryImpl } from "@/features/pos/data/repositories/payment-method";
import { PaymentMethodServiceImpl } from "@/features/pos/data/sources/payment-method";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";
import {
  ListPaymentMethodsUseCase,
  ListPaymentMethodsUseCaseParams,
} from "@/features/pos/domain/usecases/list-payment-methods.usecases";
import { POS_SWR_KEYS } from "@/features/pos/presentations/constants/swr-keys";
import {
  ListPaymentMethodsFetcherParams,
  UseListPaymentMethodsState,
} from "@/features/pos/presentations/hooks/use-list-payment-methods.types";

async function ListPaymentMethodFetcher([_, fetcherParams]: [string, ListPaymentMethodsFetcherParams]): Promise<PaymentMethodEntity[]> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const paymentMethodRepository = new PaymentMethodRepositoryImpl(new PaymentMethodServiceImpl(new HttpRequest()));
  const listPaymentMethods = new ListPaymentMethodsUseCase(paymentMethodRepository, sessionRepository);

  const result = await listPaymentMethods.execute(new ListPaymentMethodsUseCaseParams(fetcherParams.isEnabled));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type UseListPaymentMethodsParams = {
  isEnabled?: boolean;
};

export function useListPaymentMethods(params?: UseListPaymentMethodsParams): UseListPaymentMethodsState {
  const clerk = useClerk();

  const { data, error } = useSWR(
    [POS_SWR_KEYS.LIST_PAYMENT_METHODS, { clerk, isEnabled: params?.isEnabled }],
    ListPaymentMethodFetcher,
  );

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN, { error });
    return { status: "error", paymentMethods: null, error: serverError };
  }
  if (!data) return { status: "loading", paymentMethods: null, error: null };
  return { status: "loaded", paymentMethods: data, error: null };
}
