"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateInvoicePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/accounts/create");
  }, []);

  return (
    <></>
  );
}