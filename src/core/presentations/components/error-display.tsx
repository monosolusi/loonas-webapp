import React from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";

interface ErrorDisplayProps {
  children: React.ReactNode;
}

export function ErrorDisplay(props: ErrorDisplayProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{props.children}</p>
        </div>
      </div>
    </div>
  );
}
