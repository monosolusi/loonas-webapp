// Canonical example: entity with array of child entities and a derived getter.
// Source: src/features/production/domain/entities/production-record.ts

import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { ProductionRecordItemEntity } from "@/features/production/domain/entities/production-record-item";

type ProductionRecordEntityConstructor = {
  id: string;
  quantity: number;
  unitMaterialCost: number;
  totalMaterialCost: number;
  producedAt: DateTime;
  note: string | null;
  variant: VariantEntity;
  items: ProductionRecordItemEntity[];
  createdAt: DateTime;
  updatedAt: DateTime;
};

export class ProductionRecordEntity implements AbstractEntity {
  public readonly id: string;
  public readonly quantity: number;
  public readonly unitMaterialCost: number;
  public readonly totalMaterialCost: number;
  public readonly producedAt: DateTime;
  public readonly note: string | null;
  public readonly variant: VariantEntity;
  public readonly items: ProductionRecordItemEntity[];
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;

  constructor(args: ProductionRecordEntityConstructor) {
    this.id = args.id;
    this.quantity = args.quantity;
    this.unitMaterialCost = args.unitMaterialCost;
    this.totalMaterialCost = args.totalMaterialCost;
    this.producedAt = args.producedAt;
    this.note = args.note;
    this.variant = args.variant;
    this.items = args.items;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  // Derived getter — pure, no I/O. Fine on domain entities.
  get productName(): string {
    return this.variant.productName ?? this.variant.name;
  }

  get variantName(): string {
    return this.variant.name;
  }
}
