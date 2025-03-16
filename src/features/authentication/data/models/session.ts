import { AbstractModel } from "@/core/resources/model";
import { SessionEntity } from "../../domain/entities/session";

interface SessionModelConstructor {
  accessToken: string;
}

export class SessionModel implements AbstractModel {
  public accessToken: string;

  constructor(args: SessionModelConstructor) {
    this.accessToken = args.accessToken;
  }

  public static fromJson(doc: Record<string, any>): SessionModel {
    return new SessionModel({
      accessToken: doc["access_token"]
    });
  }

  toEntity(): SessionEntity {
    return new SessionEntity({
      accessToken: this.accessToken
    });
  }
}