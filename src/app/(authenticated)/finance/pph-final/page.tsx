"use client";

import { PphFinalProvider } from "@/app/(authenticated)/finance/pph-final/_providers/pph-final-provider";
import { PphFinalSkeleton } from "@/app/(authenticated)/finance/pph-final/_components/pph-final-skeleton";
import { PphFinalAccessDenied } from "@/app/(authenticated)/finance/pph-final/_components/pph-final-access-denied";
import { PphFinalHeader } from "@/app/(authenticated)/finance/pph-final/_components/pph-final-header";
import { PphFinalFormCard } from "@/app/(authenticated)/finance/pph-final/_components/pph-final-form-card";
import { PphFinalPreviewCard } from "@/app/(authenticated)/finance/pph-final/_components/pph-final-preview-card";

export default function PphFinalPage() {
  return (
    <PphFinalProvider
      loading={<PphFinalSkeleton />}
      accessDeniedNoFeature={<PphFinalAccessDenied variant="no-feature" />}
      accessDeniedNotConfigured={<PphFinalAccessDenied variant="not-configured" />}
    >
      <div className="flex flex-col gap-y-6">
        <PphFinalHeader />
        <PphFinalFormCard />
        <PphFinalPreviewCard />
      </div>
    </PphFinalProvider>
  );
}
