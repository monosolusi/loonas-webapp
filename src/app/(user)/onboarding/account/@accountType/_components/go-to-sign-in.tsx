"use client";

import { useAuth } from "@clerk/nextjs";

export function GoToSignIn() {
  const { isLoaded, signOut } = useAuth();

  const onClick = async () => {
    // Because you already signed in, you need to sign out first before going back to the sign in page.
    if (!isLoaded) return;
    await signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <span className="text-center leading-6 font-normal">
      Sudah pernah punya akun Loonas? &nbsp;{" "}
      <span onClick={onClick} className="text-primary-300 hover:cursor-pointer hover:underline">
        Masuk Disini
      </span>
    </span>
  );
}
