export type CoaAccountRef = {
  id: string;
  code: string;
  name: string;
};

/**
 * A single BE-diagnosed cause behind a period close refusal. Shared verbatim by the close 422
 * diagnosis (`blocking_postings` on `PERIOD_HAS_FAILED_POSTINGS` / `PERIOD_NOT_DRAINED`) and the
 * retry outcome (`still_failing` on `POST .../retry-failed-postings`) — one type, one set of
 * derivation rules serves both (see `domain/helpers/blocking-posting.ts`).
 *
 * `errorCode` is nullable: `null` means the server could not attribute a cause at all — it does
 * NOT mean "overhead collision". `coaAccount` is populated only when `errorCode` identifies an
 * overhead-account refusal AND the account still resolves; a resolved refusal whose account was
 * since deleted still carries the code with a null account.
 *
 * `sourceTable` / `outboxId` are internal diagnostics, deliberately never rendered to merchants.
 */
export type BlockingPosting = {
  sourceTable: string;
  outboxId: string;
  errorCode: string | null;
  coaAccount: CoaAccountRef | null;
};
