import { AbstractEntity } from "@/core/resources/entity";
import { AccountType } from "@/features/account/domain/enums/account-type";

type InviteEntityConstructor = {
  id: string;
  accountId: string;
  accountName: string;
  accountType: AccountType;
  status: string;
  email: string;
  invitedBy: { id: string; email: string };
  createdAt: string;
};

export class InviteEntity implements AbstractEntity {
  public id: string;
  public accountId: string;
  public accountName: string;
  public accountType: AccountType;
  public status: string;
  public email: string;
  public invitedBy: { id: string; email: string };
  public createdAt: string;

  constructor(args: InviteEntityConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.accountName = args.accountName;
    this.accountType = args.accountType;
    this.status = args.status;
    this.email = args.email;
    this.invitedBy = args.invitedBy;
    this.createdAt = args.createdAt;
  }
}
