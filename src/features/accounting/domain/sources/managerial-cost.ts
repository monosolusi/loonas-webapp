import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ManagerialCostProjectionModel } from "@/features/accounting/data/models/managerial-cost-projection";
import { ManagerialCostAllocationResultModel } from "@/features/accounting/data/models/managerial-cost-allocation-result";

export type GetManagerialCostServiceParams = {
  periodId: string;
  variantId?: string;
};

export type AllocateManagerialCostServiceParams = {
  periodId: string;
};

export interface ManagerialCostService {
  getProjection(params: GetManagerialCostServiceParams, session: SessionEntity): Promise<ManagerialCostProjectionModel[]>;
  allocate(params: AllocateManagerialCostServiceParams, session: SessionEntity): Promise<ManagerialCostAllocationResultModel>;
}
