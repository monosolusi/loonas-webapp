import { AbstractModel } from "@/core/resources/model";
import { PriceTierModel } from "@/features/product/data/models/price-tier";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierMode, TierModeType } from "@/features/product/domain/enums/tier-mode";

type PriceTierScheduleModelConstructor = {
  tierMode: TierModeType;
  tiers: PriceTierModel[];
};

const TIER_MODE_VALUES = new Set<string>(Object.values(TierMode));

export function parseTierMode(value: unknown): TierModeType | null {
  return typeof value === "string" && TIER_MODE_VALUES.has(value) ? (value as TierModeType) : null;
}

export class PriceTierScheduleModel implements AbstractModel {
  public readonly tierMode: TierModeType;
  public readonly tiers: PriceTierModel[];

  constructor(args: PriceTierScheduleModelConstructor) {
    this.tierMode = args.tierMode;
    this.tiers = args.tiers;
  }

  /** The dedicated price-tiers endpoint payload `{ tier_mode, tiers }`, already unwrapped. */
  public static fromJson(data: Record<string, any>): PriceTierScheduleModel {
    return new PriceTierScheduleModel({
      tierMode: parseTierMode(data["tier_mode"]) ?? TierMode.VOLUME,
      tiers: Array.isArray(data["tiers"]) ? data["tiers"].map(PriceTierModel.fromJson) : [],
    });
  }

  /**
   * A schedule hydrated onto a *variant* object (`tier_mode` + `price_tiers`).
   *
   * Returns `null` when `price_tiers` is absent. That means "this endpoint does not
   * hydrate schedules" — which is NOT the statement "this variant has no tiers". An
   * empty array means hydrated and genuinely flat-priced, and the two must render
   * differently: absent shows nothing at all, empty shows a flat price.
   *
   * `Array.isArray` is the single discriminator: absent -> null, JSON null -> null,
   * [] -> a hydrated empty schedule. NEVER rewrite this as `data["price_tiers"] ?? []`;
   * the `??` default used elsewhere in VariantModel.fromJson collapses absent into
   * empty and silently breaks the distinction on invoice, purchasing, inventory and
   * production reads.
   */
  public static fromVariantJson(data: Record<string, any>): PriceTierScheduleModel | null {
    const raw = data["price_tiers"];
    if (!Array.isArray(raw)) return null;

    return new PriceTierScheduleModel({
      tierMode: parseTierMode(data["tier_mode"]) ?? TierMode.VOLUME,
      tiers: raw.map(PriceTierModel.fromJson),
    });
  }

  public toEntity(): PriceTierScheduleEntity {
    return new PriceTierScheduleEntity({
      tierMode: this.tierMode,
      tiers: this.tiers.map((tier) => tier.toEntity()),
    });
  }
}
