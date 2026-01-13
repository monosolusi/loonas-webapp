"use client";

import { useEffect, useState } from "react";
import { SelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useAuth } from "@clerk/nextjs";

export function ProtectedPage({ children }: { children: any }) {
  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();
  const { isLoaded, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (error) {
      // Force sign out
      if (error instanceof ServerError) signOut();
      else throw error;
    }
  }, [error, isLoaded]);

  useEffect(() => {
    if (isLoaded) checkSession();
  }, [isLoaded, isSignedIn]);

  async function checkSession() {
    try {
      setSessionLoading(true);
      if (!isSignedIn) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
      setSessionLoading(false);
    } catch (err: any) {
      setError(err);
    }
  }

  if (sessionLoading) return <></>;
  return <SelectedAccountProvider>{children}</SelectedAccountProvider>;
}
