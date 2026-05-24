import { AbstractEntity } from "@/core/resources/entity";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";

type Channel = { channel: NotificationChannel; enabled: boolean };

interface NotificationConfigConstructor {
  channels: Channel[];
}

export class NotificationConfigEntity implements AbstractEntity {
  public channels: Channel[];

  constructor(args: NotificationConfigConstructor) {
    this.channels = args.channels;
  }
}
