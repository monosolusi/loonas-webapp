import { UseCase } from "@/core/resources/use-case";
import { DataState } from "@/core/resources/data-state";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { OccupationRepository } from "@/core/utilities/occupation/domain/repositories/occupation";

export class ListOccupationUseCase implements UseCase<DataState<OccupationEntity[]>, void> {

  constructor(private readonly occupationRepository: OccupationRepository) {
  }

  public async execute(): Promise<DataState<OccupationEntity[]>> {
    return this.occupationRepository.list();
  }

}