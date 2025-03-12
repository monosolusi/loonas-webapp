type ErrorStructureType = { code: string; httpCode: number; message: string };

export class ErrorCodes {
  public static readonly INCOMPLETE_FORM = { code: "INCOMPLETE_FORM", httpCode: 400, message: "Incomplete form" };
  public static readonly INVALID_PASSWORD = {
    code: "INVALID_PASSWORD",
    httpCode: 400,
    message: "Password harus minimal 8 karakter, dengan 1 huruf besar, 1 angka, dan 1 simbol ya!"
  };
  public static readonly EMPTY_PASSWORD = {
    code: "EMPTY_PASSWORD",
    httpCode: 400,
    message: "Ups! Password-nya belum diisi"
  };
  public static readonly INVALID_RE_PASSWORD = {
    code: "INVALID_RE_PASSWORD",
    httpCode: 400,
    message: "Ups! Password-nya nggak cocok"
  };
  public static readonly HTTP_ERROR = { code: "HTTP_ERROR", httpCode: 500, message: "HTTP error" };
  public static readonly VALIDATION_FAILED = { code: "VALIDATION_FAILED", httpCode: 400, message: "Validation failed" };
  public static readonly FILE_NOT_FOUND = { code: "FILE_NOT_FOUND", httpCode: 400, message: "File not found" };
  public static readonly ACCOUNT_NOT_VERIFIED = {
    code: "ACCOUNT_NOT_VERIFIED",
    httpCode: 403,
    message: "Account not verified"
  };
  public static readonly DUPLICATE_ENTRY = { code: "DUPLICATE_ENTRY", httpCode: 409, message: "Duplicate entry" };
  public static readonly DUPLICATE_IDENTITY = {
    code: "DUPLICATE_IDENTITY",
    httpCode: 409,
    message: "Duplicate identity"
  };
  public static readonly DB_UPDATE_FAILED = { code: "DB_UPDATE_FAILED", httpCode: 500, message: "DB update failed" };
  public static readonly DB_INSERT_FAILED = { code: "DB_INSERT_FAILED", httpCode: 500, message: "DB insert failed" };
  public static readonly DB_HARD_DELETE_FAILED = {
    code: "DB_HARD_DELETE_FAILED",
    httpCode: 500,
    message: "DB hard delete failed"
  };
  public static readonly FORBIDDEN = { code: "FORBIDDEN", httpCode: 403, message: "Forbidden" };
  public static readonly NO_VALID_SESSION = { code: "NO_VALID_SESSION", httpCode: 403, message: "No valid session" };
  public static readonly UNKNOWN = { code: "UNKNOWN", httpCode: 500, message: "Unknown error" };
  public static readonly SERVICE_NOT_FOUND = { code: "SERVICE_NOT_FOUND", httpCode: 500, message: "Service not found" };
  public static readonly NOT_UPDATED = { code: "NOT_UPDATED", httpCode: 500, message: "Not updated" };
  public static readonly NOT_FOUND = { code: "NOT_FOUND", httpCode: 404, message: "Not found" };
  public static readonly NOT_IMPLEMENTED = { code: "NOT_IMPLEMENTED", httpCode: 500, message: "Not Implemented" };
  public static readonly INVALID_OTP = { code: "INVALID_OTP", httpCode: 400, message: "Invalid OTP" };
  public static readonly INVALID_INSTANCE = { code: "INVALID_INSTANCE", httpCode: 500, message: "Invalid instance" };
  public static readonly INVALID_USER_PROFILE = {
    code: "INVALID_USER_PROFILE",
    httpCode: 400,
    message: "Invalid user profile"
  };
  public static readonly RESOURCE_EXPIRED = { code: "RESOURCE_EXPIRED", httpCode: 400, message: "Resource expired" };
  public static readonly HOTP_TOKEN_CREATION_FAILED = {
    code: "HOTP_TOKEN_CREATION_FAILED",
    httpCode: 500,
    message: "Failed to create OTP"
  };
  public static readonly INVALID_PHONE_NUMBER = {
    code: "INVALID_PHONE_NUMBER",
    httpCode: 400,
    message: "Invalid phone number"
  };
  public static readonly TRANSACTION_LIMIT_REACHED = {
    code: "TRANSACTION_LIMIT_REACHED",
    httpCode: 400,
    message: "Transaction limit reached"
  };
  public static readonly NO_ASSOCIATED_ACCOUNTS = {
    code: "NO_ASSOCIATED_ACCOUNTS",
    httpCode: 404,
    message: "No associated accounts for user"
  };
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