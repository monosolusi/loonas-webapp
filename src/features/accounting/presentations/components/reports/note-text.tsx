type NoteTextProps = {
  text: string;
};

export function NoteText({ text }: NoteTextProps) {
  if (!text) return null;

  return (
    <p className="max-w-prose overflow-wrap-break-word whitespace-pre-line text-pretty leading-7 text-neutral-500 text-sm">
      {text}
    </p>
  );
}
