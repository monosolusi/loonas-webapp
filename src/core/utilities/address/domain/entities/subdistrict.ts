import { AbstractEntity } from "@/core/resources/entity";

interface SubdistrictEntityConstructor {
  id: string;
  label: string;
}

export class SubdistrictEntity implements AbstractEntity {
  public id: string;
  public label: string;

  constructor(args: SubdistrictEntityConstructor) {
    this.id = args.id;
    this.label = args.label;
  }
}