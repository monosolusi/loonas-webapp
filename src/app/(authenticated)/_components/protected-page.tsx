"use client";

import { useEffect, useMemo, useState } from "react";
import { SelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useAuth } from "@clerk/nextjs";

export function ProtectedPage({ children }: { children: any }) {
  const [error, setError] = useState<Error>();
  const { isLoaded, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (error && isLoaded) {
      setError(undefined);

      // Force sign out
      if (error instanceof ServerError) signOut({ redirectUrl: "/sign-in" });
      else throw error;
    }
  }, [error, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) setError(new ServerError(ErrorCodes.NO_VALID_SESSION));
  }, [isLoaded, isSignedIn]);

  const sessionLoading = useMemo(() => {
    return !isLoaded;
  }, [isLoaded]);

  if (sessionLoading) return <></>;
  return <SelectedAccountProvider>{children}</SelectedAccountProvider>;
}
