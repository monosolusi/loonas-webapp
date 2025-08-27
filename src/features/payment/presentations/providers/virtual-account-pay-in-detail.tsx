"use client";

import React, { useEffect, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { DataFailed } from "@/core/resources/data-state";
import {
  RetrieveVirtualAccountPayInDetailUseCase,
  RetrieveVirtualAccountPayInDetailUseCaseParams,
} from "@/features/payment/domain/usecases/retrieve-virtual-account-pay-in-detail";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { VirtualAccountPayInRepository } from "@/features/payment/data/repositories/va-pay-in";
import { VirtualAccountPayInService } from "@/features/payment/data/sources/va-pay-in";
import { HttpRequest } from "@/core/helpers/http-request";

interface VirtualAccountPayInDetailContextProps {
  vaDetail?: VirtualAccountPayInDetailEntity;
  loading: boolean;
  error?: Error;
}

const VirtualAccountPayInDetailContext = React.createContext<VirtualAccountPayInDetailContextProps>({
  loading: false,
});

export function VirtualAccountPayInDetailProvider(props: { children: React.ReactNode; requestId: string }) {
  const [vaDetail, setVaDetail] = useState<VirtualAccountPayInDetailEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  async function fetchVirtualAccountPayInDetail(requestId: string) {
    setLoading(true);
    setError(undefined);

    try {
      const http = new HttpRequest();
      const sessionService = new LocalStorageSessionService();
      const payInService = new VirtualAccountPayInService(http);

      const payInRepository = new VirtualAccountPayInRepository(payInService);
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const retrieve = new RetrieveVirtualAccountPayInDetailUseCase(sessionRepository, payInRepository);
      const retrieveParams = new RetrieveVirtualAccountPayInDetailUseCaseParams({ requestId });
      const result = await retrieve.execute(retrieveParams);
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setVaDetail(result.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  useEffect(() => {
    if (props.requestId === undefined) return;
    fetchVirtualAccountPayInDetail(props.requestId);
  }, [props.requestId]);

  return (
    <VirtualAccountPayInDetailContext.Provider value={{ vaDetail, loading, error }}>
      {props.children}
    </VirtualAccountPayInDetailContext.Provider>
  );
}

export function useVirtualAccountPayInDetail() {
  return React.useContext(VirtualAccountPayInDetailContext);
}
