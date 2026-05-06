"use client";

import { useUser } from "@clerk/nextjs";

export function PosTopBarUser() {
  const { user } = useUser();
  const userName = user?.fullName ?? user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? "";

  if (!userName) return null;
  return <span className="text-sm leading-5 text-neutral-400">{userName}</span>;
}
