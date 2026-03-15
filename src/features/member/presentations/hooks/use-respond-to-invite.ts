"use client";

import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { MemberRepositoryImpl } from "@/features/member/data/repositories/member";
import { MemberServiceImpl } from "@/features/member/data/sources/member";
import { RespondToInviteUseCase, RespondToInviteUseCaseParams } from "@/features/member/domain/usecases/respond-to-invite.usecases";
import { InviteAction } from "@/features/member/domain/enums/invite-action";
import { useClerk } from "@clerk/nextjs";

type RespondToInviteTriggerParams = {
  id: string;
  action: InviteAction;
};

type RespondToInviteFetcherParams = RespondToInviteTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function RespondToInviteFetcher(
  _: string,
  { arg }: { arg: RespondToInviteFetcherParams },
): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const memberRepository = new MemberRepositoryImpl(new MemberServiceImpl(new HttpRequest()));
  const respondToInvite = new RespondToInviteUseCase(memberRepository, sessionRepository);

  const result = await respondToInvite.execute(
    new RespondToInviteUseCaseParams({ id: arg.id, action: arg.action }),
  );
  if (result instanceof DataFailed) throw result.error;
}

export function useRespondToInvite() {
  return useSWRMutationClerk("respond-to-invite", RespondToInviteFetcher);
}
