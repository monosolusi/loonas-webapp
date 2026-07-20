import { ChangeReasonCategory } from "@/features/accounting/domain/enums/change-reason-category";

export const CHANGE_REASON_CATEGORY_LABELS: Record<ChangeReasonCategory, string> = {
  [ChangeReasonCategory.SalahInputNominal]: "Salah input nominal",
  [ChangeReasonCategory.SalahAkun]: "Salah akun",
  [ChangeReasonCategory.SalahTanggal]: "Salah tanggal",
  [ChangeReasonCategory.KoreksiKlasifikasi]: "Koreksi klasifikasi",
  [ChangeReasonCategory.RevisiEstimasi]: "Revisi estimasi",
  [ChangeReasonCategory.Other]: "Lainnya",
};

/** `SearchComboboxOption`-shaped (`{ id, label }`) options for the reverse-reason dropdown. */
export const CHANGE_REASON_CATEGORY_OPTIONS = Object.entries(CHANGE_REASON_CATEGORY_LABELS).map(
  ([id, label]) => ({ id, label }),
);
