import { ReactNode } from "react";

type DialogFooterProps = {
  children: ReactNode;
};

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="-mx-4 flex flex-col-reverse gap-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:flex-row sm:justify-end sm:px-6 sm:*:w-auto sm:*:shrink-0">
      {children}
    </div>
  );
}
