import { AbstractEntity } from "@/core/resources/entity";

export class DailyRevenuePoint implements AbstractEntity {
  constructor(
    public readonly date: string,
    public readonly revenue: number,
    public readonly transactionCount: number,
  ) {}
}
