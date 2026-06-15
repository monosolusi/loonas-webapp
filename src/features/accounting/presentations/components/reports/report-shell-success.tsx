import { ReactNode } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";

type ReportShellSuccessProps = {
  title: string;
  headerAction?: ReactNode;
  children: ReactNode;
};

export function ReportShellSuccess({ title, headerAction, children }: ReportShellSuccessProps) {
  return (
    <SectionCard title={title} headerAction={headerAction} bodyClassName="p-0">
      {children}
    </SectionCard>
  );
}
