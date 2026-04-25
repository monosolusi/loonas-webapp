import { AbstractModel } from "@/core/resources/model";
import { LedgerAccountModel } from "@/features/accounting/data/models/ledger-account";
import {
  CoaMappingLineEntity,
  CoaMappingLinePosition,
} from "@/features/accounting/domain/entities/coa-mapping-line";

type CoaMappingLineModelConstructor = {
  id: string;
  account: LedgerAccountModel;
  position: CoaMappingLinePosition;
  label: string | null;
  sortOrder: number;
};

export class CoaMappingLineModel implements AbstractModel {
  public readonly id: string;
  public readonly account: LedgerAccountModel;
  public readonly position: CoaMappingLinePosition;
  public readonly label: string | null;
  public readonly sortOrder: number;

  constructor(args: CoaMappingLineModelConstructor) {
    this.id = args.id;
    this.account = args.account;
    this.position = args.position;
    this.label = args.label;
    this.sortOrder = args.sortOrder;
  }

  public static fromJson(data: Record<string, any>): CoaMappingLineModel {
    return new CoaMappingLineModel({
      id: data["id"],
      account: LedgerAccountModel.fromJson(data["account"]),
      position: data["position"] as CoaMappingLinePosition,
      label: data["label"] ?? null,
      sortOrder: data["sort_order"] ?? 0,
    });
  }

  public toEntity(): CoaMappingLineEntity {
    return new CoaMappingLineEntity({
      id: this.id,
      account: this.account.toEntity(),
      position: this.position,
      label: this.label,
      sortOrder: this.sortOrder,
    });
  }
}
