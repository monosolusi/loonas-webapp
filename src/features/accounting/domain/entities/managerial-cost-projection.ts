import { AbstractEntity } from "@/core/resources/entity";

export type ManagerialPeriod = {
  id: string;
  startAt: string;
  endAt: string;
};

type ManagerialCostProjectionEntityConstructor = {
  variantId: string;
  variantName: string | null;
  sku: string | null;
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
  period: ManagerialPeriod;
};

export class ManagerialCostProjectionEntity implements AbstractEntity {
  public readonly variantId: string;
  public readonly variantName: string | null;
  public readonly sku: string | null;
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
  public readonly period: ManagerialPeriod;

  constructor(args: ManagerialCostProjectionEntityConstructor) {
    this.variantId = args.variantId;
    this.variantName = args.variantName;
    this.sku = args.sku;
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
}
