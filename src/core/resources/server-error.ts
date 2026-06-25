type ErrorStructureType = { code: string; httpCode: number; message: string };

export class ErrorCodes {
  public static readonly USER_SIGNED_IN = {
    code: "USER_SIGNED_IN",
    httpCode: 400,
    message: "User already signed in",
  };

  public static readonly EMPTY_RESPONSE = {
    code: "EMPTY_RESPONSE",
    httpCode: 400,
    message: "Ups! Response-nya kosong",
  };

  public static readonly NOT_AGREED = {
    code: "NOT_AGREED",
    httpCode: 400,
    message: "Kamu belum menyetujui Kebijakan Privasi dan Syarat & Ketentuan.",
  };

  public static readonly ACCOUNT_CREATION_FAILED = {
    code: "ACCOUNT_CREATION_FAILED",
    httpCode: 400,
    message: "Oh tidak! Pembuatan akun kamu gagal. Silakan coba lagi.",
  };

  public static readonly ACCOUNT_HAS_NO_BANK_ACCOUNT = {
    code: "ACCOUNT_HAS_NO_BANK_ACCOUNT",
    httpCode: 403,
    message: "Account has no bank account",
  };

  public static readonly ACCOUNT_VERIFICATION_REJECTED = {
    code: "ACCOUNT_VERIFICATION_REJECTED",
    httpCode: 403,
    message: "Account verification rejected",
  };

  public static readonly INCOMPLETE_FORM: ErrorStructureType = {
    code: "INCOMPLETE_FORM",
    httpCode: 400,
    message: "Incomplete form",
  };

  public static readonly EMPTY_PASSWORD: ErrorStructureType = {
    code: "EMPTY_PASSWORD",
    httpCode: 400,
    message: "Ups! Password-nya belum diisi",
  };

  public static readonly EMPTY_NAME: ErrorStructureType = {
    code: "EMPTY_NAME",
    httpCode: 400,
    message: "Ups! Nama-nya belum diisi",
  };

  public static readonly EMPTY_EMAIL: ErrorStructureType = {
    code: "EMPTY_EMAIL",
    httpCode: 400,
    message: "Ups! Email-nya belum diisi",
  };

  public static readonly EMPTY_PHONE: ErrorStructureType = {
    code: "EMPTY_PHONE",
    httpCode: 400,
    message: "Ups! Nomor telepon-nya belum diisi",
  };

  public static readonly EMPTY_RECEIVER: ErrorStructureType = {
    code: "EMPTY_RECEIVER",
    httpCode: 400,
    message: "Ups! Penerima-nya belum diisi",
  };

  public static readonly EMPTY_BANK_ACCOUNT: ErrorStructureType = {
    code: "EMPTY_BANK_ACCOUNT",
    httpCode: 400,
    message: "Ups! Nomor rekening-nya belum diisi",
  };

  public static readonly EMPTY_INVOICES: ErrorStructureType = {
    code: "EMPTY_INVOICES",
    httpCode: 400,
    message: "Ups! Invoice-nya belum diisi",
  };

  public static readonly EMPTY_PAYMENT_METHOD: ErrorStructureType = {
    code: "EMPTY_PAYMENT_METHOD",
    httpCode: 400,
    message: "Ups! Metode pembayaran-nya belum diisi",
  };

  public static readonly EMPTY_PAYMENT_SCHEME: ErrorStructureType = {
    code: "EMPTY_PAYMENT_SCHEME",
    httpCode: 400,
    message: "Ups! Metode pembayaran-nya belum diisi",
  };

  // New business account validation error codes
  public static readonly COMPANY_NAME_EMPTY: ErrorStructureType = {
    code: "COMPANY_NAME_EMPTY",
    httpCode: 400,
    message: "Ups! Nama perusahaan belum diisi",
  };

  public static readonly COMPANY_EMAIL_EMPTY: ErrorStructureType = {
    code: "COMPANY_EMAIL_EMPTY",
    httpCode: 400,
    message: "Ups! Email perusahaan belum diisi",
  };

  public static readonly COMPANY_PHONE_NUMBER_EMPTY: ErrorStructureType = {
    code: "COMPANY_PHONE_NUMBER_EMPTY",
    httpCode: 400,
    message: "Ups! Nomor telepon perusahaan belum diisi",
  };

  public static readonly COMPANY_PROVINCE_EMPTY: ErrorStructureType = {
    code: "COMPANY_PROVINCE_EMPTY",
    httpCode: 400,
    message: "Ups! Provinsi perusahaan belum dipilih",
  };

  public static readonly COMPANY_CITY_EMPTY: ErrorStructureType = {
    code: "COMPANY_CITY_EMPTY",
    httpCode: 400,
    message: "Ups! Kota perusahaan belum dipilih",
  };

  public static readonly COMPANY_DISTRICT_EMPTY: ErrorStructureType = {
    code: "COMPANY_DISTRICT_EMPTY",
    httpCode: 400,
    message: "Ups! Kecamatan perusahaan belum dipilih",
  };

  public static readonly COMPANY_SUBDISTRICT_EMPTY: ErrorStructureType = {
    code: "COMPANY_SUBDISTRICT_EMPTY",
    httpCode: 400,
    message: "Ups! Kelurahan perusahaan belum dipilih",
  };

  public static readonly COMPANY_ADDRESS_EMPTY: ErrorStructureType = {
    code: "COMPANY_ADDRESS_EMPTY",
    httpCode: 400,
    message: "Ups! Alamat perusahaan belum diisi",
  };

  public static readonly COMPANY_DEED_OF_ESTABLISHMENT_EMPTY: ErrorStructureType = {
    code: "COMPANY_DEED_OF_ESTABLISHMENT_EMPTY",
    httpCode: 400,
    message: "Ups! Akta Pendirian perusahaan belum diunggah",
  };

  public static readonly COMPANY_BUSINESS_IDENTIFICATION_NUMBER_EMPTY: ErrorStructureType = {
    code: "COMPANY_BUSINESS_IDENTIFICATION_NUMBER_EMPTY",
    httpCode: 400,
    message: "Ups! NIB perusahaan belum diunggah",
  };

  public static readonly DIRECTOR_NATIONAL_IDENTITY_CARD_EMPTY: ErrorStructureType = {
    code: "DIRECTOR_NATIONAL_IDENTITY_CARD_EMPTY",
    httpCode: 400,
    message: "Ups! KTP Direktur belum diunggah",
  };

  public static readonly COMPANY_FINANCIAL_OR_BANK_STATEMENT_REQUIRED: ErrorStructureType = {
    code: "COMPANY_FINANCIAL_OR_BANK_STATEMENT_REQUIRED",
    httpCode: 400,
    message: "Ups! Laporan keuangan atau rekening koran perusahaan harus diunggah salah satu",
  };

  public static readonly HTTP_ERROR: ErrorStructureType = { code: "HTTP_ERROR", httpCode: 500, message: "HTTP error" };

  public static readonly VALIDATION_FAILED: ErrorStructureType = {
    code: "VALIDATION_FAILED",
    httpCode: 400,
    message: "Validation failed",
  };
  public static readonly FILE_NOT_FOUND: ErrorStructureType = {
    code: "FILE_NOT_FOUND",
    httpCode: 400,
    message: "File not found",
  };
  public static readonly ACCOUNT_NOT_VERIFIED: ErrorStructureType = {
    code: "ACCOUNT_NOT_VERIFIED",
    httpCode: 403,
    message: "Account not verified",
  };
  public static readonly DUPLICATE_ENTRY: ErrorStructureType = {
    code: "DUPLICATE_ENTRY",
    httpCode: 409,
    message:
      "Email atau informasi yang kamu masukkan ternyata sudah terdaftar. Silakan gunakan data lain dan coba kembali.",
  };
  public static readonly DUPLICATE_IDENTITY: ErrorStructureType = {
    code: "DUPLICATE_IDENTITY",
    httpCode: 409,
    message:
      "Email atau informasi yang kamu masukkan ternyata sudah terdaftar. Silakan gunakan data lain dan coba kembali.",
  };
  public static readonly DB_UPDATE_FAILED: ErrorStructureType = {
    code: "DB_UPDATE_FAILED",
    httpCode: 500,
    message: "DB update failed",
  };
  public static readonly DB_INSERT_FAILED: ErrorStructureType = {
    code: "DB_INSERT_FAILED",
    httpCode: 500,
    message: "DB insert failed",
  };
  public static readonly DB_HARD_DELETE_FAILED: ErrorStructureType = {
    code: "DB_HARD_DELETE_FAILED",
    httpCode: 500,
    message: "DB hard delete failed",
  };
  public static readonly FORBIDDEN: ErrorStructureType = { code: "FORBIDDEN", httpCode: 403, message: "Forbidden" };
  public static readonly NO_VALID_SESSION: ErrorStructureType = {
    code: "NO_VALID_SESSION",
    httpCode: 403,
    message: "No valid session",
  };
  public static readonly UNKNOWN: ErrorStructureType = { code: "UNKNOWN", httpCode: 500, message: "Unknown error" };
  public static readonly SERVICE_NOT_FOUND: ErrorStructureType = {
    code: "SERVICE_NOT_FOUND",
    httpCode: 500,
    message: "Service not found",
  };
  public static readonly NOT_UPDATED: ErrorStructureType = {
    code: "NOT_UPDATED",
    httpCode: 500,
    message: "Not updated",
  };
  public static readonly NOT_FOUND: ErrorStructureType = { code: "NOT_FOUND", httpCode: 404, message: "Not found" };
  public static readonly NOT_IMPLEMENTED: ErrorStructureType = {
    code: "NOT_IMPLEMENTED",
    httpCode: 500,
    message: "Not Implemented",
  };

  public static readonly INVALID_HOOK_CALL = {
    code: "INVALID_HOOK_CALL",
    httpCode: 400,
    message: "A hook must be used in the same component as the one that calls it.",
  };

  public static readonly INVALID_BUSINESS_ACCOUNT_HOOK_CALL = {
    code: "INVALID_BUSINESS_ACCOUNT_HOOK_CALL",
    httpCode: 400,
    message: "useBusinessAccountData must be used in business account flow",
  };

  public static readonly INVALID_PERSONAL_ACCOUNT_HOOK_CALL = {
    code: "INVALID_PERSONAL_ACCOUNT_HOOK_CALL",
    httpCode: 400,
    message: "usePersonalAccountData must be used in personal account flow",
  };

  public static readonly INVALID_TAX_TYPE = {
    code: "INVALID_TAX_TYPE",
    httpCode: 400,
    message: "Invalid tax type",
  };

  public static readonly INVALID_IDENTITY_NUMBER: ErrorStructureType = {
    code: "INVALID_IDENTITY_NUMBER",
    httpCode: 400,
    message: "NIK harus terdiri dari 16 digit",
  };

  public static readonly INVALID_INVOICE_DATE: ErrorStructureType = {
    code: "INVALID_INVOICE_DATE",
    httpCode: 400,
    message: "Tanggal invoice tidak valid. Coba cek kembali",
  };

  public static readonly INVALID_PAY_IN_TYPE: ErrorStructureType = {
    code: "INVALID_PAY_IN_TYPE",
    httpCode: 400,
    message: "Invalid pay in type",
  };

  public static readonly INVALID_OTP: ErrorStructureType = {
    code: "INVALID_OTP",
    httpCode: 400,
    message: "Invalid OTP",
  };

  public static readonly INVALID_INSTANCE: ErrorStructureType = {
    code: "INVALID_INSTANCE",
    httpCode: 500,
    message: "Invalid instance",
  };

  public static readonly INVALID_USER_PROFILE: ErrorStructureType = {
    code: "INVALID_USER_PROFILE",
    httpCode: 400,
    message: "Invalid user profile",
  };

  public static readonly INVALID_RE_PASSWORD: ErrorStructureType = {
    code: "INVALID_RE_PASSWORD",
    httpCode: 400,
    message: "Ups! Password-nya nggak cocok",
  };

  public static readonly INVALID_PASSWORD: ErrorStructureType = {
    code: "INVALID_PASSWORD",
    httpCode: 400,
    message: "Password harus minimal 8 karakter, dengan 1 huruf besar, 1 angka, dan 1 simbol ya!",
  };

  public static readonly INVALID_PHONE_NUMBER: ErrorStructureType = {
    code: "INVALID_PHONE_NUMBER",
    httpCode: 400,
    message: "Ups! Nomor telepon-nya tidak valid",
  };

  public static readonly INVALID_EMAIL: ErrorStructureType = {
    code: "INVALID_EMAIL",
    httpCode: 400,
    message: "Ups! Email-nya tidak valid",
  };

  public static readonly RESOURCE_EXPIRED: ErrorStructureType = {
    code: "RESOURCE_EXPIRED",
    httpCode: 400,
    message: "Resource expired",
  };

  public static readonly HOTP_TOKEN_CREATION_FAILED: ErrorStructureType = {
    code: "HOTP_TOKEN_CREATION_FAILED",
    httpCode: 500,
    message: "Failed to create OTP",
  };

  public static readonly TRANSACTION_LIMIT_REACHED: ErrorStructureType = {
    code: "TRANSACTION_LIMIT_REACHED",
    httpCode: 400,
    message: "Transaction limit reached",
  };

  public static readonly NO_ASSOCIATED_ACCOUNTS: ErrorStructureType = {
    code: "NO_ASSOCIATED_ACCOUNTS",
    httpCode: 404,
    message: "No associated accounts for user",
  };

  public static readonly PAYMENT_METHOD_DISABLED: ErrorStructureType = {
    code: "PAYMENT_METHOD_DISABLED",
    httpCode: 400,
    message: "Metode pembayaran tidak tersedia. Pilih metode lain.",
  };

  public static readonly INSUFFICIENT_STOCK: ErrorStructureType = {
    code: "INSUFFICIENT_STOCK",
    httpCode: 400,
    message: "Stok tidak mencukupi untuk beberapa item.",
  };

  public static readonly RECIPE_NOT_DEFINED: ErrorStructureType = {
    code: "RECIPE_NOT_DEFINED",
    httpCode: 400,
    message: "Resep produk belum lengkap. Lengkapi resep sebelum dijual.",
  };

  public static readonly IDEMPOTENCY_KEY_CONFLICT: ErrorStructureType = {
    code: "IDEMPOTENCY_KEY_CONFLICT",
    httpCode: 409,
    message: "Permintaan duplikat dengan isi berbeda. Coba lagi.",
  };

  public static readonly IDEMPOTENCY_KEY_IN_PROGRESS: ErrorStructureType = {
    code: "IDEMPOTENCY_KEY_IN_PROGRESS",
    httpCode: 409,
    message: "Transaksi sebelumnya masih diproses. Mohon tunggu sebentar.",
  };

  public static readonly FUND_RECIPIENT_NOT_CONFIGURED: ErrorStructureType = {
    code: "FUND_RECIPIENT_NOT_CONFIGURED",
    httpCode: 400,
    message: "Operator belum mengatur rekening penerima. Hubungi pemilik akun untuk melengkapi pengaturan.",
  };

  public static readonly PAY_IN_NOT_SUPPORTED: ErrorStructureType = {
    code: "PAY_IN_NOT_SUPPORTED",
    httpCode: 400,
    message: "Metode pembayaran ini belum didukung di POS.",
  };

  public static readonly NORMAL_BALANCE_HINT: ErrorStructureType = {
    code: "NORMAL_BALANCE_HINT",
    httpCode: 422,
    message: "Beberapa akun diisi pada sisi debit/kredit yang salah.",
  };

  public static readonly PERIOD_CLOSED: ErrorStructureType = {
    code: "PERIOD_CLOSED",
    httpCode: 409,
    message: "Periode untuk tanggal ini sudah ditutup.",
  };

  public static readonly PERIOD_ALREADY_CLOSED: ErrorStructureType = {
    code: "PERIOD_ALREADY_CLOSED",
    httpCode: 409,
    message: "Periode ini sudah terkunci.",
  };

  public static readonly PERIOD_NOT_CLOSED: ErrorStructureType = {
    code: "PERIOD_NOT_CLOSED",
    httpCode: 409,
    message: "Periode ini masih terbuka.",
  };

  public static readonly PERIOD_NOT_DRAINED: ErrorStructureType = {
    code: "PERIOD_NOT_DRAINED",
    httpCode: 422,
    message:
      "Periode belum bisa dikunci. Pastikan semua proses pencatatan sudah selesai, dan untuk wajib pajak PPh Final, entri PPh Final (akun 8110) sudah diposting sebelum batas setor.",
  };

  public static readonly IDEMPOTENCY_KEY_REQUIRED: ErrorStructureType = {
    code: "IDEMPOTENCY_KEY_REQUIRED",
    httpCode: 400,
    message: "Terjadi gangguan teknis. Silakan coba lagi.",
  };

  public static readonly SEEDED_ACCOUNT_IMMUTABLE_FIELDS: ErrorStructureType = {
    code: "SEEDED_ACCOUNT_IMMUTABLE_FIELDS",
    httpCode: 409,
    message: "Kode dan tipe akun bawaan tidak dapat diubah untuk menjaga integritas jurnal.",
  };

  public static readonly ACCOUNT_HAS_JOURNAL_LINES: ErrorStructureType = {
    code: "ACCOUNT_HAS_JOURNAL_LINES",
    httpCode: 409,
    message: "Akun ini memiliki baris jurnal yang terkait. Hapus atau pindahkan entri jurnal terkait terlebih dahulu.",
  };

  public static readonly ACCOUNT_REFERENCED_BY_MAPPING: ErrorStructureType = {
    code: "ACCOUNT_REFERENCED_BY_MAPPING",
    httpCode: 409,
    message: "Akun ini digunakan dalam Pemetaan Akun. Perbarui pemetaan akun terlebih dahulu sebelum menghapus akun ini.",
  };

  public static readonly CODE_RESERVED: ErrorStructureType = {
    code: "CODE_RESERVED",
    httpCode: 400,
    message: "Kode ini termasuk dalam rentang yang dicadangkan sistem. Pilih kode lain.",
  };

  public static find(code: string): ErrorStructureType | undefined {
    return Object.values(ErrorCodes).find((error) => error.code === code);
  }
}

export class ServerError extends Error {
  public code: string;
  public httpCode: number;
  public message: string;
  public details: Record<string, any>;

  constructor(code: ErrorStructureType, details?: Record<string, any>) {
    super(code.message);
    this.code = code.code;
    this.httpCode = code.httpCode;
    this.message = details?.message ?? code.message;
    this.details = Object.assign({}, { code: code.code, message: code.message }, details);
  }
}
