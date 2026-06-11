import { ReactNode } from "react";

type DialogFooterProps = {
  children: ReactNode;
};

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="-mx-4 flex flex-row justify-end gap-x-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:px-6">
      {children}
    </div>
  );
}
