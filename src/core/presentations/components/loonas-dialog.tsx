import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import React from "react";

interface LoonasdialogProps {
  children?: React.ReactNode;
  title?: string;
  width?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  open: boolean;
  onClose?: (() => void) | (() => Promise<void>);
  allowDismiss?: boolean;
}

export function LoonasDialog(props: LoonasdialogProps) {
  const handleClose = (_: boolean) => {
    const allowDismis = (props.allowDismiss === undefined? true : props.allowDismiss);
    if (!allowDismis) return;
    if (props.onClose) props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        transition
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            className={`relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-${props.width ?? "lg"} sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95`}
            transition
          >
            {props.title && (
              <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
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
