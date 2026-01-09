"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

type AuthenticationCheckerProps = {
  children: React.ReactNode;
};

export function AuthenticationChecker(props: AuthenticationCheckerProps) {
  const { isLoaded, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) signOut({ redirectUrl: "/onboarding/user" });
  }, [isLoaded, isSignedIn, signOut]);

  return <>{props.children}</>;
}
