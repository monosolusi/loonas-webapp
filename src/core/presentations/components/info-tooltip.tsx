"use client";

import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

type InfoTooltipProps = {
  text: React.ReactNode;
};

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="text-neutral-200 transition-colors hover:text-neutral-400"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
      >
        <InformationCircleIcon className="size-4" />
      </button>
      <div
        className={clsx(
          "absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border border-neutral-100 bg-white px-3 py-2 text-xs leading-4 text-neutral-400 shadow-lg transition-all",
          visible ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
      </div>
    </span>
  );
}
