"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DetailPageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  hideBack?: boolean;
  action?: React.ReactNode;
}

export function DetailPageHeader({ title, subtitle, backHref, onBack, hideBack, action }: DetailPageHeaderProps) {
  const router = useRouter();

  const backButtonClasses =
    "flex size-9 items-center justify-center rounded-lg border border-neutral-100 transition-colors hover:bg-neutral-50";

  const arrowIcon = (
    <Image src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg" alt="Back" width={16} height={16} />
  );

  return (
    <div className="flex flex-row items-center gap-x-4">
      {hideBack ? null : backHref ? (
        <Link href={backHref} className={backButtonClasses}>
          {arrowIcon}
        </Link>
      ) : (
        <button type="button" onClick={onBack ?? (() => router.back())} className={backButtonClasses}>
          {arrowIcon}
        </button>
      )}

      <div className="flex flex-1 flex-col gap-y-1">
        <h1 className="text-xl leading-5 font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm leading-5 text-neutral-200">{subtitle}</p>}
      </div>

      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
