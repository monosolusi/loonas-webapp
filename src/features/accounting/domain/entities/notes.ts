import { AbstractEntity } from "@/core/resources/entity";

export class NoteLineEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly bucket: string,
    public readonly amount: number,
    public readonly displayOrder: number,
  ) {}
}

export class NoteEntity implements AbstractEntity {
  constructor(
    public readonly noteNumber: number,
    public readonly paragraphRef: string,
    public readonly title: string,
    public readonly contentType: "text" | "line_items",
    public readonly kind: string,
    public readonly requiresTenantConfirmation: boolean,
    public readonly text: string | null,
    public readonly lines: NoteLineEntity[] | null,
  ) {}

  /** LNS-637 / LNS-631: note #2 is the only `requiresTenantConfirmation` note. It carries a
   *  mandated SAK EMKM ¶6.3 departure disclosure when the reporting period has unresolved cost
   *  gaps (substituted server-side by LNS-631). It must never be editable / dismissible /
   *  suppressible / replaceable — a merchant must not strip a mandated departure disclosure from
   *  a statutory document given to banks. `isReadOnly` is the *interim* blanket guard keyed on
   *  `requiresTenantConfirmation` (read-only in both standard and departure modes); the final
   *  mode-dependent gate (allow standard-copy edit, forbid departure-copy edit) is rebased on a
   *  BE discriminator field in Phase 2 — see the Phase 0 BE follow-up ticket (LNS-660) that
   *  blocks LNS-637. */
  get isReadOnly(): boolean {
    return this.requiresTenantConfirmation;
  }
}

export class NotesMetaEntity implements AbstractEntity {
  constructor(
    public readonly tenantId: string,
    public readonly entityName: string,
    public readonly title: string,
    public readonly subtitle: string,
    public readonly asOf: string,
    public readonly asOfDisplay: string,
    public readonly period: string,
    public readonly fiscalYearStartAsOf: string,
    public readonly periodStatus: "open" | "closed" | "locked",
    public readonly currency: string,
    public readonly generatedAt: string,
  ) {}
}

export class NotesReportEntity implements AbstractEntity {
  constructor(
    public readonly meta: NotesMetaEntity,
    public readonly notes: NoteEntity[],
  ) {}
}
