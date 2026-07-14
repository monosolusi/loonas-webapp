"use client";

import { useGetInvoiceTimeline } from "@/features/invoice/presentations/hooks/use-get-invoice-timeline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { Timeline } from "@/core/presentations/components/timeline/timeline";
import { TimelineItem } from "@/core/presentations/components/timeline/timeline-item";
import { InvoiceTimelineStepEntity } from "@/features/invoice/domain/entities/invoice-timeline";

const STEP_ICONS: Record<string, string> = {
  // Incoming / disbursement flow
  INVOICE_CREATED: "/assets/images/wallet-icon-neutral-500-w18-h18.svg",
  PAYMENT_RECEIVED: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  DISBURSEMENT_PROCESSING: "/assets/images/progress-circle-icon-neutral-500-w28-h28.svg",
  DISBURSEMENT_COMPLETED: "/assets/images/money-icon-neutral-300-w18-h18.svg",
  // Outgoing flow
  DRAFT: "/assets/images/wallet-icon-neutral-500-w18-h18.svg",
  READY_TO_SEND: "/assets/images/invoice-out-icon-neutral-300-w16-h16.svg",
  SENT: "/assets/images/invoice-out-icon-neutral-300-w16-h16.svg",
  PENDING_BANK_TRANSFER: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  PAID: "/assets/images/money-icon-neutral-300-w18-h18.svg",
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
  const { timeline, loading, error } = useGetInvoiceTimeline({ id });

  if (loading) {
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

  // Error / 404 / empty response all degrade to the same calm placeholder instead of a stuck skeleton.
  if (error || !timeline || timeline.steps.length === 0) {
    return (
      <SectionCard iconSrc="/assets/images/shield-icon-primary-w16-h16.svg" title="Status Transaksi">
        <div className="text-sm leading-6 text-neutral-200">Riwayat status belum tersedia.</div>
      </SectionCard>
    );
  }

  const firstIncompleteStep = timeline.steps.find((s) => !s.isCompleted)?.step ?? null;

  return (
    <SectionCard iconSrc="/assets/images/shield-icon-primary-w16-h16.svg" title="Status Transaksi">
      <Timeline>
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
      </Timeline>
    </SectionCard>
  );
}
