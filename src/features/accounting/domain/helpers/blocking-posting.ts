import { ErrorCodes } from "@/core/resources/server-error";
import { BlockingPosting, CoaAccountRef } from "@/features/accounting/domain/entities/blocking-posting";

const OVERHEAD_COLLISION_CODE = ErrorCodes.OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED.code;

/**
 * True when `posting` names a specific, still-resolvable overhead account the merchant can act on
 * by deselecting it — the only case that can offer a deselect-then-retry remedy.
 */
export function isNamedOverheadAccountPosting(posting: BlockingPosting): boolean {
  return posting.errorCode === OVERHEAD_COLLISION_CODE && posting.coaAccount !== null;
}

/**
 * Dedup'd (by account id) list of overhead accounts a merchant can deselect on
 * `/accounting/overhead-accounts` to clear the block.
 */
export function deriveBlockingOverheadAccounts(postings: BlockingPosting[]): CoaAccountRef[] {
  const seen = new Map<string, CoaAccountRef>();
  for (const posting of postings) {
    if (isNamedOverheadAccountPosting(posting) && posting.coaAccount) {
      seen.set(posting.coaAccount.id, posting.coaAccount);
    }
  }
  return Array.from(seen.values());
}

/**
 * True when at least one blocking posting cannot be turned into a self-service deselect-then-retry
 * action — either the server could not attribute a cause (`errorCode: null`), attributed it to
 * something other than an overhead-account collision, or attributed it to a collision whose account
 * no longer resolves. Support (the WhatsApp escalation hint) is the only remaining remedy for these.
 */
export function hasUnattributedBlockingPosting(postings: BlockingPosting[]): boolean {
  return postings.some((posting) => !isNamedOverheadAccountPosting(posting));
}
