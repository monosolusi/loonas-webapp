---
name: terminology-lock-struk
description: Project-wide Bahasa terminology lock for POS/receipt surfaces — "Struk" not "Resi", plus the core lexicon ratified at LNS-199 (UNOFEST pilot)
metadata:
  type: project
---

**Project-wide Bahasa terminology lock for all customer-facing POS surfaces.** Ratified on LNS-199 (UNOFEST Tier-2 pilot, 2026-05-21).

Locked terms:
- **Struk** — the receipt (NOT "Resi", which reads as logistics/shipping in ID)
- **Total** — order total
- **Bayar Tunai** — pay with cash
- **Bayar QRIS** — pay via QRIS
- **Kembalian** — change due
- **WIB / WITA / WIT** — timezone labels (use the merchant's local zone, do not default to WIB silently)

**Why:** "Struk" is the universal Bahasa POS noun used by every Indonesian retail chain (Indomaret, Alfamart) and printed-receipt context. "Resi" carries strong logistics connotation (JNE, J&T, Lazada) and will erode trust at moment-of-payment, especially in Tier-2 cities where the customer expects a familiar receipt vocabulary. Inconsistency across surfaces (e.g., on-screen "Struk" + WhatsApp "Resi") is a credibility leak.

**How to apply:** Any new customer-facing POS surface — receipt body, receipt actions, history, exports, email notifications, WhatsApp share (LNS-28), refund flows, loyalty receipts — MUST inherit this lexicon. PMs should cite this lock in acceptance criteria. If a surface needs a term not on this list, escalate to CPO before shipping — do not invent local variants. Internal/operator-facing surfaces are not bound by this lock (operators can use ops vocabulary), but err on the side of consistency unless there's a strong reason.

Related: [[unofest-pilot]] [[indonesian-fintech-lexicon]]
