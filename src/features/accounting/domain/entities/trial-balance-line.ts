import { AbstractEntity } from "@/core/resources/entity";

export class TrialBalanceLineEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly journalEntryId: string,
    public readonly date: string,
    public readonly memo: string | null,
    public readonly referenceType: string | null,
    public readonly referenceId: string | null,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
  ) {}
}
