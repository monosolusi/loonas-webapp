import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { PriceTierCopyResultEntity } from "@/features/product/domain/entities/price-tier-copy-result";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";

export type PriceTierInput = {
  minQty: number;
  unitPrice: number;
};

export type GetPriceTiersParams = {
  productId: string;
  variantId: string;
};

export type SavePriceTiersParams = {
  productId: string;
  variantId: string;
  tierMode: TierModeType;
  /** Full replace, not a merge. An empty array is the valid "clear the schedule" path. */
  tiers: PriceTierInput[];
};

export type CopyPriceTiersParams = {
  productId: string;
  tierMode: TierModeType;
  tiers: PriceTierInput[];
};

export interface PriceTierRepository {
  get(params: GetPriceTiersParams, session: SessionEntity): Promise<DataState<PriceTierScheduleEntity>>;
  save(params: SavePriceTiersParams, session: SessionEntity): Promise<DataState<PriceTierScheduleEntity>>;
  copyToVariants(params: CopyPriceTiersParams, session: SessionEntity): Promise<DataState<PriceTierCopyResultEntity>>;
}
