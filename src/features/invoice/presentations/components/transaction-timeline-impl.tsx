"use client";

import { useGetInvoiceTimeline } from "@/features/invoice/presentations/hooks/use-get-invoice-timeline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TimelineItem } from "@/features/invoice/presentations/components/timeline-item";
import { InvoiceTimelineStepEntity } from "@/features/invoice/domain/entities/invoice-timeline";

const STEP_ICONS: Record<string, string> = {
  INVOICE_CREATED: "/assets/images/wallet-icon-neutral-500-w18-h18.svg",
  PAYMENT_RECEIVED: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  DISBURSEMENT_PROCESSING: "/assets/images/progress-circle-icon-neutral-500-w28-h28.svg",
  DISBURSEMENT_COMPLETED: "/assets/images/money-icon-neutral-300-w18-h18.svg",
};

function deriveState(step: InvoiceTimelineStepEntity, firstIncompleteStep: number | null): "past" | "current" | "future" {
  if (step.isCompleted) return "past";
  if (firstIncompleteStep === step.step) return "current";
  return "future";
}

interface TransactionTimelineImplProps {
  id: string;
}

export function TransactionTimelineImpl({ id }: TransactionTimelineImplProps) {
  const { timeline, loading } = useGetInvoiceTimeline({ id });

  if (loading || !timeline) {
    return (
      <SectionCard iconSrc="/assets/images/shield-icon-primary-w16-h16.svg" title="Status Transaksi">
        <div className="flex flex-col gap-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-row gap-x-4">
              <div className="size-10 animate-pulse rounded-full bg-neutral-100" />
              <div className="flex flex-1 flex-col gap-y-2">
                <div className="h-3.5 w-32 animate-pulse rounded bg-neutral-100" />
                <div className="h-6 w-full animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  const firstIncompleteStep = timeline.steps.find((s) => !s.isCompleted)?.step ?? null;

  return (
    <SectionCard iconSrc="/assets/images/shield-icon-primary-w16-h16.svg" title="Status Transaksi">
      <div className="flex flex-col gap-y-8">
        {timeline.steps.map((step) => {
          const state = deriveState(step, firstIncompleteStep);
          return (
            <TimelineItem
              key={step.step}
              state={state}
              title={step.name}
              description={step.description}
              iconSrc={STEP_ICONS[step.status]}
              timestamp={step.completedAt ? step.completedAt.toFormat("dd LLL, HH:mm") : undefined}
            />
          );
        })}
      </div>
    </SectionCard>
  );
}
