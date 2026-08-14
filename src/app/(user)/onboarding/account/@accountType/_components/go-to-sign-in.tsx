"use client";

import { useAuth } from "@clerk/nextjs";
import { UseOtherAccountAction } from "@/app/(user)/onboarding/kyc-summary/_components/use-other-account-action";

export function GoToSignIn() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  const onClick = async () => {
    // Because you already signed in, you need to sign out first before going back to the sign in page.
    if (!isLoaded) return;
    await signOut({ redirectUrl: "/sign-in" });
  };

  if (!isLoaded) return null;
  else if (isSignedIn) {
    return (
      <div className="flex flex-row text-center">
        <UseOtherAccountAction />
      </div>
    );
  } else {
    return (
      <span className="text-center leading-6 font-normal">
        Sudah pernah punya akun Loonas? &nbsp;{" "}
        <span onClick={onClick} className="text-primary-300 hover:cursor-pointer hover:underline">
          Masuk Disini
        </span>
      </span>
    );
  }
}
