import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { PersonalAccountModel } from "./personal-account";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { AccountTypeModel } from "@/features/account/domain/types/account-type";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BusinessAccountModel } from "@/features/account/data/models/business-account";

interface AccountVerificationWorkModelConstructor {
  account: AccountTypeModel;
  latestStatus: VerificationStatus;
  verificationOutcome: VerificationOutcome;
  estimatedVerificationComplete: DateTime;
}

export class AccountVerificationWorkModel implements AbstractModel {
  public account: AccountTypeModel;
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
    let account: AccountTypeModel;
    if (json["account"]["type"] === AccountType.PERSONAL) account = PersonalAccountModel.fromJson(json["account"]);
    else if (json["account"]["type"] === AccountType.BUSINESS) account = BusinessAccountModel.fromJson(json["account"]);
    else throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);

    return new AccountVerificationWorkModel({
      account: account,
      latestStatus: json["latest_status"],
      verificationOutcome: json["verification_outcome"],
      estimatedVerificationComplete: DateTime.fromISO(json["estimated_verification_complete"]),
    });
  }

  toEntity(): AccountVerificationWorkEntity {
    return new AccountVerificationWorkEntity({
      account: this.account.toEntity(),
      latestStatus: this.latestStatus,
      verificationOutcome: this.verificationOutcome,
      estimatedVerificationComplete: this.estimatedVerificationComplete,
    });
  }
}
