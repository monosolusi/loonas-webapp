import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";

interface OccupationModelConstructor {
  id: string;
  label?: string;
}

export class OccupationModel {
  public id: string;
  public label: string;

  constructor({ id, label }: OccupationModelConstructor) {
    this.id = id;
    this.label = label || id;
  }

  public static fromJson(json: Record<string, any>): OccupationModel {
    return new OccupationModel({
      id: json.id,
      label: json.label
    });
  }

  toEntity(): OccupationEntity {
    return new OccupationEntity({
      id: this.id,
      label: this.label
    });
  }
}