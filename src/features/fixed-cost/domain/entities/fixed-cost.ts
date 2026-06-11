import { AbstractEntity } from "@/core/resources/entity";

type FixedCostEntityConstructor = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export class FixedCostEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(args: FixedCostEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
