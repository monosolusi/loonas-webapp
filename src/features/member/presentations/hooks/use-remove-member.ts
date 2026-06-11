"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { MemberRepositoryImpl } from "@/features/member/data/repositories/member";
import { MemberServiceImpl } from "@/features/member/data/sources/member";
import { RemoveMemberUseCase, RemoveMemberUseCaseParams } from "@/features/member/domain/usecases/remove-member.usecases";
import { useClerk } from "@clerk/nextjs";

type RemoveMemberTriggerParams = {
  id: string;
};

type RemoveMemberFetcherParams = RemoveMemberTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function RemoveMemberFetcher(
  _: string,
  { arg }: { arg: RemoveMemberFetcherParams },
): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const memberRepository = new MemberRepositoryImpl(new MemberServiceImpl(new HttpRequest()));
  const removeMember = new RemoveMemberUseCase(memberRepository, sessionRepository);

  const result = await removeMember.execute(new RemoveMemberUseCaseParams({ id: arg.id }));
  if (result instanceof DataFailed) throw result.error;
}

export function useRemoveMember() {
  return useSWRMutationClerk("remove-member", RemoveMemberFetcher);
}
