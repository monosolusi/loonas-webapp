import { AbstractEntity } from "@/core/resources/entity";

interface CashFlowEntityConstructor {
  incoming: number;
  outgoing: number;
  difference: number;
}

export class CashFlowEntity implements AbstractEntity {
  public incoming: number;
  public outgoing: number;
  public difference: number;

  constructor(args: CashFlowEntityConstructor) {
    this.incoming = args.incoming;
    this.outgoing = args.outgoing;
    this.difference = args.difference;
  }
}
