import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { InviteAction } from "@/features/member/domain/enums/invite-action";

export interface MemberRepository {
  list(session: SessionEntity): Promise<DataState<MemberEntity[]>>;
  invite(email: string, session: SessionEntity): Promise<DataState<MemberEntity>>;
  respond(id: string, action: InviteAction, session: SessionEntity): Promise<DataState<void>>;
  remove(id: string, session: SessionEntity): Promise<DataState<void>>;
}
