import { PersonalAccountModel } from "@/app/(account)/_data/_models/personal-account";
import { VerificationStatus } from "@/app/(account)/_presentation/_enums/verification-status";
import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { AccountVerificationWorkEntity } from "@/app/(account)/_domain/_entities/account-verification-work";

interface AccountVerificationWorkModelConstructor {
  account: PersonalAccountModel;
  latestStatus: VerificationStatus;
  estimatedVerificationComplete: DateTime;
}

export class AccountVerificationWorkModel implements AbstractModel {
  public account: PersonalAccountModel;
  public latestStatus: VerificationStatus;
  public estimatedVerificationComplete: DateTime;

  constructor(args: AccountVerificationWorkModelConstructor) {
    this.account = args.account;
    this.latestStatus = args.latestStatus;
    this.estimatedVerificationComplete = args.estimatedVerificationComplete;
  }

  public static fromJson(json: Record<string, any>): AccountVerificationWorkModel {
    return new AccountVerificationWorkModel({
      account: PersonalAccountModel.fromJson(json["account"]),
      latestStatus: json["latest_status"],
      estimatedVerificationComplete: DateTime.fromISO(json["estimated_verification_complete"])
    });
  }

  toEntity(): AccountVerificationWorkEntity {
    return new AccountVerificationWorkEntity({
      account: this.account.toEntity(),
      latestStatus: this.latestStatus,
      estimatedVerificationComplete: this.estimatedVerificationComplete
    });
  }
}