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
import { ListMembersUseCase } from "@/features/member/domain/usecases/list-members.usecases";
import { UseListMembersReturnType } from "@/features/member/presentations/hooks/use-list-members.types";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

const INITIAL_STATE: UseListMembersReturnType = {
  members: null,
  loading: true,
  error: null,
  refresh: null,
};

async function ListMembersFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const memberRepository = new MemberRepositoryImpl(new MemberServiceImpl(new HttpRequest()));
  const listMembers = new ListMembersUseCase(memberRepository, sessionRepository);

  const result = await listMembers.execute();
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useListMembers(): UseListMembersReturnType {
  const clerk = useClerk();
  const { data, isLoading, error, mutate } = useSWR(["list-members", { clerk }], ListMembersFetcher);

  if (isLoading) return INITIAL_STATE;
  if (error) {
    return {
      members: null,
      loading: false,
      error: error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN),
      refresh: null,
    };
  }

  return {
    members: data ?? [],
    loading: false,
    error: null,
    refresh: mutate,
  };
}
