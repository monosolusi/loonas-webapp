import { AbstractEntity } from "@/core/resources/entity";
import { PriceTierEntity } from "@/features/product/domain/entities/price-tier";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";

type PriceTierCopyResultEntityConstructor = {
  tierMode: TierModeType;
  tiers: PriceTierEntity[];
  variantIds: string[];
};

/**
 * Result of copying one schedule onto every live variant of a product.
 *
 * The copy is transactional and all-or-nothing, so `variantIds` lists every variant that
 * was written — it is the only trustworthy source for "how many variants changed".
 */
export class PriceTierCopyResultEntity implements AbstractEntity {
  public readonly tierMode: TierModeType;
  public readonly tiers: PriceTierEntity[];
  public readonly variantIds: string[];

  constructor(args: PriceTierCopyResultEntityConstructor) {
    this.tierMode = args.tierMode;
    this.tiers = args.tiers;
    this.variantIds = args.variantIds;
  }

  public get updatedCount(): number {
    return this.variantIds.length;
  }
}
