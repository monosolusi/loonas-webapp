"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function DefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sign-in");
  }, []);

  return (
    <></>
  );
}