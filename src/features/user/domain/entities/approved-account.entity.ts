import { AbstractEntity } from "@/core/resources/entity";
import { ApprovedAccountEntityConstructor } from "@/features/user/domain/entities/approved-account.entity.types";

export class ApprovedAccountEntity implements AbstractEntity {
  public readonly count: number;

  constructor(args: ApprovedAccountEntityConstructor) {
    this.count = args.count;
    Object.freeze(this);
  }
}
