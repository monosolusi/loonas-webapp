import { AbstractModel } from "@/core/resources/model";
import { UserStatusEntity } from "@/features/user/domain/entities/user-status.entity";
import { UserStatusModelConstructor } from "@/features/user/data/models/user-status.model.types";
import { ApprovedAccountModel } from "@/features/user/data/models/approved-account.model";

export class UserStatusModel implements AbstractModel {
  public readonly approvedAccount: ApprovedAccountModel;

  constructor(args: UserStatusModelConstructor) {
    this.approvedAccount = args.approvedAccount;
    Object.freeze(this);
  }

  public static fromJson(data: Record<string, any>): UserStatusModel {
    return new UserStatusModel({
      approvedAccount: ApprovedAccountModel.fromJson(data["approved_account"]),
    });
  }

  toEntity(): UserStatusEntity {
    return new UserStatusEntity({
      approvedAccount: this.approvedAccount.toEntity(),
    });
  }
}
