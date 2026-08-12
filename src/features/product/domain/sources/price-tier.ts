import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PriceTierScheduleModel } from "@/features/product/data/models/price-tier-schedule";
import { PriceTierCopyResultModel } from "@/features/product/data/models/price-tier-copy-result";
import {
  GetPriceTiersParams,
  SavePriceTiersParams,
  CopyPriceTiersParams,
} from "@/features/product/domain/repositories/price-tier";

export interface PriceTierService {
  get(params: GetPriceTiersParams, session: SessionEntity): Promise<PriceTierScheduleModel>;
  save(params: SavePriceTiersParams, session: SessionEntity): Promise<PriceTierScheduleModel>;
  copyToVariants(params: CopyPriceTiersParams, session: SessionEntity): Promise<PriceTierCopyResultModel>;
}
