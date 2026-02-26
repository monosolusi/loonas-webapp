"use client";

import { useGetInvoiceTimeline } from "@/features/invoice/presentations/hooks/use-get-invoice-timeline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TimelineItem } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline-item";
import { InvoiceTimelineStepEntity } from "@/features/invoice/domain/entities/invoice-timeline";

const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Silakan selesaikan pembayaran agar pesanan dapat diproses.",
  2: "Terima kasih, dana Anda sudah masuk ke sistem kami.",
  3: "Mohon tunggu, kami sedang memverifikasi dan mencairkan dana.",
  4: "Selesai! Dana sudah berhasil dikirim ke rekening tujuan.",
};

const STEP_ICONS: Record<number, string> = {
  1: "/assets/images/wallet-icon-neutral-500-w18-h18.svg",
  2: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  3: "/assets/images/progress-circle-icon-neutral-500-w28-h28.svg",
  4: "/assets/images/money-icon-neutral-300-w18-h18.svg",
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
              description={STEP_DESCRIPTIONS[step.step] ?? ""}
              iconSrc={STEP_ICONS[step.step]}
              timestamp={step.completedAt ? step.completedAt.toFormat("dd LLL, HH:mm") : undefined}
            />
          );
        })}
      </div>
    </SectionCard>
  );
}
