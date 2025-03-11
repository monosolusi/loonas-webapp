import { DataState } from "@/core/resources/data-state";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";

export abstract class OccupationRepository {
  public abstract list(): Promise<DataState<OccupationEntity[]>>
}