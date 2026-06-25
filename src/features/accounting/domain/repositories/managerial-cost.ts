import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ManagerialCostProjectionEntity } from "@/features/accounting/domain/entities/managerial-cost-projection";
import { ManagerialCostAllocationResultEntity } from "@/features/accounting/domain/entities/managerial-cost-allocation-result";

export type GetManagerialCostParams = {
  periodId: string;
  variantId?: string;
};

export type AllocateManagerialCostParams = {
  periodId: string;
};

export interface ManagerialCostRepository {
  getProjection(
    params: GetManagerialCostParams,
    session: SessionEntity,
  ): Promise<DataState<ManagerialCostProjectionEntity[]>>;
  allocate(
    params: AllocateManagerialCostParams,
    session: SessionEntity,
  ): Promise<DataState<ManagerialCostAllocationResultEntity>>;
}
