"use client";

import { Card } from "@/core/presentations/components/card";
import { useRouter } from "next/navigation";
import React from "react";

interface AccountTypeItemProps {
  title: string;
  description: string;
  img: { src: string; alt: string };
  route: { path: string };
}

export function AccountTypeItem(props: AccountTypeItemProps) {
  const router = useRouter();

  const handleNavigate = () => router.push(props.route.path);

  return (
    <Card className="flex-1" effect={{ hover: true, selectable: true }} onClick={handleNavigate}>
      <div className="flex flex-col space-y-2">
        <div className="text-base/7 font-semibold text-gray-900">{props.title}</div>
        <div className="text-base text-gray-500">{props.description}</div>
        <div className="flex flex-row justify-end">
          <img alt={props.img.alt} className="h-20 w-auto" src={props.img.src} />
        </div>
      </div>
    </Card>
  );
}
