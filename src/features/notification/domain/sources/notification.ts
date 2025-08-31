import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { NotificationConfigModel } from "@/features/notification/data/models/notification-config";

export interface NotificationService {
  listConfig(session: SessionEntity): Promise<NotificationConfigModel>;
}
