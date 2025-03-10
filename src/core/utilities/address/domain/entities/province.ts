import { AbstractEntity } from "@/core/resources/entity";

interface ProvinceEntityConstructor {
  id: string;
  label: string;
}

export class ProvinceEntity implements AbstractEntity {
  public id: string;
  public label: string;

  constructor(args: ProvinceEntityConstructor) {
    this.id = args.id;
    this.label = args.label;
  }
}