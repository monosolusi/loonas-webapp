import { AbstractModel } from "@/core/resources/model";
import { ProvinceEntity } from "@/core/utilities/address/domain/entities/province";

interface ProvinceModelConstructor {
  id: string;
  label: string;
}

export class ProvinceModel implements AbstractModel {
  public id: string;
  public label: string;

  constructor(args: ProvinceModelConstructor) {
    this.id = args.id;
    this.label = args.label;
  }

  public static fromJson(doc: Record<string, any>) {
    return new ProvinceModel({
      id: doc["id"],
      label: doc["label"]
    });
  }

  toEntity(): ProvinceEntity {
    return new ProvinceEntity({
      id: this.id,
      label: this.label
    });
  }
}