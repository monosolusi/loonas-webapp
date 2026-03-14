import { AbstractEntity } from "@/core/resources/entity";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { VerificationWorkAccountEntity } from "@/features/kyc-review/domain/entities/verification-work-account";
import { VerificationWorkUserEntity } from "@/features/kyc-review/domain/entities/verification-work-user";

interface VerificationWorkSummaryEntityConstructor {
  id: string;
  status: VerificationWorkStatus;
  createdAt: string;
  account: VerificationWorkAccountEntity;
  user: VerificationWorkUserEntity;
  executorEmail?: string | null;
}

export class VerificationWorkSummaryEntity implements AbstractEntity {
  public readonly id: string;
  public readonly status: VerificationWorkStatus;
  public readonly createdAt: string;
  public readonly account: VerificationWorkAccountEntity;
  public readonly user: VerificationWorkUserEntity;
  public readonly executorEmail?: string | null;

  constructor(args: VerificationWorkSummaryEntityConstructor) {
    this.id = args.id;
    this.status = args.status;
    this.createdAt = args.createdAt;
    this.account = args.account;
    this.user = args.user;
    this.executorEmail = args.executorEmail;
  }
}
