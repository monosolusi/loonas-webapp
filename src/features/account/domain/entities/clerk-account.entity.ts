import { AbstractEntity } from "@/core/resources/entity";

export class ClerkAccountEntity implements AbstractEntity {
  public readonly id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
    Object.freeze(this);
  }
}
