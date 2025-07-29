import { AbstractEntity } from "@/core/resources/entity";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

interface SessionEntityConstructor {
  accessToken: string;
  selectedAccount?: AccountTypeEntity;
}

export class SessionEntity implements AbstractEntity {
  public accessToken: string;
  public selectedAccount?: AccountTypeEntity;

  constructor(args: SessionEntityConstructor) {
    this.accessToken = args.accessToken;
    this.selectedAccount = args.selectedAccount;
  }
}
