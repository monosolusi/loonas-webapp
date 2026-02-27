import { AbstractModel } from "@/core/resources/model";
import { SessionEntity } from "../../domain/entities/session";
import { AccountTypeModel } from "@/features/account/domain/types/account-type";
import { ClerkAccountModel } from "@/features/account/data/models/clerk-account.model";

interface SessionModelConstructor {
  accessToken: string;
  selectedAccount?: AccountTypeModel | ClerkAccountModel;
}

export class SessionModel implements AbstractModel {
  public accessToken: string;
  public selectedAccount?: AccountTypeModel | ClerkAccountModel;

  constructor(args: SessionModelConstructor) {
    this.accessToken = args.accessToken;
    this.selectedAccount = args.selectedAccount;
  }

  public static fromJson(doc: Record<string, any>): SessionModel {
    return new SessionModel({
      accessToken: doc["access_token"],
    });
  }

  toEntity(): SessionEntity {
    return new SessionEntity({
      accessToken: this.accessToken,
      selectedAccount: this.selectedAccount?.toEntity(),
    });
  }
}
