import { AuthRepository } from "@/features/authentication/domain/repositories/auth";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "../../domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AuthService } from "../sources/auth";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authService: AuthService) {
  }

  public async verifyResetToken(token: string): Promise<DataState<boolean>> {
    try {
      await this.authService.verifyResetToken(token);
      return new DataSuccess(true);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async submitNewPassword(resetToken: string, password: string): Promise<DataState<boolean>> {
    try {
      await this.authService.submitNewPassword(resetToken, password);
      return new DataSuccess(true);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async sendPasswordResetEmail(email: string): Promise<DataState<boolean>> {
    try {
      await this.authService.sendPasswordResetEmail(email);
      return new DataSuccess(true);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async signIn(email: string, password: string): Promise<DataState<SessionEntity>> {
    try {
      const session = await this.authService.signIn(email, password);
      return new DataSuccess(session.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}