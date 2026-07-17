import { NotesReportEntity } from "@/features/accounting/domain/entities/notes";
import { NoteText } from "@/features/accounting/presentations/components/reports/note-text";
import { NoteLineItems } from "@/features/accounting/presentations/components/reports/note-line-items";

type NotesViewerProps = {
  report: NotesReportEntity;
};

export function NotesViewer({ report }: NotesViewerProps) {
  return (
    <div className="px-6 py-6">
      <div className="space-y-8">
        {report.notes.map((note) => (
          <section key={note.noteNumber}>
            <h2 className="text-balance text-base font-semibold leading-6 text-neutral-500">{note.title}</h2>
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
