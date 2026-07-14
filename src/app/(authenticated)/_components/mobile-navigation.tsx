"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MobileTabBar } from "@/app/(authenticated)/_components/mobile-tab-bar";
import { MobileMoreSheet } from "@/app/(authenticated)/_components/mobile-more-sheet";

/**
 * Mobile primary navigation: a fixed bottom tab bar plus the "Lainnya" bottom
 * sheet. Hidden at `lg` and above, where the desktop sidebar takes over. Both
 * pieces render `fixed`, so this component adds no layout box of its own.
 */
export function MobileNavigation() {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  // Any navigation closes the sheet (covers taps on both items and child items).
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      <MobileTabBar moreOpen={moreOpen} onMoreClick={() => setMoreOpen((open) => !open)} />
      <MobileMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
