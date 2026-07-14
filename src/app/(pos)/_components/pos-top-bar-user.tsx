"use client";

import { useUser } from "@clerk/nextjs";

export function PosTopBarUser() {
  const { user } = useUser();
  const userName = user?.fullName ?? user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? "";

  if (!userName) return null;
  // Dropped below `sm` — the top bar has no room for it alongside nav + exit at phone widths.
  return <span className="hidden text-sm leading-5 text-neutral-400 sm:inline">{userName}</span>;
}
