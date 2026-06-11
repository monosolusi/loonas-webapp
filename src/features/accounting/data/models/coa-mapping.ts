import { AbstractModel } from "@/core/resources/model";
import { CoaMappingLineModel } from "@/features/accounting/data/models/coa-mapping-line";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";

type CoaMappingModelConstructor = {
  id: string;
  entityType: string;
  entityId: string | null;
  lines: CoaMappingLineModel[];
  createdAt: string;
  updatedAt: string;
};

export class CoaMappingModel implements AbstractModel {
  public readonly id: string;
  public readonly entityType: string;
  public readonly entityId: string | null;
  public readonly lines: CoaMappingLineModel[];
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: CoaMappingModelConstructor) {
    this.id = args.id;
    this.entityType = args.entityType;
    this.entityId = args.entityId;
    this.lines = args.lines;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): CoaMappingModel {
    const rawLines = Array.isArray(data["lines"]) ? data["lines"].map(CoaMappingLineModel.fromJson) : [];
    const lines = rawLines.sort((a, b) => a.sortOrder - b.sortOrder);

    return new CoaMappingModel({
      id: data["id"],
      entityType: data["entity_type"],
      entityId: data["entity_id"] ?? null,
      lines,
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): CoaMappingEntity {
    return new CoaMappingEntity({
      id: this.id,
      entityType: this.entityType,
      entityId: this.entityId,
      lines: this.lines.map((l) => l.toEntity()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
