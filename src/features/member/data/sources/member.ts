import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { MemberModel } from "@/features/member/data/models/member";
import { InviteModel } from "@/features/member/data/models/invite";
import { MemberService } from "@/features/member/domain/sources/member";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class MemberServiceImpl implements MemberService {
  constructor(private readonly http: HttpRequest) {}

  public async listInvites(session: SessionEntity): Promise<InviteModel[]> {
    try {
      const result = await this.http.request({
        path: "/members/invites",
        method: "GET",
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return items.map(InviteModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async list(session: SessionEntity): Promise<MemberModel[]> {
    try {
      const result = await this.http.request({
        path: "/members",
        method: "GET",
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return items.map(MemberModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async invite(email: string, session: SessionEntity): Promise<MemberModel> {
    try {
      const result = await this.http.request({
        path: "/members",
        method: "POST",
        body: { email },
        session,
      });

      return MemberModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async respond(id: string, action: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/members/${id}`,
        method: "PATCH",
        body: { action },
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async remove(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/members/${id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
