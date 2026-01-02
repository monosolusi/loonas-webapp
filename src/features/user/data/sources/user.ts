import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { UserModel } from "@/features/user/data/models/user";
import { UserService } from "@/features/user/domain/sources/user";
import { HttpRequest } from "@/core/helpers/http-request";

export class UserServiceImpl implements UserService {
  constructor(private readonly http: HttpRequest) {}

  public async create(email: string, password: string): Promise<void> {
    const path = "/users/register";
    const method = "POST";
    const basicAuth = btoa(`${email}:${password}`);
    await this.http.request(
      { path, method },
      {
        requireAccount: false,
        requireAuth: false,
        headers: { Authorization: `Basic ${basicAuth}` },
      },
    );
  }

  public async retrieveMe(session: SessionEntity): Promise<UserModel> {
    const path = "/users/me";
    const method = "GET";
    const response = await this.http.request({ path, method, session }, { requireAccount: false });
    return UserModel.fromJson(response);
  }
}
