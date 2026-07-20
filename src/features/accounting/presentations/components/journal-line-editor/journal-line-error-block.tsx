"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

type JournalLineErrorBlockProps = {
  error?: string;
};

export function JournalLineErrorBlock({ error }: JournalLineErrorBlockProps) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-error-100 bg-error-50 p-3"
    >
      <ExclamationCircleIcon className="mt-0.5 size-4 shrink-0 text-error-400" aria-hidden="true" />
      <span className="text-sm text-error-400">{error}</span>
    </div>
  );
}
