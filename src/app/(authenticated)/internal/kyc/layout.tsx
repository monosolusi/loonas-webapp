"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function KycReviewLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (user?.publicMetadata?.role !== "internal") router.replace("/home");
  }, [isLoaded, user, router]);

  if (!isLoaded) return null;
  if (user?.publicMetadata?.role !== "internal") return null;

  return <>{children}</>;
}
