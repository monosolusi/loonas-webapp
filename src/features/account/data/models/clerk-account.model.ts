import { AbstractModel } from "@/core/resources/model";
import { ClerkAccountEntity } from "@/features/account/domain/entities/clerk-account.entity";

export class ClerkAccountModel implements AbstractModel {
  public readonly id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
    Object.freeze(this);
  }

  toEntity() {
    return new ClerkAccountEntity({ id: this.id });
  }
}
