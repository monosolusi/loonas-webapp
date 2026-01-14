import { AbstractModel } from "@/core/resources/model";
import { ApprovedAccountEntity } from "@/features/user/domain/entities/approved-account.entity";
import { ApprovedAccountModelConstructor } from "@/features/user/data/models/approved-account.model.types";

export class ApprovedAccountModel implements AbstractModel {
  public readonly count: number;

  constructor(args: ApprovedAccountModelConstructor) {
    this.count = args.count;
    Object.freeze(this);
  }

  public static fromJson(data: Record<string, any>): ApprovedAccountModel {
    return new ApprovedAccountModel({
      count: Number(data["count"]),
    });
  }

  toEntity(): ApprovedAccountEntity {
    return new ApprovedAccountEntity({
      count: this.count,
    });
  }
}
