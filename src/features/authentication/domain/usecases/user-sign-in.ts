import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "../entities/session";
import { AuthRepository } from "../repositories/auth";

export class UserSignInUseCaseParams {
  constructor(public email: string, public password: string) {
  }
}

export class UserSignInUseCase implements UseCase<DataState<SessionEntity>, UserSignInUseCaseParams> {
  constructor(private authRepository: AuthRepository) {
  }

  public async execute(params: UserSignInUseCaseParams): Promise<DataState<SessionEntity>> {
    return this.authRepository.signIn(params.email, params.password);
  }

}