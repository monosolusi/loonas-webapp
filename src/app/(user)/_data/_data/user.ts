import { SessionEntity } from "@/app/(authentication)/_domain/_entities/session";
import { UserModel } from "@/app/(user)/_data/_models/user";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export abstract class UserService {
  public abstract retrieveMe(session: SessionEntity): Promise<UserModel>;
}

export class UserServiceImpl implements UserService {
  public async retrieveMe(session: SessionEntity): Promise<UserModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/users/me`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Authorization": `Bearer ${session.accessToken}` }
      });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        if (data.code === ErrorCodes.FORBIDDEN.code) throw new ServerError(ErrorCodes.FORBIDDEN);
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return UserModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}