import { AbstractEntity } from "@/core/resources/entity";

interface VerificationWorkUserEntityConstructor {
  email: string;
}

export class VerificationWorkUserEntity implements AbstractEntity {
  public readonly email: string;

  constructor(args: VerificationWorkUserEntityConstructor) {
    this.email = args.email;
  }
}
