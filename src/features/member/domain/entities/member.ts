import { AbstractEntity } from "@/core/resources/entity";
import { MemberStatus } from "@/features/member/domain/enums/member-status";

type MemberEntityConstructor = {
  id: string;
  email: string;
  fullName: string | null;
  status: MemberStatus;
  isOwner: boolean;
  invitedBy: { id: string; email: string } | null;
};

export class MemberEntity implements AbstractEntity {
  public id: string;
  public email: string;
  public fullName: string | null;
  public status: MemberStatus;
  public isOwner: boolean;
  public invitedBy: { id: string; email: string } | null;

  constructor(args: MemberEntityConstructor) {
    this.id = args.id;
    this.email = args.email;
    this.fullName = args.fullName;
    this.status = args.status;
    this.isOwner = args.isOwner;
    this.invitedBy = args.invitedBy;
  }

  public get isPending(): boolean {
    return this.status === MemberStatus.PENDING;
  }

  public get isAccepted(): boolean {
    return this.status === MemberStatus.ACCEPTED;
  }
}
