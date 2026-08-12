import { AbstractModel } from "@/core/resources/model";
import { PriceTierModel } from "@/features/product/data/models/price-tier";
import { parseTierMode } from "@/features/product/data/models/price-tier-schedule";
import { PriceTierCopyResultEntity } from "@/features/product/domain/entities/price-tier-copy-result";
import { TierMode, TierModeType } from "@/features/product/domain/enums/tier-mode";

type PriceTierCopyResultModelConstructor = {
  tierMode: TierModeType;
  tiers: PriceTierModel[];
  variantIds: string[];
};

export class PriceTierCopyResultModel implements AbstractModel {
  public readonly tierMode: TierModeType;
  public readonly tiers: PriceTierModel[];
  public readonly variantIds: string[];

  constructor(args: PriceTierCopyResultModelConstructor) {
    this.tierMode = args.tierMode;
    this.tiers = args.tiers;
    this.variantIds = args.variantIds;
  }

  public static fromJson(data: Record<string, any>): PriceTierCopyResultModel {
    return new PriceTierCopyResultModel({
      tierMode: parseTierMode(data["tier_mode"]) ?? TierMode.VOLUME,
      tiers: Array.isArray(data["tiers"]) ? data["tiers"].map(PriceTierModel.fromJson) : [],
      variantIds: Array.isArray(data["variant_ids"])
        ? data["variant_ids"].filter((id: unknown): id is string => typeof id === "string")
        : [],
    });
  }

  public toEntity(): PriceTierCopyResultEntity {
    return new PriceTierCopyResultEntity({
      tierMode: this.tierMode,
      tiers: this.tiers.map((tier) => tier.toEntity()),
      variantIds: this.variantIds,
    });
  }
}
