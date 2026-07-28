import { AbstractEntity } from "@/core/resources/entity";
import { PriceTierEntity } from "@/features/product/domain/entities/price-tier";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";

type PriceTierScheduleEntityConstructor = {
  tierMode: TierModeType;
  tiers: PriceTierEntity[];
};

/**
 * A variant's complete grosir schedule.
 *
 * `tierMode` reflects the variant's stored mode whether or not any tiers exist, so an
 * empty `tiers` array means flat-priced — not "unconfigured".
 */
export class PriceTierScheduleEntity implements AbstractEntity {
  public readonly tierMode: TierModeType;
  public readonly tiers: PriceTierEntity[];

  constructor(args: PriceTierScheduleEntityConstructor) {
    this.tierMode = args.tierMode;
    this.tiers = args.tiers;
  }

  public get hasTiers(): boolean {
    return this.tiers.length > 0;
  }

  public get tierCount(): number {
    return this.tiers.length;
  }
}
