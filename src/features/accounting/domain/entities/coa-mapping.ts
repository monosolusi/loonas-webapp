import { AbstractEntity } from "@/core/resources/entity";
import { CoaMappingLineEntity } from "@/features/accounting/domain/entities/coa-mapping-line";

type CoaMappingEntityConstructor = {
  id: string;
  entityType: string;
  entityId: string | null;
  lines: CoaMappingLineEntity[];
  createdAt: string;
  updatedAt: string;
};

export class CoaMappingEntity implements AbstractEntity {
  public readonly id: string;
  public readonly entityType: string;
  public readonly entityId: string | null;
  public readonly lines: CoaMappingLineEntity[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: CoaMappingEntityConstructor) {
    this.id = args.id;
    this.entityType = args.entityType;
    this.entityId = args.entityId;
    this.lines = args.lines;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
