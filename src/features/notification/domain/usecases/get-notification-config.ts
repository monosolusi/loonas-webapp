import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { NotificationConfigEntity } from "@/features/notification/domain/entities/notification-config";
import { NotificationRepository } from "@/features/notification/domain/repositories/notification";

export class GetNotificationConfigUseCase implements UseCase<DataState<NotificationConfigEntity>, void> {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<NotificationConfigEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.notificationRepository.listConfig(session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
