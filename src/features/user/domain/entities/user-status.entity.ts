import { AbstractEntity } from "@/core/resources/entity";
import { UserStatusEntityConstructor } from "@/features/user/domain/entities/user-status.entity.types";
import { ApprovedAccountEntity } from "@/features/user/domain/entities/approved-account.entity";

export class UserStatusEntity implements AbstractEntity {
  public readonly approvedAccount: ApprovedAccountEntity;

  constructor(args: UserStatusEntityConstructor) {
    this.approvedAccount = args.approvedAccount;
    Object.freeze(this);
  }
}
