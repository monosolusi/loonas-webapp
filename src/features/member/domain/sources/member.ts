import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { MemberModel } from "@/features/member/data/models/member";

export interface MemberService {
  list(session: SessionEntity): Promise<MemberModel[]>;
  invite(email: string, session: SessionEntity): Promise<MemberModel>;
  respond(id: string, action: string, session: SessionEntity): Promise<void>;
  remove(id: string, session: SessionEntity): Promise<void>;
}
