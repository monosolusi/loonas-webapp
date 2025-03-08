import { SessionModel } from "@/app/(authentication)/_data/_models/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export abstract class AuthService {
  abstract signIn(email: string, password: string): Promise<SessionModel>;
}

export class AuthServiceImpl implements AuthService {
  public async signIn(email: string, password: string): Promise<SessionModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const basicAuth = btoa(`${email}:${password}`);
      const url = `${baseUrl}/auth/user-credentials/token`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Basic ${basicAuth}` }
      });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });
        if (data.code === ErrorCodes.FORBIDDEN.code) throw new ServerError(ErrorCodes.FORBIDDEN);
        if (data.code === ErrorCodes.NOT_FOUND.code) throw new ServerError(ErrorCodes.FORBIDDEN);
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      return SessionModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}