import { AbstractEntity } from "@/core/resources/entity";

interface CityEntityConstructor {
  id: string;
  label: string;
}

export class CityEntity implements AbstractEntity {
  public id: string;
  public label: string;

  constructor(args: CityEntityConstructor) {
    this.id = args.id;
    this.label = args.label;
  }
}