// Caps for personal-account identity fields.
// FE-side hard caps until BE publishes a contract. Sibling values marked PROVISIONAL.
export const IDENTITY_FIELD_LIMITS = {
  idNumber: 16,
  fullName: 100, // PROVISIONAL_FE_CAP_PENDING_BE
  placeOfBirth: 50, // PROVISIONAL_FE_CAP_PENDING_BE
  address: 255, // PROVISIONAL_FE_CAP_PENDING_BE
} as const;

/** Matches a 16-digit Indonesian NIK exactly. */
export const NIK_PATTERN = /^\d{16}$/;

/** Matches a passport number: 1–16 alphanumeric characters. */
export const PASSPORT_PATTERN = /^[A-Za-z0-9]{1,16}$/;
