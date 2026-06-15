import { SectionCard } from "@/core/presentations/components/section-card";

type ReportShellLoadingProps = {
  title: string;
};

export function ReportShellLoading({ title }: ReportShellLoadingProps) {
  return (
    <SectionCard title={title} bodyClassName="p-6">
      <div className="flex flex-col gap-y-4 motion-safe:animate-pulse">
        <div className="flex flex-row gap-x-4">
          <div className="h-8 w-1/3 rounded bg-neutral-100" />
          <div className="h-8 w-1/3 rounded bg-neutral-100" />
          <div className="h-8 w-1/3 rounded bg-neutral-100" />
        </div>
        <div className="h-px bg-neutral-100" />
        <div className="flex flex-row gap-x-4">
          <div className="h-4 w-1/3 rounded bg-neutral-100" />
          <div className="h-4 w-1/3 rounded bg-neutral-100" />
          <div className="h-4 w-1/3 rounded bg-neutral-100" />
        </div>
        <div className="h-4 w-full rounded bg-neutral-100" />
        <div className="h-4 w-5/6 rounded bg-neutral-100" />
        <div className="h-4 w-full rounded bg-neutral-100" />
        <div className="h-4 w-4/6 rounded bg-neutral-100" />
        <div className="h-4 w-5/6 rounded bg-neutral-100" />
        <div className="h-4 w-full rounded bg-neutral-100" />
      </div>
    </SectionCard>
  );
}
