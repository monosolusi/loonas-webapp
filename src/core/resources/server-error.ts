type ErrorStructureType = { code: string; httpCode: number; message: string };

export class ErrorCodes {
  public static readonly NOT_AGREED = {
    code: "NOT_AGREED",
    httpCode: 400,
    message: "Kamu belum menyetujui Kebijakan Privasi dan Syarat & Ketentuan."
  };
  public static readonly ACCOUNT_VERIFICATION_REJECTED = {
    code: "ACCOUNT_VERIFICATION_REJECTED",
    httpCode: 403,
    message: "Account verification rejected"
  };

  public static readonly INCOMPLETE_FORM: ErrorStructureType = {
    code: "INCOMPLETE_FORM",
    httpCode: 400,
    message: "Incomplete form"
  };

  public static readonly EMPTY_PASSWORD: ErrorStructureType = {
    code: "EMPTY_PASSWORD",
    httpCode: 400,
    message: "Ups! Password-nya belum diisi"
  };

  public static readonly EMPTY_NAME: ErrorStructureType = {
    code: "EMPTY_NAME",
    httpCode: 400,
    message: "Ups! Nama-nya belum diisi"
  };

  public static readonly EMPTY_EMAIL: ErrorStructureType = {
    code: "EMPTY_EMAIL",
    httpCode: 400,
    message: "Ups! Email-nya belum diisi"
  };

  public static readonly EMPTY_PHONE: ErrorStructureType = {
    code: "EMPTY_PHONE",
    httpCode: 400,
    message: "Ups! Nomor telepon-nya belum diisi"
  };

  public static readonly HTTP_ERROR: ErrorStructureType = { code: "HTTP_ERROR", httpCode: 500, message: "HTTP error" };

  public static readonly VALIDATION_FAILED: ErrorStructureType = {
    code: "VALIDATION_FAILED",
    httpCode: 400,
    message: "Validation failed"
  };
  public static readonly FILE_NOT_FOUND: ErrorStructureType = {
    code: "FILE_NOT_FOUND",
    httpCode: 400,
    message: "File not found"
  };
  public static readonly ACCOUNT_NOT_VERIFIED: ErrorStructureType = {
    code: "ACCOUNT_NOT_VERIFIED",
    httpCode: 403,
    message: "Account not verified"
  };
  public static readonly DUPLICATE_ENTRY: ErrorStructureType = {
    code: "DUPLICATE_ENTRY",
    httpCode: 409,
    message: "Email atau informasi yang kamu masukkan ternyata sudah terdaftar. Silakan gunakan data lain dan coba kembali."
  };
  public static readonly DUPLICATE_IDENTITY: ErrorStructureType = {
    code: "DUPLICATE_IDENTITY",
    httpCode: 409,
    message: "Email atau informasi yang kamu masukkan ternyata sudah terdaftar. Silakan gunakan data lain dan coba kembali."
  };
  public static readonly DB_UPDATE_FAILED: ErrorStructureType = {
    code: "DB_UPDATE_FAILED",
    httpCode: 500,
    message: "DB update failed"
  };
  public static readonly DB_INSERT_FAILED: ErrorStructureType = {
    code: "DB_INSERT_FAILED",
    httpCode: 500,
    message: "DB insert failed"
  };
  public static readonly DB_HARD_DELETE_FAILED: ErrorStructureType = {
    code: "DB_HARD_DELETE_FAILED",
    httpCode: 500,
    message: "DB hard delete failed"
  };
  public static readonly FORBIDDEN: ErrorStructureType = { code: "FORBIDDEN", httpCode: 403, message: "Forbidden" };
  public static readonly NO_VALID_SESSION: ErrorStructureType = {
    code: "NO_VALID_SESSION",
    httpCode: 403,
    message: "No valid session"
  };
  public static readonly UNKNOWN: ErrorStructureType = { code: "UNKNOWN", httpCode: 500, message: "Unknown error" };
  public static readonly SERVICE_NOT_FOUND: ErrorStructureType = {
    code: "SERVICE_NOT_FOUND",
    httpCode: 500,
    message: "Service not found"
  };
  public static readonly NOT_UPDATED: ErrorStructureType = {
    code: "NOT_UPDATED",
    httpCode: 500,
    message: "Not updated"
  };
  public static readonly NOT_FOUND: ErrorStructureType = { code: "NOT_FOUND", httpCode: 404, message: "Not found" };
  public static readonly NOT_IMPLEMENTED: ErrorStructureType = {
    code: "NOT_IMPLEMENTED",
    httpCode: 500,
    message: "Not Implemented"
  };

  public static readonly INVALID_OTP: ErrorStructureType = {
    code: "INVALID_OTP",
    httpCode: 400,
    message: "Invalid OTP"
  };

  public static readonly INVALID_INSTANCE: ErrorStructureType = {
    code: "INVALID_INSTANCE",
    httpCode: 500,
    message: "Invalid instance"
  };

  public static readonly INVALID_USER_PROFILE: ErrorStructureType = {
    code: "INVALID_USER_PROFILE",
    httpCode: 400,
    message: "Invalid user profile"
  };

  public static readonly INVALID_RE_PASSWORD: ErrorStructureType = {
    code: "INVALID_RE_PASSWORD",
    httpCode: 400,
    message: "Ups! Password-nya nggak cocok"
  };

  public static readonly INVALID_PASSWORD: ErrorStructureType = {
    code: "INVALID_PASSWORD",
    httpCode: 400,
    message: "Password harus minimal 8 karakter, dengan 1 huruf besar, 1 angka, dan 1 simbol ya!"
  };

  public static readonly INVALID_PHONE_NUMBER: ErrorStructureType = {
    code: "INVALID_PHONE_NUMBER",
    httpCode: 400,
    message: "Ups! Nomor telepon-nya tidak valid"
  };

  public static readonly INVALID_EMAIL: ErrorStructureType = {
    code: "INVALID_EMAIL",
    httpCode: 400,
    message: "Ups! Email-nya tidak valid"
  };

  public static readonly RESOURCE_EXPIRED: ErrorStructureType = {
    code: "RESOURCE_EXPIRED",
    httpCode: 400,
    message: "Resource expired"
  };

  public static readonly HOTP_TOKEN_CREATION_FAILED: ErrorStructureType = {
    code: "HOTP_TOKEN_CREATION_FAILED",
    httpCode: 500,
    message: "Failed to create OTP"
  };

  public static readonly TRANSACTION_LIMIT_REACHED: ErrorStructureType = {
    code: "TRANSACTION_LIMIT_REACHED",
    httpCode: 400,
    message: "Transaction limit reached"
  };

  public static readonly NO_ASSOCIATED_ACCOUNTS: ErrorStructureType = {
    code: "NO_ASSOCIATED_ACCOUNTS",
    httpCode: 404,
    message: "No associated accounts for user"
  };

  public static readonly NO_SELECTED_ACCOUNT: ErrorStructureType = {
    code: "NO_SELECTED_ACCOUNT",
    httpCode: 404,
    message: "No selected account"
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
    this.message = code.message;
    this.details = Object.assign({}, { code: code.code, message: code.message }, details);
  }
}