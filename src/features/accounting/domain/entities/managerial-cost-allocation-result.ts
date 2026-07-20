import { AbstractEntity } from "@/core/resources/entity";
import { ManagerialPeriod } from "@/features/accounting/domain/entities/managerial-cost-projection";

type VariantCostAllocationEntityConstructor = {
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

export class VariantCostAllocationEntity implements AbstractEntity {
  public readonly id: string;
  public readonly variantId: string;
  public readonly periodId: string;
  public readonly allocationBase: string;
  public readonly allocatedFixedPerUnit: number;
  public readonly materialCostPerUnit: number;
  public readonly loadedCostPerUnit: number;
  public readonly productionQuantity: number;
  public readonly createdAt: string;

  constructor(args: VariantCostAllocationEntityConstructor) {
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
}

type ManagerialCostAllocationResultEntityConstructor = {
  period: ManagerialPeriod;
  fixedCostPool: number;
  allocationCount: number;
  allocations: VariantCostAllocationEntity[];
};

export class ManagerialCostAllocationResultEntity implements AbstractEntity {
  public readonly period: ManagerialPeriod;
  public readonly fixedCostPool: number;
  public readonly allocationCount: number;
  public readonly allocations: VariantCostAllocationEntity[];

  constructor(args: ManagerialCostAllocationResultEntityConstructor) {
    this.period = args.period;
    this.fixedCostPool = args.fixedCostPool;
    this.allocationCount = args.allocationCount;
    this.allocations = args.allocations;
  }
}
