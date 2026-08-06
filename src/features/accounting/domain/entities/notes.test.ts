import { describe, expect, it } from "vitest";

import { NoteEntity } from "@/features/accounting/domain/entities/notes";

function buildNote(overrides: Partial<InstanceType<typeof NoteEntity>> = {}): NoteEntity {
  return new NoteEntity(
    overrides.noteNumber ?? 2,
    overrides.paragraphRef ?? "6.2(b)/6.3",
    overrides.title ?? "Kebijakan Akuntansi",
    overrides.contentType ?? "text",
    overrides.kind ?? "hybrid",
    overrides.requiresTenantConfirmation ?? true,
    overrides.text ?? "...",
    overrides.lines ?? null,
  );
}

describe("NoteEntity.isReadOnly", () => {
  it("is read-only when the note requires tenant confirmation (note #2)", () => {
    const note = buildNote({ noteNumber: 2, requiresTenantConfirmation: true });
    expect(note.isReadOnly).toBe(true);
  });

  it("is not read-only when the note does not require tenant confirmation", () => {
    const note = buildNote({ noteNumber: 1, requiresTenantConfirmation: false });
    expect(note.isReadOnly).toBe(false);
  });

  it("pins the blanket read-only behavior until the BE discriminator ships (LNS-660)", () => {
    // isReadOnly does not (and cannot) distinguish standard-policy copy from departure copy —
    // there is no discriminator field on the live contract yet, by design. The guard is
    // intentionally blanket across both BE modes today; the mode-dependent gate waits on LNS-660.
    const note = buildNote({ noteNumber: 2, requiresTenantConfirmation: true, text: "any copy" });
    expect(note.isReadOnly).toBe(true);
  });
});
