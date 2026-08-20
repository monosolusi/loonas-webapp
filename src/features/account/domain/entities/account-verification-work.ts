import { DateTime } from "luxon";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

interface AccountVerificationWorkEntityConstructor {
  account: AccountTypeEntity;
  latestStatus: VerificationStatus;
  verificationOutcome: VerificationOutcome;
  estimatedVerificationComplete: DateTime;
}

export class AccountVerificationWorkEntity {
  public readonly account: AccountTypeEntity;
  public readonly latestStatus: VerificationStatus;
  public readonly verificationOutcome: VerificationOutcome;
  public readonly estimatedVerificationComplete: DateTime;

  constructor(args: AccountVerificationWorkEntityConstructor) {
    this.account = args.account;
    this.latestStatus = args.latestStatus;
    this.verificationOutcome = args.verificationOutcome;
    this.estimatedVerificationComplete = args.estimatedVerificationComplete;
  }

  public get isCompleted(): boolean {
    return this.latestStatus === VerificationStatus.COMPLETED;
  }

  public get isAwaitingVerification(): boolean {
    return !this.isCompleted;
  }

  public get isApproved(): boolean {
    return this.isCompleted && this.verificationOutcome === VerificationOutcome.APPROVED;
  }

  public get isRejected(): boolean {
    return this.isCompleted && this.verificationOutcome === VerificationOutcome.REJECTED;
  }
}
