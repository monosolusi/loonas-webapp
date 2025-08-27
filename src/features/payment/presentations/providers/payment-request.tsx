"use client";

import React, { useEffect, useState } from "react";
import { PaymentRequestEntity } from "@/features/payment/domain/entities/payment-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { PaymentRequestRepositoryImpl } from "@/features/payment/data/repositories/payment-request";
import { PaymentRequestServiceImpl } from "@/features/payment/data/sources/payment-request";
import { DataFailed } from "@/core/resources/data-state";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { PaymentGatewayServiceImpl } from "@/features/payment/data/sources/payment-gateway";
import {
  RetrievePaymentRequestUseCase,
  RetrievePaymentRequestUseCaseParams,
} from "@/features/payment/domain/usecases/retrieve-payment-request";
import { HttpRequest } from "@/core/helpers/http-request";

interface PaymentRequestContextProps {
  paymentRequest?: PaymentRequestEntity;
  loading: boolean;
  error?: Error;
}

const PaymentRequestContext = React.createContext<PaymentRequestContextProps>({
  loading: false,
});

export function PaymentRequestProvider(props: { children: React.ReactNode; includes?: string; requestId: string }) {
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequestEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function fetchPaymentRequest(requestId: string, includes?: string) {
    setLoading(true);
    setError(undefined);

    try {
      const http = new HttpRequest();
      const sessionService = new LocalStorageSessionService();
      const partnerService = new PartnerServiceImpl(http);
      const bankService = new BankServiceImpl();
      const paymentGatewayService = new PaymentGatewayServiceImpl();
      const paymentRequestService = new PaymentRequestServiceImpl(partnerService, bankService, paymentGatewayService);

      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const paymentRequestRepository = new PaymentRequestRepositoryImpl(paymentRequestService);
      const retrieve = new RetrievePaymentRequestUseCase(sessionRepository, paymentRequestRepository);
      const retrieveParams = new RetrievePaymentRequestUseCaseParams({ requestId, includes });
      const result = await retrieve.execute(retrieveParams);
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setPaymentRequest(result.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  useEffect(() => {
    if (props.requestId === undefined) return;
    fetchPaymentRequest(props.requestId, props.includes);
  }, [props.requestId, props.includes]);

  return (
    <PaymentRequestContext.Provider value={{ paymentRequest, loading }}>
      {props.children}
    </PaymentRequestContext.Provider>
  );
}

export function usePaymentRequest() {
  return React.useContext(PaymentRequestContext);
}
