import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { AuthRepository } from "@/app/(authentication)/_domain/_repositories/auth";

export class SubmitNewPasswordUseCaseParams {
  constructor(
    public readonly resetToken: string,
    public readonly password: string
  ) {
  }
}

export class SubmitNewPasswordUseCase implements UseCase<DataState<boolean>, SubmitNewPasswordUseCaseParams> {
  constructor(private readonly authRepository: AuthRepository) {
  }

  async execute(params: SubmitNewPasswordUseCaseParams): Promise<DataState<boolean>> {
    return this.authRepository.submitNewPassword(params.resetToken, params.password);
  }
}