import { AbstractEntity } from "@/core/resources/entity";
import { TrialBalanceAccountType } from "@/features/accounting/domain/entities/trial-balance";

export class GeneralLedgerLineEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly journalEntryId: string,
    public readonly date: string,
    public readonly memo: string | null,
    public readonly referenceType: string | null,
    public readonly referenceId: string | null,
    public readonly referenceLabel: string | null,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
    public readonly runningBalance: number,
    public readonly entryType: "standard" | "opening_balance" | "closing",
    public readonly postedByKind: "user" | "system",
    public readonly postedByLabel: string,
  ) {}
}

export class GeneralLedgerCounterpartEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly journalEntryId: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
  ) {}
}

export class GeneralLedgerSummaryEntity implements AbstractEntity {
  constructor(
    public readonly openingDebit: number,
    public readonly openingCredit: number,
    public readonly openingBalance: number,
    public readonly periodDebitTotal: number,
    public readonly periodCreditTotal: number,
    public readonly closingDebit: number,
    public readonly closingCredit: number,
    public readonly closingBalance: number,
    public readonly naturalSide: "debit" | "credit",
  ) {}
}

export type GeneralLedgerReportMeta = {
  readonly accountId: string;
  readonly accountCode: string;
  readonly accountName: string;
  readonly accountType: TrialBalanceAccountType;
  readonly from: string;
  readonly to: string;
  readonly truncated: boolean;
  readonly lineCap: number;
};

export class GeneralLedgerReportEntity implements AbstractEntity {
  constructor(
    public readonly meta: GeneralLedgerReportMeta,
    public readonly summary: GeneralLedgerSummaryEntity,
    public readonly lines: GeneralLedgerLineEntity[],
    public readonly counterparts: GeneralLedgerCounterpartEntity[],
  ) {}
}
