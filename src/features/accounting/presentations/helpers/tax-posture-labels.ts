import { LegalForm } from "@/features/accounting/domain/enums/legal-form";

export const LEGAL_FORM_LABELS: Record<LegalForm, string> = {
  [LegalForm.SoleProprietor]: "Perorangan",
  [LegalForm.Cv]: "CV",
  [LegalForm.Firma]: "Firma",
  [LegalForm.Pt]: "PT",
  [LegalForm.Koperasi]: "Koperasi",
};

export const LEGAL_FORM_OPTIONS = Object.entries(LEGAL_FORM_LABELS).map(([value, label]) => ({ value, label }));

export const CHANGED_FIELD_LABELS: Record<string, string> = {
  legal_form: "Bentuk Usaha",
  npwp: "NPWP",
  nppkp: "NPPKP",
  pkp_effective_date: "Tanggal Efektif PKP",
  pph_final_eligibility_start: "Mulai PPh Final UMKM",
  sektor_klbi: "Sektor KLBI",
  is_pph_final_umkm: "PPh Final UMKM",
  is_pkp: "Status PKP",
};

export const NPWP_CLASSIFICATION_LABELS: Record<string, { label: string; variant: "neutral" | "warning" }> = {
  npwp_15: { label: "15 digit", variant: "neutral" },
  npwp_16: { label: "16 digit", variant: "neutral" },
  nik_as_npwp: { label: "NIK", variant: "warning" },
};

export function formatBooleanValue(value: unknown): string {
  if (value === true) return "Aktif";
  if (value === false) return "Tidak Aktif";
  return String(value);
}

export function formatLegalFormValue(value: unknown): string {
  if (typeof value === "string" && value in LEGAL_FORM_LABELS) {
    return LEGAL_FORM_LABELS[value as LegalForm];
  }
  return String(value ?? "");
}

export function capitalizeRole(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
