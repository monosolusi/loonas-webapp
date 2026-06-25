import { AbstractModel } from "@/core/resources/model";
import { ManagerialCostProjectionEntity, ManagerialPeriod } from "@/features/accounting/domain/entities/managerial-cost-projection";

type ManagerialPeriodModelConstructor = {
  id: string;
  startAt: string;
  endAt: string;
};

export class ManagerialPeriodModel implements AbstractModel {
  public readonly id: string;
  public readonly startAt: string;
  public readonly endAt: string;

  constructor(args: ManagerialPeriodModelConstructor) {
    this.id = args.id;
    this.startAt = args.startAt;
    this.endAt = args.endAt;
  }

  public static fromJson(data: Record<string, any>): ManagerialPeriodModel {
    return new ManagerialPeriodModel({
      id: data["id"],
      startAt: data["start_at"] ?? "",
      endAt: data["end_at"] ?? "",
    });
  }

  public toValue(): ManagerialPeriod {
    return {
      id: this.id,
      startAt: this.startAt,
      endAt: this.endAt,
    };
  }
}

type ManagerialCostProjectionModelConstructor = {
  variantId: string;
  label: string;
  costBasis: string;
  capacityBasis: string;
  allocationBasis: string;
  materialCostPerUnit: number;
  allocatedProductionFixedPerUnit: number;
  loadedCostPerUnit: number;
  productionQuantity: number;
  disclaimer: string;
  capacityNote: string;
  period: ManagerialPeriodModel;
};

export class ManagerialCostProjectionModel implements AbstractModel {
  public readonly variantId: string;
  public readonly label: string;
  public readonly costBasis: string;
  public readonly capacityBasis: string;
  public readonly allocationBasis: string;
  public readonly materialCostPerUnit: number;
  public readonly allocatedProductionFixedPerUnit: number;
  public readonly loadedCostPerUnit: number;
  public readonly productionQuantity: number;
  public readonly disclaimer: string;
  public readonly capacityNote: string;
  public readonly period: ManagerialPeriodModel;

  constructor(args: ManagerialCostProjectionModelConstructor) {
    this.variantId = args.variantId;
    this.label = args.label;
    this.costBasis = args.costBasis;
    this.capacityBasis = args.capacityBasis;
    this.allocationBasis = args.allocationBasis;
    this.materialCostPerUnit = args.materialCostPerUnit;
    this.allocatedProductionFixedPerUnit = args.allocatedProductionFixedPerUnit;
    this.loadedCostPerUnit = args.loadedCostPerUnit;
    this.productionQuantity = args.productionQuantity;
    this.disclaimer = args.disclaimer;
    this.capacityNote = args.capacityNote;
    this.period = args.period;
  }

  public static fromJson(data: Record<string, any>): ManagerialCostProjectionModel {
    return new ManagerialCostProjectionModel({
      variantId: data["variant_id"],
      label: data["label"] ?? "",
      costBasis: data["cost_basis"] ?? "",
      capacityBasis: data["capacity_basis"] ?? "",
      // GET endpoint uses "allocation_basis" (note: projection key-map)
      allocationBasis: data["allocation_basis"] ?? "",
      materialCostPerUnit: data["material_cost_per_unit"] ?? 0,
      // GET endpoint uses "allocated_production_fixed_per_unit" (note: projection key-map)
      allocatedProductionFixedPerUnit: data["allocated_production_fixed_per_unit"] ?? 0,
      loadedCostPerUnit: data["loaded_cost_per_unit"] ?? 0,
      productionQuantity: data["production_quantity"] ?? 0,
      disclaimer: data["disclaimer"] ?? "",
      capacityNote: data["capacity_note"] ?? "",
      period: ManagerialPeriodModel.fromJson(data["period"] ?? {}),
    });
  }

  public toEntity(): ManagerialCostProjectionEntity {
    return new ManagerialCostProjectionEntity({
      variantId: this.variantId,
      label: this.label,
      costBasis: this.costBasis,
      capacityBasis: this.capacityBasis,
      allocationBasis: this.allocationBasis,
      materialCostPerUnit: this.materialCostPerUnit,
      allocatedProductionFixedPerUnit: this.allocatedProductionFixedPerUnit,
      loadedCostPerUnit: this.loadedCostPerUnit,
      productionQuantity: this.productionQuantity,
      disclaimer: this.disclaimer,
      capacityNote: this.capacityNote,
      period: this.period.toValue(),
    });
  }
}
