// Canonical example: simple entity with one nested entity and flat fields.
// Source: src/features/production/domain/entities/production-record-item.ts

import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";

type ProductionRecordItemEntityConstructor = {
  id: string;
  rawMaterial: RawMaterialEntity;
  quantity: number;
  unitCost: number;
  totalCost: number;
  createdAt: DateTime;
};

export class ProductionRecordItemEntity implements AbstractEntity {
  public readonly id: string;
  public readonly rawMaterial: RawMaterialEntity;
  public readonly quantity: number;
  public readonly unitCost: number;
  public readonly totalCost: number;
  public readonly createdAt: DateTime;

  constructor(args: ProductionRecordItemEntityConstructor) {
    this.id = args.id;
    this.rawMaterial = args.rawMaterial;
    this.quantity = args.quantity;
    this.unitCost = args.unitCost;
    this.totalCost = args.totalCost;
    this.createdAt = args.createdAt;
  }
}
