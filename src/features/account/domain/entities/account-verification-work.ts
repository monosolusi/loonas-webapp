import { DateTime } from "luxon";
import { PersonalAccountEntity } from "./personal-account";
import { VerificationStatus } from "../../presentation/enums/verification-status";

interface AccountVerificationWorkEntityConstructor {
  account: PersonalAccountEntity;
  latestStatus: VerificationStatus;
  estimatedVerificationComplete: DateTime;
}

export class AccountVerificationWorkEntity {
  public account: PersonalAccountEntity;
  public latestStatus: VerificationStatus;
  public estimatedVerificationComplete: DateTime;

  constructor(args: AccountVerificationWorkEntityConstructor) {
    this.account = args.account;
    this.latestStatus = args.latestStatus;
    this.estimatedVerificationComplete = args.estimatedVerificationComplete;
  }
}