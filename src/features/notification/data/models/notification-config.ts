import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { AbstractModel } from "@/core/resources/model";
import { NotificationConfigEntity } from "@/features/notification/domain/entities/notification-config";

type Channel = { channel: NotificationChannel; enabled: boolean };

interface NotificationConfigModelConstructor {
  channels: Channel[];
}

export class NotificationConfigModel implements AbstractModel {
  public channels: Channel[];

  constructor(args: NotificationConfigModelConstructor) {
    this.channels = args.channels;
  }

  public static fromJson(json: Record<string, any>): NotificationConfigModel {
    return new NotificationConfigModel({
      channels: json["channels"].map((channel: Record<string, any>) => ({
        channel: channel["channel"],
        enabled: channel["enabled"],
      })),
    });
  }

  toEntity(): NotificationConfigEntity {
    return new NotificationConfigEntity({
      channels: this.channels,
    });
  }
}
