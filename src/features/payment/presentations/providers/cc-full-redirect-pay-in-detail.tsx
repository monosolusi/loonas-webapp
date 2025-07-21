"use client";

import React, { useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { DataFailed } from "@/core/resources/data-state";
import { CreditCardFullRedirectPayInDetailEntity } from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";
import {
  RetrieveCreditCardFullRedirectPayInDetailUseCase,
  RetrieveCreditCardFullRedirectPayInDetailUseCaseParams,
} from "@/features/payment/domain/usecases/retrieve-cc-full-redirect-pay-in-detail";
import { CreditCardFullRedirectPayInRepository } from "@/features/payment/data/repositories/cc-full-redirect-pay-in";
import { CreditCardFullRedirectPayInService } from "@/features/payment/data/sources/cc-full-redirect-pay-in";
import { HttpRequest } from "@/core/helpers/http-request";

interface CreditCardFullRedirectPayInDetailContextProps {
  ccDetail?: CreditCardFullRedirectPayInDetailEntity;
  loading: boolean;
  error?: ServerError;
}

const CreditCardFullRedirectPayInDetailContext = React.createContext<CreditCardFullRedirectPayInDetailContextProps>({
  loading: false,
});

export function CreditCardFullRedirectPayInDetailProvider(props: { children: React.ReactNode; requestId: string }) {
  const [ccDetail, setCcDetail] = useState<CreditCardFullRedirectPayInDetailEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ServerError>();

  async function fetchCreditCardFullRedirectPayInDetail(requestId: string) {
    const http = new HttpRequest();
    const sessionService = new LocalStorageSessionService();
    const payInService = new CreditCardFullRedirectPayInService(http);

    const payInRepository = new CreditCardFullRedirectPayInRepository(payInService);
    const sessionRepository = new SessionRepositoryImpl(sessionService);
    const retrieve = new RetrieveCreditCardFullRedirectPayInDetailUseCase(sessionRepository, payInRepository);
    const retrieveParams = new RetrieveCreditCardFullRedirectPayInDetailUseCaseParams({ requestId });
    const result = await retrieve.execute(retrieveParams);
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    setCcDetail(result.data);
    setLoading(false);
  }

  useEffect(() => {
    if (props.requestId === undefined) return;
    fetchCreditCardFullRedirectPayInDetail(props.requestId);
  }, [props.requestId]);

  return (
    <CreditCardFullRedirectPayInDetailContext.Provider value={{ ccDetail, loading, error }}>
      {props.children}
    </CreditCardFullRedirectPayInDetailContext.Provider>
  );
}

export function useCreditCardFullRedirectPayInDetail() {
  return React.useContext(CreditCardFullRedirectPayInDetailContext);
}
