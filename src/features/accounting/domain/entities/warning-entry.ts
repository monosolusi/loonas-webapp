import { AbstractEntity } from "@/core/resources/entity";
import { WarningSeverity } from "@/features/accounting/domain/enums/warning-severity";

export class WarningEntryEntity implements AbstractEntity {
  public readonly code: string;
  public readonly severity: WarningSeverity;
  public readonly accountId: string | null;
  public readonly suggestedAlternative: string | null;

  constructor(args: {
    code: string;
    severity: WarningSeverity;
    accountId: string | null;
    suggestedAlternative: string | null;
  }) {
    this.code = args.code;
    this.severity = args.severity;
    this.accountId = args.accountId;
    this.suggestedAlternative = args.suggestedAlternative;
  }

  public get isHard(): boolean {
    return this.severity === WarningSeverity.HARD;
  }
}
