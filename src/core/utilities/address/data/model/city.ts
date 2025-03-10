import { AbstractModel } from "@/core/resources/model";
import { CityEntity } from "@/core/utilities/address/domain/entities/city";

interface CityModelConstructor {
  id: string;
  label: string;
}

export class CityModel implements AbstractModel {
  public id: string;
  public label: string;

  constructor(args: CityModelConstructor) {
    this.id = args.id;
    this.label = args.label;
  }

  public static fromJson(doc: Record<string, any>) {
    return new CityModel({
      id: doc["id"],
      label: doc["label"]
    });
  }

  toEntity(): CityEntity {
    return new CityEntity({
      id: this.id,
      label: this.label
    });
  }
}