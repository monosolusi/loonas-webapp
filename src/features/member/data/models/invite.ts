import { AbstractModel } from "@/core/resources/model";
import { InviteEntity } from "@/features/member/domain/entities/invite";
import { AccountType } from "@/features/account/domain/enums/account-type";

type InviteModelConstructor = {
  id: string;
  accountId: string;
  accountName: string;
  accountType: AccountType;
  status: string;
  email: string;
  invitedBy: { id: string; email: string };
  createdAt: string;
};

export class InviteModel implements AbstractModel {
  public readonly id: string;
  public readonly accountId: string;
  public readonly accountName: string;
  public readonly accountType: AccountType;
  public readonly status: string;
  public readonly email: string;
  public readonly invitedBy: { id: string; email: string };
  public readonly createdAt: string;

  constructor(args: InviteModelConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.accountName = args.accountName;
    this.accountType = args.accountType;
    this.status = args.status;
    this.email = args.email;
    this.invitedBy = args.invitedBy;
    this.createdAt = args.createdAt;
  }

  public static fromJson(data: Record<string, any>): InviteModel {
    return new InviteModel({
      id: data["id"],
      accountId: data["account"]?.["id"] ?? "",
      accountName: data["account"]?.["full_name"] ?? "",
      accountType: (data["account_type"]?.toUpperCase() ?? "PERSONAL") as AccountType,
      status: data["status"],
      email: data["user"]?.["email"] ?? "",
      invitedBy: {
        id: data["invited_by"]?.["id"] ?? "",
        email: data["invited_by"]?.["email"] ?? "",
      },
      createdAt: data["created_at"] ?? "",
    });
  }

  public toEntity(): InviteEntity {
    return new InviteEntity({
      id: this.id,
      accountId: this.accountId,
      accountName: this.accountName,
      accountType: this.accountType,
      status: this.status,
      email: this.email,
      invitedBy: this.invitedBy,
      createdAt: this.createdAt,
    });
  }
}
