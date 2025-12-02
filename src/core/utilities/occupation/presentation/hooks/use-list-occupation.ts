import { OccupationRepositoryImpl } from "@/core/utilities/occupation/data/repostiroies/occupation";
import { OccupationServiceImpl } from "@/core/utilities/occupation/data/sources/occupation";
import { ListOccupationUseCase } from "@/core/utilities/occupation/domain/usecases/list-occupation";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { OccupationEntity } from "@/core/utilities/occupation/domain/entities/occupation";
import useSWR from "swr";

async function ListOccupationFetcher(): Promise<OccupationEntity[]> {
  const occupationRepository = new OccupationRepositoryImpl(new OccupationServiceImpl());
  const list = new ListOccupationUseCase(occupationRepository);
  const occupations = await list.execute();
  if (occupations instanceof DataFailed) throw occupations.error;
  if (!occupations.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return occupations.data;
}

export function useListOccupation() {
  const { data, error, isLoading } = useSWR("list-occupation", ListOccupationFetcher);

  return {
    occupations: data,
    error: error,
    loading: isLoading,
  };
}
