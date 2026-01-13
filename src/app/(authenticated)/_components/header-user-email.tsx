"use client";

import { useUser } from "@clerk/nextjs";

export function HeaderUserEmail() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn || !user.primaryEmailAddress) return null;
  return (
    <div className="text-right text-xs leading-4 font-medium text-neutral-300">
      {user.primaryEmailAddress.emailAddress}
    </div>
  );
}
