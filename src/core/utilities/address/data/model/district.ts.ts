import { AbstractModel } from "@/core/resources/model";
import { DistrictEntity } from "@/core/utilities/address/domain/entities/district";

interface DistrictModelConstructor {
  id: string;
  label: string;
}

export class DistrictModel implements AbstractModel {
  public id: string;
  public label: string;

  constructor(args: DistrictModelConstructor) {
    this.id = args.id;
    this.label = args.label;
  }

  public static fromJson(doc: Record<string, any>) {
    return new DistrictModel({
      id: doc["id"],
      label: doc["label"]
    });
  }

  toEntity(): DistrictEntity {
    return new DistrictEntity({
      id: this.id,
      label: this.label
    });
  }
}