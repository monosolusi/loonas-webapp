import { AbstractModel } from "@/core/resources/model";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { MemberStatus } from "@/features/member/domain/enums/member-status";

type MemberModelConstructor = {
  id: string;
  email: string;
  status: MemberStatus;
  isOwner: boolean;
  invitedBy: { id: string; email: string } | null;
};

export class MemberModel implements AbstractModel {
  public readonly id: string;
  public readonly email: string;
  public readonly status: MemberStatus;
  public readonly isOwner: boolean;
  public readonly invitedBy: { id: string; email: string } | null;

  constructor(args: MemberModelConstructor) {
    this.id = args.id;
    this.email = args.email;
    this.status = args.status;
    this.isOwner = args.isOwner;
    this.invitedBy = args.invitedBy;
  }

  public static fromJson(data: Record<string, any>): MemberModel {
    return new MemberModel({
      id: data["id"],
      email: data["user"]?.["email"] ?? data["email"],
      status: data["status"] as MemberStatus,
      isOwner: data["invited_by"] === null,
      invitedBy: data["invited_by"]
        ? { id: data["invited_by"]["id"], email: data["invited_by"]["email"] }
        : null,
    });
  }

  public toEntity(): MemberEntity {
    return new MemberEntity({
      id: this.id,
      email: this.email,
      status: this.status,
      isOwner: this.isOwner,
      invitedBy: this.invitedBy,
    });
  }
}
