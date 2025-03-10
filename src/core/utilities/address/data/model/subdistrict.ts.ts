import { AbstractModel } from "@/core/resources/model";
import { SubdistrictEntity } from "@/core/utilities/address/domain/entities/subdistrict";

interface SubdistrictModelConstructor {
  id: string;
  label: string;
}

export class SubdistrictModel implements AbstractModel {
  public id: string;
  public label: string;

  constructor(args: SubdistrictModelConstructor) {
    this.id = args.id;
    this.label = args.label;
  }

  public static fromJson(doc: Record<string, any>) {
    return new SubdistrictModel({
      id: doc["id"],
      label: doc["label"]
    });
  }

  toEntity(): SubdistrictEntity {
    return new SubdistrictEntity({
      id: this.id,
      label: this.label
    });
  }
}