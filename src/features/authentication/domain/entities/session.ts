import { AbstractEntity } from "@/core/resources/entity";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";

interface SessionEntityConstructor {
  accessToken: string;
  selectedAccount?: PersonalAccountEntity;
}

export class SessionEntity implements AbstractEntity {
  public accessToken: string;
  public selectedAccount?: PersonalAccountEntity;

  constructor(args: SessionEntityConstructor) {
    this.accessToken = args.accessToken;
    this.selectedAccount = args.selectedAccount;
  }
}