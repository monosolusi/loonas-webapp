import { AbstractEntity } from "@/core/resources/entity";

type CoaMappingEntityTypeEntityConstructor = {
  type: string;
  label: string;
  description: string;
};

export class CoaMappingEntityTypeEntity implements AbstractEntity {
  public readonly type: string;
  public readonly label: string;
  public readonly description: string;

  constructor(args: CoaMappingEntityTypeEntityConstructor) {
    this.type = args.type;
    this.label = args.label;
    this.description = args.description;
  }
}
