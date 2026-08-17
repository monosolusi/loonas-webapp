"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { UseOtherAccountAction } from "@/app/(user)/onboarding/_components/use-other-account-action";
import { SignOutAction } from "@/app/(user)/onboarding/_components/sign-out-action";

export function GoToSignIn() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    // `UseOtherAccountAction` correctly hides itself when there is no approved account to switch
    // to — that emptied this footer down to a bare `<div>` for exactly the user this whole fix
    // targets. `SignOutAction` always renders for a signed-in user, so the footer can never again
    // be structurally empty.
    return (
      <div className="flex flex-col items-center gap-y-2 text-center">
        <UseOtherAccountAction />
        <SignOutAction />
      </div>
    );
  }

  return (
    <span className="text-center leading-6 font-normal">
      Sudah pernah punya akun Loonas? &nbsp;
      <Link href="/sign-in" className="text-primary-400 underline hover:text-primary-500">
        Masuk Disini
      </Link>
    </span>
  );
}
