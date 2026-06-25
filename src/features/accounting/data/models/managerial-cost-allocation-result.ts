import { AbstractModel } from "@/core/resources/model";
import { ManagerialCostAllocationResultEntity, VariantCostAllocationEntity } from "@/features/accounting/domain/entities/managerial-cost-allocation-result";
import { ManagerialPeriodModel } from "@/features/accounting/data/models/managerial-cost-projection";

type VariantCostAllocationModelConstructor = {
  id: string;
  variantId: string;
  periodId: string;
  allocationBase: string;
  allocatedFixedPerUnit: number;
  materialCostPerUnit: number;
  loadedCostPerUnit: number;
  productionQuantity: number;
  createdAt: string;
};

export class VariantCostAllocationModel implements AbstractModel {
  public readonly id: string;
  public readonly variantId: string;
  public readonly periodId: string;
  public readonly allocationBase: string;
  public readonly allocatedFixedPerUnit: number;
  public readonly materialCostPerUnit: number;
  public readonly loadedCostPerUnit: number;
  public readonly productionQuantity: number;
  public readonly createdAt: string;

  constructor(args: VariantCostAllocationModelConstructor) {
    this.id = args.id;
    this.variantId = args.variantId;
    this.periodId = args.periodId;
    this.allocationBase = args.allocationBase;
    this.allocatedFixedPerUnit = args.allocatedFixedPerUnit;
    this.materialCostPerUnit = args.materialCostPerUnit;
    this.loadedCostPerUnit = args.loadedCostPerUnit;
    this.productionQuantity = args.productionQuantity;
    this.createdAt = args.createdAt;
  }

  public static fromJson(data: Record<string, any>): VariantCostAllocationModel {
    return new VariantCostAllocationModel({
      id: data["id"],
      variantId: data["variant_id"],
      periodId: data["period_id"],
      // POST allocations[] use "allocation_base" (note: allocation key-map)
      allocationBase: data["allocation_base"] ?? "",
      // POST allocations[] use "allocated_fixed_per_unit" (note: allocation key-map)
      allocatedFixedPerUnit: data["allocated_fixed_per_unit"] ?? 0,
      materialCostPerUnit: data["material_cost_per_unit"] ?? 0,
      loadedCostPerUnit: data["loaded_cost_per_unit"] ?? 0,
      productionQuantity: data["production_quantity"] ?? 0,
      createdAt: data["created_at"] ?? "",
    });
  }

  public toEntity(): VariantCostAllocationEntity {
    return new VariantCostAllocationEntity({
      id: this.id,
      variantId: this.variantId,
      periodId: this.periodId,
      allocationBase: this.allocationBase,
      allocatedFixedPerUnit: this.allocatedFixedPerUnit,
      materialCostPerUnit: this.materialCostPerUnit,
      loadedCostPerUnit: this.loadedCostPerUnit,
      productionQuantity: this.productionQuantity,
      createdAt: this.createdAt,
    });
  }
}

type ManagerialCostAllocationResultModelConstructor = {
  period: ManagerialPeriodModel;
  fixedCostPool: number;
  allocationCount: number;
  allocations: VariantCostAllocationModel[];
};

export class ManagerialCostAllocationResultModel implements AbstractModel {
  public readonly period: ManagerialPeriodModel;
  public readonly fixedCostPool: number;
  public readonly allocationCount: number;
  public readonly allocations: VariantCostAllocationModel[];

  constructor(args: ManagerialCostAllocationResultModelConstructor) {
    this.period = args.period;
    this.fixedCostPool = args.fixedCostPool;
    this.allocationCount = args.allocationCount;
    this.allocations = args.allocations;
  }

  public static fromJson(data: Record<string, any>): ManagerialCostAllocationResultModel {
    return new ManagerialCostAllocationResultModel({
      period: ManagerialPeriodModel.fromJson(data["period"] ?? {}),
      fixedCostPool: data["fixed_cost_pool"] ?? 0,
      allocationCount: data["allocation_count"] ?? 0,
      allocations: Array.isArray(data["allocations"])
        ? data["allocations"].map(VariantCostAllocationModel.fromJson)
        : [],
    });
  }

  public toEntity(): ManagerialCostAllocationResultEntity {
    return new ManagerialCostAllocationResultEntity({
      period: this.period.toValue(),
      fixedCostPool: this.fixedCostPool,
      allocationCount: this.allocationCount,
      allocations: this.allocations.map((a) => a.toEntity()),
    });
  }
}
