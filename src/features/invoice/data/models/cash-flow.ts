import { AbstractModel } from "@/core/resources/model";
import { CashFlowEntity } from "@/features/invoice/domain/entities/cash-flow";

interface CashFlowModelConstructor {
  incoming: number;
  outgoing: number;
  difference: number;
}

export class CashFlowModel implements AbstractModel {
  public incoming: number;
  public outgoing: number;
  public difference: number;

  constructor(args: CashFlowModelConstructor) {
    this.incoming = args.incoming;
    this.outgoing = args.outgoing;
    this.difference = args.difference;
  }

  public static fromJson(doc: Record<string, any>): CashFlowModel {
    return new CashFlowModel({
      incoming: doc["cash_in"],
      outgoing: doc["cash_out"],
      difference: doc["difference"],
    });
  }

  public toEntity(): CashFlowEntity {
    return new CashFlowEntity({
      incoming: this.incoming,
      outgoing: this.outgoing,
      difference: this.difference,
    });
  }
}
