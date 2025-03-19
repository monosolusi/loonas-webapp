import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { PersonalAccountModel } from "./personal-account";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { AccountVerificationWorkEntity } from "../../domain/entities/account-verification-work";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

interface AccountVerificationWorkModelConstructor {
  account: PersonalAccountModel;
  latestStatus: VerificationStatus;
  verificationOutcome: VerificationOutcome;
  estimatedVerificationComplete: DateTime;
}

export class AccountVerificationWorkModel implements AbstractModel {
  public account: PersonalAccountModel;
  public latestStatus: VerificationStatus;
  public verificationOutcome: VerificationOutcome;
  public estimatedVerificationComplete: DateTime;

  constructor(args: AccountVerificationWorkModelConstructor) {
    this.account = args.account;
    this.latestStatus = args.latestStatus;
    this.verificationOutcome = args.verificationOutcome;
    this.estimatedVerificationComplete = args.estimatedVerificationComplete;
  }

  public static fromJson(json: Record<string, any>): AccountVerificationWorkModel {
    return new AccountVerificationWorkModel({
      account: PersonalAccountModel.fromJson(json["account"]),
      latestStatus: json["latest_status"],
      verificationOutcome: json["verification_outcome"],
      estimatedVerificationComplete: DateTime.fromISO(json["estimated_verification_complete"])
    });
  }

  toEntity(): AccountVerificationWorkEntity {
    return new AccountVerificationWorkEntity({
      account: this.account.toEntity(),
      latestStatus: this.latestStatus,
      verificationOutcome: this.verificationOutcome,
      estimatedVerificationComplete: this.estimatedVerificationComplete
    });
  }
}