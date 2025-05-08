import { AbstractModel } from "@/core/resources/model";
import { SessionEntity } from "../../domain/entities/session";
import { PersonalAccountModel } from "@/features/account/data/models/personal-account";

interface SessionModelConstructor {
  accessToken: string;
  selectedAccount?: PersonalAccountModel;
}

export class SessionModel implements AbstractModel {
  public accessToken: string;
  public selectedAccount?: PersonalAccountModel;

  constructor(args: SessionModelConstructor) {
    this.accessToken = args.accessToken;
    this.selectedAccount = args.selectedAccount;
  }

  public static fromJson(doc: Record<string, any>): SessionModel {
    return new SessionModel({
      accessToken: doc["access_token"]
    });
  }

  toEntity(): SessionEntity {
    return new SessionEntity({
      accessToken: this.accessToken,
      selectedAccount: this.selectedAccount?.toEntity()
    });
  }
}