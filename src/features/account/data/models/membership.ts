import { AbstractModel } from "@/core/resources/model";
import { MembershipEntity } from "@/features/account/domain/entities/membership";
import { MembershipStatus } from "@/features/account/domain/enums/membership-status";

type MembershipModelConstructor = {
  id: string;
  status: MembershipStatus;
  isOwner: boolean;
  invitedBy: { id: string; email: string } | null;
};

export class MembershipModel implements AbstractModel {
  public readonly id: string;
  public readonly status: MembershipStatus;
  public readonly isOwner: boolean;
  public readonly invitedBy: { id: string; email: string } | null;

  constructor(args: MembershipModelConstructor) {
    this.id = args.id;
    this.status = args.status;
    this.isOwner = args.isOwner;
    this.invitedBy = args.invitedBy;
  }

  public static fromJson(data: Record<string, any>): MembershipModel {
    return new MembershipModel({
      id: data["id"],
      status: data["status"] as MembershipStatus,
      isOwner: data["is_owner"],
      invitedBy: data["invited_by"]
        ? { id: data["invited_by"]["id"], email: data["invited_by"]["email"] }
        : null,
    });
  }

  public toEntity(): MembershipEntity {
    return new MembershipEntity({
      id: this.id,
      status: this.status,
      isOwner: this.isOwner,
      invitedBy: this.invitedBy,
    });
  }
}
