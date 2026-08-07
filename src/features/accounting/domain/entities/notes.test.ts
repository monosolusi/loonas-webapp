import { describe, expect, it } from "vitest";

import { NoteEntity } from "@/features/accounting/domain/entities/notes";

// LNS-637 / LNS-660: `NoteEntity.isReadOnly` is the *interim* blanket guard keyed on
// `requiresTenantConfirmation` (read-only in both standard and departure modes). It does not
// (and cannot) distinguish standard-policy copy from departure copy — there is no discriminator
// field on the live contract yet, by design. The mode-dependent gate (allow standard-copy edit,
// forbid departure-copy edit) is rebased on a BE discriminator field in Phase 2 (LNS-660), which
// blocks LNS-637. Do not relax the assertions below until that discriminator ships.
type NoteOverrides = Partial<
  Pick<NoteEntity, "noteNumber" | "paragraphRef" | "title" | "contentType" | "kind" | "requiresTenantConfirmation" | "text" | "lines">
>;

function buildNote(overrides: NoteOverrides = {}): NoteEntity {
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

  it("derives from requiresTenantConfirmation, not the note position (noteNumber)", () => {
    // Drift-proof property: a note #2 WITHOUT the flag must NOT be read-only. Without this case,
    // all tests pass for both `return this.requiresTenantConfirmation` and the re-spelled
    // `return this.noteNumber === 2` — the CLAUDE.md derived-invariant rule exists to prevent
    // exactly that drift.
    const note = buildNote({ noteNumber: 2, requiresTenantConfirmation: false });
    expect(note.isReadOnly).toBe(false);
  });
});
