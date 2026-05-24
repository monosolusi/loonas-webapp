import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { OccupationRepository } from "@/core/utilities/occupation/domain/repositories/occupation";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import { OccupationService } from "@/core/utilities/occupation/data/sources/occupation";

export class OccupationRepositoryImpl implements OccupationRepository {

  constructor(private readonly occupationService: OccupationService) {
  }

  public async list(): Promise<DataState<OccupationEntity[]>> {
    try {
      const occupations = await this.occupationService.list();
      return new DataSuccess(occupations.map((o) => o.toEntity()));
    } catch (err: any) {
      return new DataFailed(err);
    }
  }

}