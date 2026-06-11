"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { MemberRepositoryImpl } from "@/features/member/data/repositories/member";
import { MemberServiceImpl } from "@/features/member/data/sources/member";
import { ListInvitesUseCase } from "@/features/member/domain/usecases/list-invites.usecases";
import { InviteEntity } from "@/features/member/domain/entities/invite";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

async function ListInvitationsFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const memberRepository = new MemberRepositoryImpl(new MemberServiceImpl(new HttpRequest()));
  const listInvites = new ListInvitesUseCase(memberRepository, sessionRepository);

  const result = await listInvites.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseListInvitationsReturnType = {
  invitations: InviteEntity[];
  loading: boolean;
  error: ServerError | null;
  count: number;
};

export function useListInvitations(): UseListInvitationsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(["list-invitations", { clerk }], ListInvitationsFetcher);

  return {
    invitations: data ?? [],
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
    count: data?.length ?? 0,
  };
}
