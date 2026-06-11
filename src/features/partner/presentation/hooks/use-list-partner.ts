"use client";

import useSWR from "swr";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { PartnerServiceImpl } from "@/features/partner/data/sources/partner";
import { PartnerRepositoryImpl } from "@/features/partner/data/repositories/partner";
import { ListPartnerUseCase } from "@/features/partner/domain/usecases/list-partner";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { HttpRequest } from "@/core/helpers/http-request";
import { useClerk } from "@clerk/nextjs";
import { ListPartnerFetcherParams } from "@/features/partner/presentation/hooks/use-list-partner.types";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";

async function ListPartnerFetcher([_, params]: [string, ListPartnerFetcherParams]): Promise<PartnerEntity[]> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const partnerRepository = new PartnerRepositoryImpl(new PartnerServiceImpl(new HttpRequest()));
  const listPartners = new ListPartnerUseCase(partnerRepository, sessionRepository);

  const partners = await listPartners.execute();
  if (partners instanceof DataFailed) throw partners.error;
  if (partners.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (partners.data.length === 0) return [];

  return partners.data;
}

export function useListPartner() {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(["list-partner", { clerk }], ListPartnerFetcher);

  if (error instanceof ServerError && error.code === ErrorCodes.NOT_FOUND.code) {
    return { partners: [], loading: false, error: undefined, refreshPartners: mutate };
  }

  return {
    partners: data ?? [],
    loading: isLoading,
    error: error,
    refreshPartners: mutate,
  };
}
