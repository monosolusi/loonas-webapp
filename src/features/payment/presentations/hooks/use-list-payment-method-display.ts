"use client";

import { ListPaymentMethodDisplayFetcherParams } from "@/features/payment/presentations/hooks/use-list-payment-method-display.types";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import useSWR from "swr";
import { PaymentMethodCategoryEntity } from "@/features/payment/domain/entities/payment-method-category.entity";
import { PaymentMethodRepositoryImpl } from "@/features/payment/data/repositories/payment-method.repository-impl";
import { PaymentMethodServiceImpl } from "@/features/payment/data/sources/payment-method.service-impl";
import { ListPaymentMethodDisplayUseCase } from "@/features/payment/domain/usecases/list-payment-method-display.usecase";

async function ListPaymentMethodDisplayFetcher([, params]: [string, ListPaymentMethodDisplayFetcherParams]): Promise<
  PaymentMethodCategoryEntity[]
> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const paymentMethodRepository = new PaymentMethodRepositoryImpl(new PaymentMethodServiceImpl(new HttpRequest()));
  const list = new ListPaymentMethodDisplayUseCase(paymentMethodRepository, sessionRepository);

  const result = await list.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useListPaymentMethodDisplay() {
  const clerk = useClerk();
  return useSWR(["list-payment-method-display", { clerk }], ListPaymentMethodDisplayFetcher);
}
