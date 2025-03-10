import { AbstractEntity } from "@/core/resources/entity";

interface DistrictEntityConstructor {
  id: string;
  label: string;
}

export class DistrictEntity implements AbstractEntity {
  public id: string;
  public label: string;

  constructor(args: DistrictEntityConstructor) {
    this.id = args.id;
    this.label = args.label;
  }
}