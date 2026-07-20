"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LogoImage } from "@/core/presentations/components/logo-image";
import { NavigationMenu } from "@/app/(authenticated)/_components/navigation-menu";

type MobileMoreSheetProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Bottom sheet holding the full navigation tree — the mobile counterpart of the
 * desktop sidebar. Slides up with the same calm ease-out motion as the POS cart
 * drawer; dismiss via backdrop, close button, or Escape (Headless UI Dialog).
 */
export function MobileMoreSheet({ open, onClose }: MobileMoreSheetProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-neutral-500/40 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel
          transition
          className="flex max-h-[85dvh] w-full flex-col rounded-t-2xl border-t border-neutral-100 bg-white pb-[env(safe-area-inset-bottom)] transition-transform data-closed:translate-y-full data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          {/* Grab handle */}
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <div className="h-1 w-9 rounded-full bg-neutral-100" />
          </div>

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-5 pb-2">
            <LogoImage className="h-auto w-20" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="flex size-8 items-center justify-center rounded-md text-neutral-300 transition-colors hover:bg-primary-300/20 hover:text-primary-300"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex min-h-0 flex-1 flex-col px-3 pb-4">
            <NavigationMenu />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
