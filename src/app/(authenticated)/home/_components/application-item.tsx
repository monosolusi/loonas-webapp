"use client";

import { Card } from "@/core/presentations/components/card";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface ApplicationItemProps {
  title: string;
  description: string;
  icon: { src: string; alt: string };
  route: { path: string };
  className?: string;
}

export function ApplicationItem(props: ApplicationItemProps) {
  const router = useRouter();

  const handleNavigate = () => router.push(props.route.path);

  return (
    <Card className={clsx(props.className)} onClick={handleNavigate} effect={{ hover: true, selectable: true }}>
      <div className="flex flex-col space-y-1">
        <div className="text-sm font-semibold">{props.title}</div>
        <div className="text-xs text-gray-500">{props.description}</div>
        <div className="mt-8 flex flex-row justify-end">
          <img alt={props.icon.alt} className="h-10 w-auto" src={props.icon.src} />
        </div>
      </div>
    </Card>
  );
}
