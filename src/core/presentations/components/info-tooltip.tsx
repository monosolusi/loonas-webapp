"use client";

import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import {
  FloatingPortal,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";

type InfoTooltipProps = {
  text: React.ReactNode;
};

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  const hover = useHover(context, { delay: { open: 100, close: 0 } });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss, role]);

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        className="text-neutral-200 transition-colors hover:text-neutral-400"
        {...getReferenceProps()}
      >
        <InformationCircleIcon className="size-4" />
      </button>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 w-56 rounded-lg border border-neutral-100 bg-white px-3 py-2 text-xs leading-4 text-neutral-400 shadow-lg"
          >
            {text}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
