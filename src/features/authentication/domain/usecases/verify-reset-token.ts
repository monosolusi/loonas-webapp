import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { AuthRepository } from "@/features/authentication/domain/repositories/auth";

export class VerifyResetTokenUseCaseParams {
  constructor(public readonly token: string) {}
}

export class VerifyResetTokenUseCase implements UseCase<DataState<boolean>, VerifyResetTokenUseCaseParams> {
  constructor(private readonly authRepository: AuthRepository) {}

  public async execute(params: VerifyResetTokenUseCaseParams): Promise<DataState<boolean>> {
    return this.authRepository.verifyResetToken(params.token);
  }
}
