import { AbstractModel } from "@/core/resources/model";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { VerificationWorkSummaryEntity } from "@/features/kyc-review/domain/entities/verification-work-summary";
import { VerificationWorkAccountModel } from "@/features/kyc-review/data/models/verification-work-account";
import { VerificationWorkUserModel } from "@/features/kyc-review/data/models/verification-work-user";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

interface VerificationWorkSummaryModelConstructor {
  id: string;
  status: VerificationWorkStatus;
  createdAt: string;
  account: VerificationWorkAccountModel;
  user: VerificationWorkUserModel;
  executorEmail?: string | null;
}

export class VerificationWorkSummaryModel implements AbstractModel {
  public readonly id: string;
  public readonly status: VerificationWorkStatus;
  public readonly createdAt: string;
  public readonly account: VerificationWorkAccountModel;
  public readonly user: VerificationWorkUserModel;
  public readonly executorEmail?: string | null;

  constructor(args: VerificationWorkSummaryModelConstructor) {
    this.id = args.id;
    this.status = args.status;
    this.createdAt = args.createdAt;
    this.account = args.account;
    this.user = args.user;
    this.executorEmail = args.executorEmail;
  }

  public static fromJson(json: Record<string, any>): VerificationWorkSummaryModel {
    if (!json["account"]) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    return new VerificationWorkSummaryModel({
      id: json["id"],
      status: json["status"],
      createdAt: json["created_at"],
      account: VerificationWorkAccountModel.fromJson(json["account"]),
      user: VerificationWorkUserModel.fromJson(json["user"]),
      executorEmail: json["executor_email"] ?? null,
    });
  }

  toEntity(): VerificationWorkSummaryEntity {
    return new VerificationWorkSummaryEntity({
      id: this.id,
      status: this.status,
      createdAt: this.createdAt,
      account: this.account.toEntity(),
      user: this.user.toEntity(),
      executorEmail: this.executorEmail,
    });
  }
}
