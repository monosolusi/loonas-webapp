import { AbstractEntity } from "@/core/resources/entity";
import { MembershipStatus } from "@/features/account/domain/enums/membership-status";

type InvitedBy = {
  id: string;
  email: string;
};

type MembershipEntityConstructor = {
  id: string;
  status: MembershipStatus;
  isOwner: boolean;
  invitedBy: InvitedBy | null;
};

export class MembershipEntity implements AbstractEntity {
  public id: string;
  public status: MembershipStatus;
  public isOwner: boolean;
  public invitedBy: InvitedBy | null;

  constructor(args: MembershipEntityConstructor) {
    this.id = args.id;
    this.status = args.status;
    this.isOwner = args.isOwner;
    this.invitedBy = args.invitedBy;
  }

  public get isPending(): boolean {
    return this.status === MembershipStatus.PENDING;
  }

  public get isAccepted(): boolean {
    return this.status === MembershipStatus.ACCEPTED;
  }
}
