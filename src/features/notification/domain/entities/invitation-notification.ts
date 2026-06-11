import { NotificationEntity } from "@/features/notification/domain/entities/notification";
import { NotificationType } from "@/features/notification/domain/enums/notification-type";
import { AccountType } from "@/features/account/domain/enums/account-type";

type InvitationNotificationEntityConstructor = {
  id: string;
  accountId: string;
  accountName: string;
  accountType: AccountType;
  invitedByEmail: string;
  membershipId: string;
};

export class InvitationNotificationEntity extends NotificationEntity {
  public accountId: string;
  public accountName: string;
  public accountType: AccountType;
  public invitedByEmail: string;
  public membershipId: string;

  constructor(args: InvitationNotificationEntityConstructor) {
    super({ id: args.id, type: NotificationType.INVITATION });
    this.accountId = args.accountId;
    this.accountName = args.accountName;
    this.accountType = args.accountType;
    this.invitedByEmail = args.invitedByEmail;
    this.membershipId = args.membershipId;
  }
}
