import { AbstractModel } from "@/core/resources/model";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { VerificationWorkDetailEntity } from "@/features/kyc-review/domain/entities/verification-work-detail";
import { VerificationWorkAccountModel } from "@/features/kyc-review/data/models/verification-work-account";
import { KycDocumentModel } from "@/features/kyc-review/data/models/kyc-document";
import { VerificationWorkHistoryModel } from "@/features/kyc-review/data/models/verification-work-history";
import { VerificationWorkUserModel } from "@/features/kyc-review/data/models/verification-work-user";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

interface VerificationWorkDetailModelConstructor {
  id: string;
  status: VerificationWorkStatus;
  createdAt: string;
  account: VerificationWorkAccountModel;
  user: VerificationWorkUserModel;
  documents: KycDocumentModel[];
  executorEmail?: string | null;
  notes?: string | null;
  history: VerificationWorkHistoryModel[];
}

export class VerificationWorkDetailModel implements AbstractModel {
  public readonly id: string;
  public readonly status: VerificationWorkStatus;
  public readonly createdAt: string;
  public readonly account: VerificationWorkAccountModel;
  public readonly user: VerificationWorkUserModel;
  public readonly documents: KycDocumentModel[];
  public readonly executorEmail?: string | null;
  public readonly notes?: string | null;
  public readonly history: VerificationWorkHistoryModel[];

  constructor(args: VerificationWorkDetailModelConstructor) {
    this.id = args.id;
    this.status = args.status;
    this.createdAt = args.createdAt;
    this.account = args.account;
    this.user = args.user;
    this.documents = args.documents;
    this.executorEmail = args.executorEmail;
    this.notes = args.notes;
    this.history = args.history;
  }

  public static fromJson(json: Record<string, any>): VerificationWorkDetailModel {
    if (!json["account"]) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    return new VerificationWorkDetailModel({
      id: json["id"],
      status: json["status"],
      createdAt: json["created_at"],
      account: VerificationWorkAccountModel.fromJson(json["account"]),
      user: VerificationWorkUserModel.fromJson(json["user"]),
      documents: (json["account"]["documents"] ?? []).map(KycDocumentModel.fromJson),
      executorEmail: json["executor_email"] ?? null,
      notes: json["notes"] ?? null,
      history: (json["history"] ?? []).map(VerificationWorkHistoryModel.fromJson),
    });
  }

  toEntity(): VerificationWorkDetailEntity {
    return new VerificationWorkDetailEntity({
      id: this.id,
      status: this.status,
      createdAt: this.createdAt,
      account: this.account.toEntity(),
      user: this.user.toEntity(),
      documents: this.documents.map((doc) => doc.toEntity()),
      executorEmail: this.executorEmail,
      notes: this.notes,
      history: this.history.map((h) => h.toEntity()),
    });
  }
}
