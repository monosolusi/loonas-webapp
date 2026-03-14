import { AbstractModel } from "@/core/resources/model";
import { KycDocumentEntity } from "@/features/kyc-review/domain/entities/kyc-document";

interface KycDocumentModelConstructor {
  type: string;
  url: string;
}

export class KycDocumentModel implements AbstractModel {
  public readonly type: string;
  public readonly url: string;

  constructor(args: KycDocumentModelConstructor) {
    this.type = args.type;
    this.url = args.url;
  }

  public static fromJson(json: Record<string, any>): KycDocumentModel {
    return new KycDocumentModel({
      type: json["type"],
      url: json["url"],
    });
  }

  toEntity(): KycDocumentEntity {
    return new KycDocumentEntity({
      type: this.type,
      url: this.url,
    });
  }
}
