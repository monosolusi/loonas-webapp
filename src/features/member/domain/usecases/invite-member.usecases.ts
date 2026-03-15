import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { MemberEntity } from "@/features/member/domain/entities/member";
import { MemberRepository } from "@/features/member/domain/repositories/member";

export class InviteMemberUseCaseParams {
  public readonly email: string;

  constructor(args: { email: string }) {
    this.email = args.email;
    Object.freeze(this);
  }
}

export class InviteMemberUseCase implements UseCase<DataState<MemberEntity>, InviteMemberUseCaseParams> {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: InviteMemberUseCaseParams): Promise<DataState<MemberEntity>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return this.memberRepository.invite(params.email, session.data);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
