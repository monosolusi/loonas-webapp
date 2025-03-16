import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { UserRepository } from "@/features/user/domain/repositories/user";

export class UserSignUpUseCaseParams {
  constructor(public email: string, public password: string) {
  }
}

export class UserSignUpUseCase implements UseCase<DataState<void>, UserSignUpUseCaseParams> {
  constructor(private userRepository: UserRepository) {
  }

  public async execute(params: UserSignUpUseCaseParams): Promise<DataState<void>> {
    return this.userRepository.create(params.email, params.password);
  }

}