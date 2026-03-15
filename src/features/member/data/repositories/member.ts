import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { MemberRepository } from "@/features/member/domain/repositories/member";
import { MemberService } from "@/features/member/domain/sources/member";
import { InviteAction } from "@/features/member/domain/enums/invite-action";

export class MemberRepositoryImpl implements MemberRepository {
  constructor(private readonly memberService: MemberService) {}

  public async list(session: SessionEntity): Promise<DataState<MemberEntity[]>> {
    try {
      const members = await this.memberService.list(session);
      return new DataSuccess(members.map((member) => member.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async invite(email: string, session: SessionEntity): Promise<DataState<MemberEntity>> {
    try {
      const member = await this.memberService.invite(email, session);
      return new DataSuccess(member.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async respond(id: string, action: InviteAction, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.memberService.respond(id, action, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async remove(id: string, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.memberService.remove(id, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
