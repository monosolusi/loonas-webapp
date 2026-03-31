import { AbstractModel } from "@/core/resources/model";
import { CoaMappingEntityTypeEntity } from "@/features/accounting/domain/entities/coa-mapping-entity-type";

type CoaMappingEntityTypeModelConstructor = {
  type: string;
  label: string;
  description: string;
};

export class CoaMappingEntityTypeModel implements AbstractModel {
  public readonly type: string;
  public readonly label: string;
  public readonly description: string;

  constructor(args: CoaMappingEntityTypeModelConstructor) {
    this.type = args.type;
    this.label = args.label;
    this.description = args.description;
  }

  public static fromJson(data: Record<string, any>): CoaMappingEntityTypeModel {
    return new CoaMappingEntityTypeModel({
      type: data["type"],
      label: data["label"],
      description: data["description"],
    });
  }

  public toEntity(): CoaMappingEntityTypeEntity {
    return new CoaMappingEntityTypeEntity({
      type: this.type,
      label: this.label,
      description: this.description,
    });
  }
}
