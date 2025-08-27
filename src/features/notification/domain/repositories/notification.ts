import { DataState } from "@/core/resources/data-state";
import { NotificationConfigEntity } from "@/features/notification/domain/entities/notification-config";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface NotificationRepository {
  listConfig(session: SessionEntity): Promise<DataState<NotificationConfigEntity>>;
}
