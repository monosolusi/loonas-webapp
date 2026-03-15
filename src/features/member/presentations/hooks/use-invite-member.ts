"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { MemberRepositoryImpl } from "@/features/member/data/repositories/member";
import { MemberServiceImpl } from "@/features/member/data/sources/member";
import { InviteMemberUseCase, InviteMemberUseCaseParams } from "@/features/member/domain/usecases/invite-member.usecases";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { useClerk } from "@clerk/nextjs";

type InviteMemberTriggerParams = {
  email: string;
};

type InviteMemberFetcherParams = InviteMemberTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function InviteMemberFetcher(
  _: string,
  { arg }: { arg: InviteMemberFetcherParams },
): Promise<MemberEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const memberRepository = new MemberRepositoryImpl(new MemberServiceImpl(new HttpRequest()));
  const inviteMember = new InviteMemberUseCase(memberRepository, sessionRepository);

  const result = await inviteMember.execute(new InviteMemberUseCaseParams({ email: arg.email }));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useInviteMember() {
  return useSWRMutationClerk("invite-member", InviteMemberFetcher);
}
