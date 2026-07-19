"use client";

import clsx from "clsx";
import { Switch } from "@headlessui/react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";
import { LEGAL_FORM_OPTIONS } from "@/features/accounting/presentations/helpers/tax-posture-labels";
import { useTaxPosture } from "@/app/(authenticated)/accounting/tax-posture/_providers/tax-posture-provider";

export function TaxPostureFormCard() {
  const { setting, formValues, formErrors, isDirty, isValid, isSaving, setFormValue, validateField, handleReset, handleSubmit } =
    useTaxPosture();

  return (
    <SectionCard title="Informasi Pajak">
      <div className="flex flex-col">
        {setting.isNullTriad && (
          <p className="mb-5 text-sm text-neutral-300">
            Postur pajak belum diatur. Data di bawah adalah nilai default sistem.
          </p>
        )}

        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-6">
          {/* Row 1 Col 1 — Bentuk Usaha */}
          <SelectInput
            label="Bentuk Usaha"
            required
            options={LEGAL_FORM_OPTIONS}
            value={formValues.legalForm}
            placeholder="Pilih bentuk usaha"
            onChange={(value) => setFormValue("legalForm", value as LegalForm)}
          />

          {/* Row 1 Col 2 — NPWP */}
          <TextInput
            label="NPWP"
            inputMode="numeric"
            placeholder="000000000000000"
            description="15 atau 16 digit angka."
            value={formValues.npwp}
            error={formErrors.npwp}
            onChange={(value) => setFormValue("npwp", value)}
            onBlur={() => validateField("npwp")}
          />

          {/* Row 2 Col 1 — NPPKP */}
          <TextInput
            label="NPPKP"
            placeholder="Nomor Pokok PKP"
            description="Maks. 30 karakter."
            maxLength={30}
            value={formValues.nppkp}
            error={formErrors.nppkp}
            onChange={(value) => setFormValue("nppkp", value)}
            onBlur={() => validateField("nppkp")}
          />

          {/* Row 2 Col 2 — Sektor KLBI */}
          <TextInput
            label="Sektor KLBI"
            placeholder="Kode sektor KLBI"
            description="Maks. 10 karakter."
            maxLength={10}
            value={formValues.sektorKlbi}
            onChange={(value) => setFormValue("sektorKlbi", value)}
          />

          {/* Row 3 Col 1 — Tanggal Efektif PKP */}
          <TextInput
            label="Tanggal Efektif PKP"
            type="date"
            value={formValues.pkpEffectiveDate}
            error={formErrors.pkpEffectiveDate}
            onChange={(value) => setFormValue("pkpEffectiveDate", value)}
            onBlur={() => validateField("pkpEffectiveDate")}
          />

          {/* Row 3 Col 2 — Mulai PPh Final UMKM */}
          <TextInput
            label="Mulai PPh Final UMKM"
            type="date"
            value={formValues.pphFinalEligibilityStart}
            error={formErrors.pphFinalEligibilityStart}
            onChange={(value) => setFormValue("pphFinalEligibilityStart", value)}
            onBlur={() => validateField("pphFinalEligibilityStart")}
          />
        </div>

        <div className="my-5 border-t border-neutral-100" />

        {/* PPh Final UMKM toggle */}
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex flex-col gap-y-0.5">
            <span className="text-sm font-semibold text-neutral-500">PPh Final UMKM</span>
            <span className="text-xs text-neutral-300">
              Aktifkan jika usaha ini memenuhi syarat PPh Final 0,5% berdasarkan PP 23/2018.
            </span>
          </div>
          <Switch
            checked={formValues.isPphFinalUmkm}
            onChange={(value) => setFormValue("isPphFinalUmkm", value)}
            aria-label="PPh Final UMKM"
            className={clsx(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
              formValues.isPphFinalUmkm ? "bg-primary-300" : "bg-neutral-200",
            )}
          >
            <span
              className={clsx(
                "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                formValues.isPphFinalUmkm ? "translate-x-5" : "translate-x-0",
              )}
            />
          </Switch>
        </div>

        {/* Status PKP — read-only */}
        <div className="mt-5 flex items-center justify-between gap-x-4">
          <div className="flex flex-col gap-y-0.5">
            <span className="text-sm font-semibold text-neutral-500">Status PKP</span>
            <span className="text-xs text-neutral-300">
              Dikelola otomatis oleh Loonas berdasarkan aktivasi PPN. Tidak dapat diubah di sini.
            </span>
          </div>
          <div aria-label={setting.isPkp ? "Status PKP: PKP Aktif" : "Status PKP: Non-PKP"}>
            {setting.isPkp ? (
              <StatusChip variant="success" label="PKP Aktif" />
            ) : (
              <StatusChip variant="neutral" label="Non-PKP" />
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end gap-x-3">
          {!setting.isNullTriad && (
            <SecondaryButton
              label="Atur Ulang"
              outlined
              disabled={!isDirty || isSaving}
              onClick={handleReset}
            />
          )}
          <PrimaryButton
            label="Simpan Perubahan"
            loading={isSaving}
            loadingLabel="Menyimpan..."
            disabled={!isValid || !isDirty || isSaving}
            aria-busy={isSaving}
            aria-disabled={!isValid || !isDirty || isSaving}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </SectionCard>
  );
}
