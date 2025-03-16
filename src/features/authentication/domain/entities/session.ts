import { AbstractEntity } from "@/core/resources/entity";

interface SessionEntityConstructor {
  accessToken: string;
}

export class SessionEntity implements AbstractEntity {
  public accessToken: string;

  constructor(args: SessionEntityConstructor) {
    this.accessToken = args.accessToken;
  }
}