"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { LOONAS_WHATSAPP_URL } from "@/core/utilities/contact";
import { useOpeningBalanceWizard } from "@/app/(authenticated)/accounting/opening-balance/_providers/opening-balance-wizard-provider";

export function OpeningBalanceReadonly() {
  const { existingBalance } = useOpeningBalanceWizard();

  const formattedDate = useMemo(() => {
    if (!existingBalance?.date) return "";
    return DateTime.fromISO(existingBalance.date).setLocale("id").toFormat("d MMMM yyyy");
  }, [existingBalance?.date]);

  if (!existingBalance) return null;

  // Group lines by side for display (debit → assets, credit → liabilities/equity)
  // Use account names from existing balance lines directly
  const debitLines = existingBalance.lines.filter((l) => l.debit > 0);
  const creditLines = existingBalance.lines.filter((l) => l.credit > 0 && l.accountCode !== "3200");

  return (
    <div className="flex flex-col gap-y-4">
      <SectionCard
        title="Saldo Awal"
        headerAction={<StatusChip variant="success" label="Sudah Dikonfirmasi" />}
      >
        {/* Date */}
        <div className="flex justify-between border-b border-neutral-100 pb-3">
          <span className="text-sm text-neutral-300">Tanggal mulai</span>
          <span className="text-sm font-medium text-neutral-400">{formattedDate}</span>
        </div>

        {/* Debit lines (assets) */}
        {debitLines.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Apa yang Anda miliki
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {debitLines.map((line) => (
                <div key={line.id} className="flex justify-between">
                  <span className="text-sm text-neutral-400">{line.accountName}</span>
                  <span className="text-sm font-medium text-neutral-400">
                    Rp {IDRFormatter.toThousand(line.debit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credit lines (liabilities + equity, excl 3200) */}
        {creditLines.length > 0 && (
          <div className="mt-4 border-t border-neutral-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Liabilitas & Modal
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {creditLines.map((line) => (
                <div key={line.id} className="flex justify-between">
                  <span className="text-sm text-neutral-400">{line.accountName}</span>
                  <span className="text-sm font-medium text-neutral-400">
                    Rp {IDRFormatter.toThousand(line.credit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <p className="text-center text-xs text-neutral-300">
        Ingin mengubah saldo awal?{" "}
        {LOONAS_WHATSAPP_URL ? (
          <a
            href={LOONAS_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi tim Loonas via WhatsApp"
            className="text-primary-300 underline underline-offset-2"
          >
            Hubungi tim Loonas via WhatsApp
          </a>
        ) : (
          <span className="text-neutral-200">Hubungi tim Loonas via WhatsApp</span>
        )}
      </p>
    </div>
  );
}
