"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SectionCard } from "@/core/presentations/components/section-card";

interface DraftActionCardProps {
  onContinue: () => void;
  errorMessage?: string;
}

export function DraftActionCard({ onContinue, errorMessage }: DraftActionCardProps) {
  return (
    <SectionCard title="Selesaikan Draf" iconSrc="/assets/images/document-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <p className="text-sm leading-5 text-neutral-300">
          Faktur ini masih draf dan belum dikirim ke klien. Selesaikan untuk memfinalisasi dan mengirimkannya ke klien.
        </p>

        {errorMessage && (
          <div className="rounded-lg border border-error-300/20 bg-error-300/5 px-4 py-3">
            <p className="text-sm text-error-300">{errorMessage}</p>
          </div>
        )}

        <PrimaryButton label="Lanjutkan & Kirim" onClick={onContinue} />
      </div>
    </SectionCard>
  );
}
