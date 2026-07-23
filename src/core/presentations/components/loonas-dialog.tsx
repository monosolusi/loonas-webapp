import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import React from "react";
import clsx from "clsx";
import { LoonasDialogProps } from "@/core/presentations/components/loonas-dialog.types";

const widthClasses: Record<NonNullable<LoonasDialogProps["width"]>, string> = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  "7xl": "sm:max-w-7xl",
  full: "sm:max-w-full",
};

export function LoonasDialog(props: LoonasDialogProps) {
  const onClose = (_: boolean) => {
    const allowDismiss = props.allowDismiss === undefined ? true : props.allowDismiss;
    if (!allowDismiss) return;
    if (props.onClose) props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        className="fixed inset-0 bg-neutral-500/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        transition
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            className={clsx(
              "relative max-h-[90dvh] transform overflow-y-auto rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95",
              widthClasses[props.width ?? "lg"],
            )}
            transition
          >
            {props.title && (
              <DialogTitle as="h3" className="text-lg font-semibold text-neutral-500">
                {props.title}
              </DialogTitle>
            )}
            {props.children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
