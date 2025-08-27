"use client";

import React, { useContext, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { DataFailed } from "@/core/resources/data-state";
import { UpdatePartnerUseCase, UpdatePartnerUseCaseParams } from "@/features/partner/domain/usecases/update-partner";
import { HttpRequest } from "@/core/helpers/http-request";

interface UpdatePartnerParams {
  name?: string;
  email?: string;
  phone?: string;
}

interface UpdatePartnerProviderProps {
  id: string;
  children: React.ReactNode;
}

interface UpdatePartnerContextProps {
  loading: boolean;
  updatePartner?: (filter: { id: string }, params: UpdatePartnerParams) => Promise<void>;
  error?: ServerError;
}

const UpdatePartnerContext = React.createContext<UpdatePartnerContextProps>({
  loading: false,
});

export function UpdatePartnerProvider(props: UpdatePartnerProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ServerError>();

  const updatePartner = async (filter: { id: string }, params: UpdatePartnerParams) => {
    setLoading(true);
    setError(undefined);

    try {
      if (!props.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (props.id !== filter.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const http = new HttpRequest();
      const sessionService = new LocalStorageSessionService();
      const partnerService = new PartnerServiceImpl(http);
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const partnerRepository = new PartnerRepositoryImpl(partnerService);
      const update = new UpdatePartnerUseCase(partnerRepository, sessionRepository);
      const updateParams = new UpdatePartnerUseCaseParams(filter, params);

      const result = await update.execute(updateParams);
      if (result instanceof DataFailed) throw result.error;
      if (result.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setLoading(false);
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      setError(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  };

  return (
    <UpdatePartnerContext.Provider value={{ loading, error, updatePartner }}>
      {props.children}
    </UpdatePartnerContext.Provider>
  );
}

export function useUpdatePartner() {
  return useContext(UpdatePartnerContext);
}
