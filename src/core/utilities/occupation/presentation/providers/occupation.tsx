"use client";

import React, { useEffect } from "react";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { OccupationEntity } from "../../domain/entities/occupation";
import { ListOccupationUseCase } from "@/core/utilities/occupation/domain/usecases/list-occupation";
import { OccupationRepositoryImpl } from "../../data/repostiroies/occupation";
import { OccupationServiceImpl } from "../../data/sources/occupation";

type OccupationContextProps = [OccupationEntity[], boolean];

const OccupationContext = React.createContext<OccupationContextProps>([[], false]);

export function OccupationProvider({ children }: { children: any }) {
  const [occupations, setOccupations] = React.useState<OccupationEntity[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    list();
  }, []);

  async function list(): Promise<void> {
    try {
      setLoading(true);

      const occupationService = new OccupationServiceImpl();
      const occupationRepository = new OccupationRepositoryImpl(occupationService);
      const listOccupation = new ListOccupationUseCase(occupationRepository);
      const occupations = await listOccupation.execute();
      if (occupations instanceof DataFailed) throw occupations.error;
      if (!occupations.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      setOccupations(occupations.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <OccupationContext.Provider value={[occupations, loading]}>
      {children}
    </OccupationContext.Provider>
  );
}

export function useOccupation() {
  return React.useContext(OccupationContext);
}