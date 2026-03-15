import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { MemberRepository } from "@/features/member/domain/repositories/member";

export class RemoveMemberUseCaseParams {
  public readonly id: string;

  constructor(args: { id: string }) {
    this.id = args.id;
    Object.freeze(this);
  }
}

export class RemoveMemberUseCase implements UseCase<DataState<void>, RemoveMemberUseCaseParams> {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: RemoveMemberUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.memberRepository.remove(params.id, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
