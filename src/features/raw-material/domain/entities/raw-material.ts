import { AbstractEntity } from "@/core/resources/entity";

type RawMaterialEntityConstructor = {
  id: string;
  name: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
};

export class RawMaterialEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public unit: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: RawMaterialEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.unit = args.unit;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
