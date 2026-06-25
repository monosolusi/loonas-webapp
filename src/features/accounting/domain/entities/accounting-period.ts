import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

type AccountingPeriodEntityConstructor = {
  id: string;
  accountId: string;
  kind: string;
  startDate: string;
  endDate: string;
  status: string;
  closedByUserId: string | null;
  closedAt: string | null;
  createdAt: string;
};

export class AccountingPeriodEntity implements AbstractEntity {
  public readonly id: string;
  public readonly accountId: string;
  public readonly kind: string;
  public readonly startDate: string;
  public readonly endDate: string;
  public readonly status: string;
  public readonly closedByUserId: string | null;
  public readonly closedAt: string | null;
  public readonly createdAt: string;

  constructor(args: AccountingPeriodEntityConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.kind = args.kind;
    this.startDate = args.startDate;
    this.endDate = args.endDate;
    this.status = args.status;
    this.closedByUserId = args.closedByUserId;
    this.closedAt = args.closedAt;
    this.createdAt = args.createdAt;
  }

  public get label(): string {
    return DateTime.fromISO(this.startDate).setLocale("id").toFormat("LLLL yyyy");
  }

  public get isClosed(): boolean {
    return this.status !== "open";
  }
}
