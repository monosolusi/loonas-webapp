import { DateTime } from "luxon";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { AccountTypeEntity } from "../types/account-type";

interface AccountVerificationWorkEntityConstructor {
  account: AccountTypeEntity;
  latestStatus: VerificationStatus;
  verificationOutcome: VerificationOutcome;
  estimatedVerificationComplete: DateTime;
}

export class AccountVerificationWorkEntity {
  public account: AccountTypeEntity;
  public latestStatus: VerificationStatus;
  public verificationOutcome: VerificationOutcome;
  public estimatedVerificationComplete: DateTime;

  constructor(args: AccountVerificationWorkEntityConstructor) {
    this.account = args.account;
    this.latestStatus = args.latestStatus;
    this.verificationOutcome = args.verificationOutcome;
    this.estimatedVerificationComplete = args.estimatedVerificationComplete;
  }
}
