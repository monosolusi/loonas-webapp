import { AbstractModel } from "@/core/resources/model";
import { OpeningBalanceEntity, OpeningBalanceLineEntity } from "@/features/accounting/domain/entities/opening-balance";

export class OpeningBalanceLineModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
  ) {}

  public static fromJson(data: Record<string, any>): OpeningBalanceLineModel {
    return new OpeningBalanceLineModel(
      data["id"] ?? "",
      data["account_id"] ?? "",
      data["account_code"] ?? "",
      data["account_name"] ?? "",
      data["debit"] ?? 0,
      data["credit"] ?? 0,
    );
  }

  public toEntity(): OpeningBalanceLineEntity {
    return {
      id: this.id,
      accountId: this.accountId,
      accountCode: this.accountCode,
      accountName: this.accountName,
      debit: this.debit,
      credit: this.credit,
    };
  }
}

export class OpeningBalanceModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly date: string,
    public readonly memo: string,
    public readonly lines: OpeningBalanceLineModel[],
    public readonly createdAt: string,
  ) {}

  public static fromJson(data: Record<string, any>): OpeningBalanceModel {
    return new OpeningBalanceModel(
      data["id"] ?? "",
      data["date"] ?? "",
      data["memo"] ?? "",
      Array.isArray(data["lines"]) ? data["lines"].map(OpeningBalanceLineModel.fromJson) : [],
      data["created_at"] ?? "",
    );
  }

  public toEntity(): OpeningBalanceEntity {
    return new OpeningBalanceEntity({
      id: this.id,
      date: this.date,
      memo: this.memo,
      lines: this.lines.map((l) => l.toEntity()),
      createdAt: this.createdAt,
    });
  }
}
