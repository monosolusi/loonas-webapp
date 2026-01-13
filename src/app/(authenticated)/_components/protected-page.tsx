"use client";

import { useEffect, useMemo, useState } from "react";
import { SelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { ServerError } from "@/core/resources/server-error";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function ProtectedPage({ children }: { children: any }) {
  const [error, setError] = useState<Error>();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (error && isLoaded) {
      setError(undefined);

      // Force sign out
      if (error instanceof ServerError) signOut({ redirectUrl: "/sign-in" });
      else throw error;
    }
  }, [error, isLoaded]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/sign-in");
  }, [isLoaded, isSignedIn]);

  const sessionLoading = useMemo(() => {
    return !isLoaded;
  }, [isLoaded]);

  if (sessionLoading) return <></>;
  return <SelectedAccountProvider>{children}</SelectedAccountProvider>;
}
