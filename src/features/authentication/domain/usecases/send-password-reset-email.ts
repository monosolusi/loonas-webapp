import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { AuthRepository } from "@/features/authentication/domain/repositories/auth";

export class SendPasswordResetEmailUseCaseParams {
  constructor(public readonly email: string) {
  }
}

export class SendPasswordResetEmailUseCase implements UseCase<DataState<boolean>, SendPasswordResetEmailUseCaseParams> {

  constructor(private readonly authRepository: AuthRepository) {
  }

  public async execute(params: SendPasswordResetEmailUseCaseParams): Promise<DataState<boolean>> {
    return this.authRepository.sendPasswordResetEmail(params.email);
  }

}