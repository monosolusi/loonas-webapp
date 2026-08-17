"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useRef } from "react";
import { FieldIssue, STEP_LABELS } from "@/app/(user)/onboarding/account/_utils/account-form-data";

type IncompleteFormNoticeProps = {
  issues: FieldIssue[];
};

/**
 * What an incomplete submit says instead of the button simply going grey.
 *
 * Display component — it holds no context, so the personal and business flows can each feed it
 * their own resolver's issues. It deliberately names the STEP alongside each field: the fields
 * live on steps that render `null` when off-step, so "Kelurahan" alone would send the user
 * hunting for a control that is not currently on screen.
 *
 * Not an `ErrorCard`: that component wraps its children in a `<p>`, which cannot legally contain
 * the list this needs.
 */
export function IncompleteFormNotice(props: IncompleteFormNoticeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasIssues = props.issues.length > 0;

  useEffect(() => {
    if (hasIssues) wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [hasIssues, props.issues]);

  return (
    <div ref={wrapperRef} role="status" aria-live="polite" aria-atomic="true">
      {hasIssues && (
        <div className="mt-2 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <ExclamationCircleIcon aria-hidden="true" className="size-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Lengkapi {props.issues.length} data berikut sebelum melanjutkan:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-800">
                {props.issues.map((issue) => (
                  <li key={issue.field}>
                    {issue.label} <span className="text-red-600">({STEP_LABELS[issue.step]})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
