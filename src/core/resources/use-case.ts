export abstract class UseCase<ReturnValue, Params = void> {
  abstract execute(...args: Params extends void ? [] : [params: Params]): Promise<ReturnValue>;
}