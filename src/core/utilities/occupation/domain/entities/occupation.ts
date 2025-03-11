interface OccupationEntityConstructor {
  id: string;
  label: string;
}

export class OccupationEntity {
  public id: string;
  public label: string;

  constructor(args: OccupationEntityConstructor) {
    this.id = args.id;
    this.label = args.label;
  }
}