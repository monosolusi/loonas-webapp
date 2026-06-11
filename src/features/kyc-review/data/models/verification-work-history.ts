import { AbstractModel } from "@/core/resources/model";
import { VerificationWorkHistoryEntity } from "@/features/kyc-review/domain/entities/verification-work-history";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

interface VerificationWorkHistoryModelConstructor {
  status: VerificationWorkStatus;
  executorEmail?: string | null;
  notes?: string | null;
  createdAt: string;
}

export class VerificationWorkHistoryModel implements AbstractModel {
  public readonly status: VerificationWorkStatus;
  public readonly executorEmail?: string | null;
  public readonly notes?: string | null;
  public readonly createdAt: string;

  constructor(args: VerificationWorkHistoryModelConstructor) {
    this.status = args.status;
    this.executorEmail = args.executorEmail;
    this.notes = args.notes;
    this.createdAt = args.createdAt;
  }

  public static fromJson(json: Record<string, any>): VerificationWorkHistoryModel {
    return new VerificationWorkHistoryModel({
      status: json["status"],
      executorEmail: json["executor_email"] ?? null,
      notes: json["notes"] ?? null,
      createdAt: json["created_at"],
    });
  }

  toEntity(): VerificationWorkHistoryEntity {
    return new VerificationWorkHistoryEntity({
      status: this.status,
      executorEmail: this.executorEmail,
      notes: this.notes,
      createdAt: this.createdAt,
    });
  }
}
