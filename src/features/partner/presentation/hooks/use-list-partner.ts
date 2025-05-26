"use client";

import useSWR from "swr";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { ListPartnerUseCase } from "@/features/partner/domain/usecases/list-partner";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";


async function listPartnerFetcher(): Promise<PartnerEntity[]> {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const partnerService = new PartnerServiceImpl();
  const partnerRepository = new PartnerRepositoryImpl(partnerService);
  const listPartners = new ListPartnerUseCase(partnerRepository, sessionRepository);

  const partners = await listPartners.execute();
  if (partners instanceof DataFailed) throw partners.error;
  if (partners.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (partners.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

  return partners.data;
}

export function useListPartner() {
  const { data, isLoading, error, mutate } = useSWR("list-partner", listPartnerFetcher);

  return {
    partners: data ?? [],
    loading: isLoading,
    error: error,
    refreshPartners: mutate
  };
}
