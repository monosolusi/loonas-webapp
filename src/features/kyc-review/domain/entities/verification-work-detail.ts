import { AbstractEntity } from "@/core/resources/entity";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { VerificationWorkAccountEntity } from "@/features/kyc-review/domain/entities/verification-work-account";
import { KycDocumentEntity } from "@/features/kyc-review/domain/entities/kyc-document";
import { VerificationWorkHistoryEntity } from "@/features/kyc-review/domain/entities/verification-work-history";
import { VerificationWorkUserEntity } from "@/features/kyc-review/domain/entities/verification-work-user";

interface VerificationWorkDetailEntityConstructor {
  id: string;
  status: VerificationWorkStatus;
  createdAt: string;
  account: VerificationWorkAccountEntity;
  user: VerificationWorkUserEntity;
  documents: KycDocumentEntity[];
  executorEmail?: string | null;
  notes?: string | null;
  history: VerificationWorkHistoryEntity[];
}

export class VerificationWorkDetailEntity implements AbstractEntity {
  public readonly id: string;
  public readonly status: VerificationWorkStatus;
  public readonly createdAt: string;
  public readonly account: VerificationWorkAccountEntity;
  public readonly user: VerificationWorkUserEntity;
  public readonly documents: KycDocumentEntity[];
  public readonly executorEmail?: string | null;
  public readonly notes?: string | null;
  public readonly history: VerificationWorkHistoryEntity[];

  constructor(args: VerificationWorkDetailEntityConstructor) {
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
}
