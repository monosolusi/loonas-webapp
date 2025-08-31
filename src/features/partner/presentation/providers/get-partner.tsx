"use client";

import React, { useEffect, useState } from "react";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { DataFailed } from "@/core/resources/data-state";
import { GetPartnerUseCase, GetPartnerUseCaseParams } from "@/features/partner/domain/usecases/get-partner";
import { HttpRequest } from "@/core/helpers/http-request";

interface GetPartnerContextProps {
  partner?: PartnerEntity;
  loading: boolean;
  error?: ServerError;
  refresh?: () => Promise<void>;
}

interface GetPartnerProviderProps {
  id: string;
  children: React.ReactNode;
}

const GetPartnerContext = React.createContext<GetPartnerContextProps>({
  loading: false,
});

export function GetPartnerProvider(props: GetPartnerProviderProps) {
  const [partner, setPartner] = useState<PartnerEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ServerError>();

  const fetchPartner = async (id: string) => {
    setLoading(true);
    setError(undefined);

    try {
      if (!props.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const http = new HttpRequest();
      const sessionService = new LocalStorageSessionService();
      const partnerService = new PartnerServiceImpl(http);
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const partnerRepository = new PartnerRepositoryImpl(partnerService);
      const retrieve = new GetPartnerUseCase(partnerRepository, sessionRepository);
      const retrieveParams = new GetPartnerUseCaseParams({ id });

      const result = await retrieve.execute(retrieveParams);
      if (result instanceof DataFailed) throw result.error;
      if (result.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setPartner(result.data);
      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  };

  const refresh = async () => {
    await fetchPartner(props.id);
  };

  useEffect(() => {
    if (props.id) fetchPartner(props.id);
  }, [props.id]);

  return (
    <GetPartnerContext.Provider value={{ partner, loading, refresh, error }}>
      {props.children}
    </GetPartnerContext.Provider>
  );
}

export function useGetPartner() {
  return React.useContext(GetPartnerContext);
}
