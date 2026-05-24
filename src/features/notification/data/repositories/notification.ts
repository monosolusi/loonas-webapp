import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { NotificationRepository } from "@/features/notification/domain/repositories/notification";
import { NotificationConfigEntity } from "@/features/notification/domain/entities/notification-config";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { NotificationService } from "@/features/notification/domain/sources/notification";

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly notificationService: NotificationService) {}

  public async listConfig(session: SessionEntity): Promise<DataState<NotificationConfigEntity>> {
    try {
      const config = await this.notificationService.listConfig(session);
      return new DataSuccess(config.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
