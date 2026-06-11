import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { SessionService } from "@/features/authentication/domain/sources/session";

export class SessionRepositoryImpl implements SessionRepository {
  constructor(private sessionService: SessionService) {}

  public async saveSession(accessToken: string): Promise<DataState<SessionEntity>> {
    try {
      const session = await this.sessionService.saveSession(accessToken);
      return new DataSuccess(session.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async retrieve(): Promise<DataState<SessionEntity>> {
    try {
      const session = await this.sessionService.retrieve();
      return new DataSuccess(session.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async signOut(): Promise<DataState<void>> {
    try {
      await this.sessionService.signOut();
      return new DataSuccess();
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
