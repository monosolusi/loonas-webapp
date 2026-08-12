import { ReactNode } from "react";

type DialogFooterProps = {
  children: ReactNode;
};

export function DialogFooter({ children }: DialogFooterProps) {
  // sm:*:w-auto sm:*:shrink-0 forces every direct child to content-width and
  // no-shrink at sm+, so dialog actions always sit on one row instead of one
  // sibling stretching to w-full (its base Button default) and squeezing the
  // other's label onto two lines. A child that legitimately needs different
  // sizing (e.g. a full-width search input) must opt out explicitly with the
  // Tailwind v4 important modifier (trailing "!"), e.g. className="w-full!".
  return (
    <div className="-mx-4 flex flex-col-reverse gap-3 border-t border-neutral-100 px-4 pt-4 sm:-mx-6 sm:flex-row sm:justify-end sm:px-6 sm:*:w-auto sm:*:shrink-0">
      {children}
    </div>
  );
}
