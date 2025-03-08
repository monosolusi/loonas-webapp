export abstract class UseCase<ReturnValue, Params> {
  abstract execute(params: Params): Promise<ReturnValue>;
}