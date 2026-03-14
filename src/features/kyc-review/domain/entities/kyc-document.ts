import { AbstractEntity } from "@/core/resources/entity";

interface KycDocumentEntityConstructor {
  type: string;
  url: string;
}

export class KycDocumentEntity implements AbstractEntity {
  public readonly type: string;
  public readonly url: string;

  constructor(args: KycDocumentEntityConstructor) {
    this.type = args.type;
    this.url = args.url;
  }
}
