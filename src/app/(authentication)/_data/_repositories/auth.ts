import {AuthRepository} from "@/app/(authentication)/_domain/_repositories/auth";
import {DataFailed, DataState, DataSuccess} from "@/core/resources/data-state";
import {SessionEntity} from "../../_domain/_entities/session";
import {ErrorCodes, ServerError} from "@/core/resources/server-error";
import {AuthService} from "../_sources/auth";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authService: AuthService) {
  }

  public async signIn(email: string, password: string): Promise<DataState<SessionEntity>> {
    try {
      const session = await this.authService.signIn(email, password);
      return new DataSuccess(session.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, {error: err}))
    }
  }

}