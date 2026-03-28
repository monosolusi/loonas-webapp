"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

type RecipeCardProps = {
  children: React.ReactNode;
};

export function RecipeCard({ children }: RecipeCardProps) {
  return (
    <SectionCard title="Resep / Bill of Materials" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">{children}</div>
    </SectionCard>
  );
}
