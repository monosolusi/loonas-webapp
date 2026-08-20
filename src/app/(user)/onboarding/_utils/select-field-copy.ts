/**
 * Every user-facing string for the onboarding option-list selects, in one plain `.ts` module.
 *
 * These lived as `const` literals inside the five `.tsx` wrappers, which put them out of reach of the
 * node-env vitest suite — so `parentHintCopy: ""` type-checked, rendered as nothing, and reproduced
 * the very F10 defect the resolver exists to prevent, with no test able to see it. A single nested
 * object rather than loose exports so `select-field-copy.test.ts` can walk every string leaf: a new
 * entry cannot be added without the non-empty assertion covering it.
 *
 * Copy notes:
 * - Fetch failures take a trailing period, matching the house form (`periods-error.tsx`).
 * - Parent hints are guidance, not errors, so they take none.
 * - `loading` is deliberately ONE shared string: the label directly above the field already says
 *   which list is loading, so per-field variants are pure drift surface. Three dots match the flow's
 *   house style ("Membuat akun...", "Sedang keluar...").
 * - `retry` is sentence case, the inline-text-button form here (`dashboard-range-*-error.tsx`,
 *   `periods-error.tsx`); title-case "Coba Lagi" is the `SecondaryButton label` form.
 */
export const SELECT_FIELD_COPY = {
  fetchError: {
    province: "Gagal memuat daftar provinsi.",
    city: "Gagal memuat daftar kabupaten/kota.",
    district: "Gagal memuat daftar kecamatan.",
    subdistrict: "Gagal memuat daftar kelurahan.",
    occupation: "Gagal memuat daftar pekerjaan.",
  },
  parentHint: {
    city: "Pilih provinsi terlebih dahulu",
    district: "Pilih kabupaten/kota terlebih dahulu",
    subdistrict: "Pilih kecamatan terlebih dahulu",
  },
  loading: "Memuat pilihan...",
  noOptions: "Tidak ada pilihan tersedia.",
  retry: "Coba lagi",
  retryPending: "Memuat ulang...",
} as const;
