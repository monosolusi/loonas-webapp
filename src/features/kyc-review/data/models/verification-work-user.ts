import { AbstractModel } from "@/core/resources/model";
import { VerificationWorkUserEntity } from "@/features/kyc-review/domain/entities/verification-work-user";

interface VerificationWorkUserModelConstructor {
  email: string;
}

export class VerificationWorkUserModel implements AbstractModel {
  public readonly email: string;

  constructor(args: VerificationWorkUserModelConstructor) {
    this.email = args.email;
  }

  public static fromJson(json: Record<string, any>): VerificationWorkUserModel {
    return new VerificationWorkUserModel({
      email: json["email"],
    });
  }

  toEntity(): VerificationWorkUserEntity {
    return new VerificationWorkUserEntity({
      email: this.email,
    });
  }
}
