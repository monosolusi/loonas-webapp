import { CalkReportEntity } from "@/features/accounting/domain/entities/calk";
import { CalkNoteText } from "@/features/accounting/presentations/components/reports/calk-note-text";
import { CalkNoteLineItems } from "@/features/accounting/presentations/components/reports/calk-note-line-items";

type CalkViewerProps = {
  report: CalkReportEntity;
};

export function CalkViewer({ report }: CalkViewerProps) {
  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-neutral-500">{report.meta.entityName}</p>
        <p className="text-sm font-medium text-neutral-500">{report.meta.title}</p>
        {report.meta.asOfDisplay && (
          <p className="text-sm text-neutral-300">Per {report.meta.asOfDisplay}</p>
        )}
      </div>

      <div className="space-y-8">
        {report.notes.map((note) => (
          <section key={note.noteNumber}>
            <h2 className="text-balance text-base font-semibold leading-6 text-neutral-500">{note.title}</h2>
            {note.paragraphRef && (
              <p className="text-xs font-medium text-neutral-300">Catatan {note.paragraphRef}</p>
            )}
            <div className="mt-3">
              {note.contentType === "text" && <CalkNoteText text={note.text ?? ""} />}
              {note.contentType === "line_items" && <CalkNoteLineItems lines={note.lines ?? []} />}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
