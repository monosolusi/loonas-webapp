import { AbstractEntity } from "@/core/resources/entity";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

interface VerificationWorkHistoryEntityConstructor {
  status: VerificationWorkStatus;
  executorEmail?: string | null;
  notes?: string | null;
  createdAt: string;
}

export class VerificationWorkHistoryEntity implements AbstractEntity {
  public readonly status: VerificationWorkStatus;
  public readonly executorEmail?: string | null;
  public readonly notes?: string | null;
  public readonly createdAt: string;

  constructor(args: VerificationWorkHistoryEntityConstructor) {
    this.status = args.status;
    this.executorEmail = args.executorEmail;
    this.notes = args.notes;
    this.createdAt = args.createdAt;
  }
}
