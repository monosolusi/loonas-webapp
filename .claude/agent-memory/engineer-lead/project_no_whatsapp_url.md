---
name: no-whatsapp-url-constant
description: No WhatsApp deep-link/URL or PkvWhatsAppPanel exists anywhere in the FE; only support@loonas.com email + generic "hubungi support" copy. Any "contact via WhatsApp" CTA needs a canonical number supplied by PM/UID.
metadata:
  type: project
---

As of 2026-06-19 (LNS-344): there is **no WhatsApp URL/deep-link constant** anywhere in `src`. Grep for `wa.me` / `api.whatsapp` / `whatsapp.com` / `+62` / `628...` returns zero URL literals. There is **no `PkvWhatsAppPanel` component** (the LNS-344 UI spec referenced it as "existing" — it does not exist).

What DOES exist: `SendViaWhatsappCheckbox` (invoices) — a notification-channel toggle, NOT a contact link, carries no Loonas number. Support contact patterns in the app are `support@loonas.com` (mailto, onboarding/kyc-summary) and generic "hubungi support/customer support" copy.

**Why:** LNS-344 Item B2 (AccumulatedDeficitBlock) CTA "Hubungi Loonas via WhatsApp" needs a real deep-link. The locked UI spec assumed a reusable URL that isn't there.

**How to apply:** Any future "contact Loonas via WhatsApp" CTA is BLOCKED on PM/UID supplying the canonical WhatsApp business number/deep-link (or redirecting to `support@loonas.com`). Do not invent a phone number. When supplied, extract a shared `LOONAS_WHATSAPP_URL` constant (suggest `src/core/utilities/contact.ts` or similar) since this is the first consumer.
