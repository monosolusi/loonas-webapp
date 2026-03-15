import { AbstractEntity } from "@/core/resources/entity";
import { NotificationType } from "@/features/notification/domain/enums/notification-type";

type NotificationEntityConstructor = {
  id: string;
  type: NotificationType;
};

export class NotificationEntity implements AbstractEntity {
  public id: string;
  public type: NotificationType;

  constructor(args: NotificationEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
  }
}
