/**
 * LNS-637: all CALK notes render read-only. Notes carrying `requiresTenantConfirmation` (note #2,
 * Kebijakan Akuntansi) must NEVER gain an edit / dismiss / suppress / replace affordance — note #2
 * carries a mandated SAK EMKM ¶6.3 departure disclosure (substituted server-side by LNS-631) that a
 * merchant must not strip from a statutory document. The viewer consumes `NoteEntity.isReadOnly`
 * as its runtime enforcement point: a read-only note renders a lock indicator beside its title and
 * carries `data-readonly="true"` on its `<section>`. Any future edit / dismiss / suppress / replace
 * affordance MUST gate on `note.isReadOnly`. The mode-dependent gate (allow standard-copy edit,
 * forbid departure-copy edit) waits on a BE discriminator field (LNS-660); do not add any editable
 * affordance here until that ships.
 */
import { LockClosedIcon } from "@heroicons/react/20/solid";

import { NotesReportEntity } from "@/features/accounting/domain/entities/notes";
import { NoteLineItems } from "@/features/accounting/presentations/components/reports/note-line-items";
import { NoteText } from "@/features/accounting/presentations/components/reports/note-text";

type NotesViewerProps = {
  report: NotesReportEntity;
};

export function NotesViewer({ report }: NotesViewerProps) {
  return (
    <div className="px-6 py-6">
      <div className="space-y-8">
        {report.notes.map((note) => (
          <section key={note.noteNumber} data-readonly={note.isReadOnly ? "true" : undefined}>
            <div className="flex flex-row items-center gap-x-1.5">
              <h2 className="text-balance text-base font-semibold leading-6 text-neutral-500">{note.title}</h2>
              {note.isReadOnly && (
                <LockClosedIcon aria-label="Read-only" className="size-4 text-neutral-400" />
              )}
            </div>
            {note.paragraphRef && (
              <p className="text-xs font-medium text-neutral-300">Catatan {note.paragraphRef}</p>
            )}
            <div className="mt-3">
              {note.contentType === "text" && <NoteText text={note.text ?? ""} />}
              {note.contentType === "line_items" && <NoteLineItems lines={note.lines ?? []} />}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
