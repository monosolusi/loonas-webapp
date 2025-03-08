export abstract class DataState<T> {
  public data?: T;
  public error?: Error;

  protected constructor(args: { data?: T; error?: Error }) {
    this.data = args.data;
    this.error = args.error;
  }
}

export class DataSuccess<T> extends DataState<T> {
  constructor(data?: T) {
    super({data});
  }
}

export class DataFailed extends DataState<never> {
  constructor(error: Error) {
    super({error});
  }
}