import { AbstractEntity } from "@/core/resources/entity";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { ClerkAccountEntity } from "@/features/account/domain/entities/clerk-account.entity";

interface SessionEntityConstructor {
  accessToken: string;
  selectedAccount?: AccountTypeEntity | ClerkAccountEntity;
}

export class SessionEntity implements AbstractEntity {
  public accessToken: string;
  public selectedAccount?: AccountTypeEntity | ClerkAccountEntity;

  constructor(args: SessionEntityConstructor) {
    this.accessToken = args.accessToken;
    this.selectedAccount = args.selectedAccount;
  }
}
