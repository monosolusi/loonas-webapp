---
name: no-whatsapp-url-constant
description: LOONAS_WHATSAPP_URL constant NOW exists at core/utilities/contact.ts (empty string, TODO pending real deep-link); reuse it + the AccumulatedDeficitBlock disabled-gating pattern for any WhatsApp CTA.
metadata:
  type: project
---

**Updated 2026-07-17 (LNS-457):** the shared constant `LOONAS_WHATSAPP_URL` now EXISTS at `src/core/utilities/contact.ts` — but its value is still the empty string `""` (`// TODO(LNS-344): canonical Loonas WhatsApp deep-link pending PM/UID`). So the real number is STILL not supplied; the constant just centralizes the seam.

Consumers today: `src/features/accounting/presentations/components/accumulated-deficit-block.tsx` and `src/app/(authenticated)/finance/opening-balance/_components/opening-balance-readonly.tsx`. There is still no `PkvWhatsAppPanel` component.

**Canonical reuse pattern (from `AccumulatedDeficitBlock`, verbatim behavior):** a `<button disabled={!LOONAS_WHATSAPP_URL} onClick={() => LOONAS_WHATSAPP_URL && window.open(LOONAS_WHATSAPP_URL, "_blank", "noopener,noreferrer")} aria-label="Hubungi tim Loonas melalui WhatsApp" className="… underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Hubungi Loonas via WhatsApp →</button>`. When URL is empty the link degrades disabled — hint text must stay meaningful without the link.

**How to apply:** Reuse `LOONAS_WHATSAPP_URL` + this disabled-gating pattern for any WhatsApp CTA. Recolor the link to the host callout's palette (e.g. `text-warning-500` inside a warning callout) rather than copying the deficit block's `text-error-500` — reuse the BEHAVIOR, adapt the color for coherence. The CTA still won't navigate until PM/UID fills in the real deep-link; do not invent a phone number.
