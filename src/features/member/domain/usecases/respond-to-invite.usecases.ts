import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { MemberRepository } from "@/features/member/domain/repositories/member";
import { InviteAction } from "@/features/member/domain/enums/invite-action";

export class RespondToInviteUseCaseParams {
  public readonly id: string;
  public readonly action: InviteAction;

  constructor(args: { id: string; action: InviteAction }) {
    this.id = args.id;
    this.action = args.action;
    Object.freeze(this);
  }
}

export class RespondToInviteUseCase implements UseCase<DataState<void>, RespondToInviteUseCaseParams> {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: RespondToInviteUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.memberRepository.respond(params.id, params.action, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
