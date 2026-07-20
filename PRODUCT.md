# Product

## Register

product

## Users

Indonesian SME owners and their staff (cashiers, admins, finance helpers) running the
whole business out of one app. Mixed technical fluency — the owner is rarely an
accountant, often on the move, and may hand specific screens (POS, invoicing, stock) to
employees. They are always in a task: get an invoice paid, ring up a sale, reconcile the
books, check what's owed. A smaller, separate audience of Loonas-internal staff uses the
`(internal)` routes for KYC review and transaction monitoring; merchant-facing screens are
the primary design target. Indonesian (`lang="id"`) is the default voice.

## Product Purpose

Loonas is an all-in-one operating system for Indonesian merchants. Its spine is payments —
turning an outstanding invoice into *lunas* (settled) via PayLater, Card, Virtual Account,
and QRIS — but the product wraps that money movement in everything needed to run the
business: POS, invoicing, inventory, production, purchasing, finance/accounting, fixed
costs, and tax, plus the compliance layer (KYC, transaction monitoring) that fintech
requires. Success is an owner trusting Loonas to be the single place their business lives:
breadth that never feels like twelve disconnected tools, and money numbers they never have
to second-guess.

## Brand Personality

**Trustworthy, precise, calm.** Bank-grade dependability with quiet confidence — you hand it
your money and your books without anxiety. The voice is clear and professional, plain
Indonesian over jargon, guidance over hand-holding. No drama, no flash: emphasis is earned
and reserved for state changes and money-moving moments, not decoration.

## References

The target feel is mature business-tools SaaS — the apps Indonesian owners already trust:

- **Mekari (Jurnal / Talenta)** — calm, blue-accented, generous whitespace, clean cards and
  tables, friendly-professional. An all-in-one Indonesian business suite that still feels
  like one coherent product.
- **Xero** — accounting SaaS clarity: strong data tables, unambiguous numbers, approachable
  hierarchy, restful blue. Dense where it must be, never cluttered.

The shared thread: serious, clean, data-clear tools that make finance feel calm and legible.

## Anti-references

Derived from what would betray the references and the trustworthy/precise/calm brand:

- **Generic templated SaaS** — cream/gray dashboards, identical icon-heading-text card
  grids, hero-metric tiles. The "AI made this" default and the biggest risk for an app this
  broad.
- **Loud crypto / neon fintech** — dark-mode neon gradients, glassmorphism, glow. Flash that
  undermines money-trust.
- **Cluttered legacy ERP** — SAP/Accurate-style grey enterprise screens, every field on one
  page, no hierarchy. The trap an all-in-one tool falls into.
- **Consumer toy / playful** — over-rounded, emoji-heavy, bouncy pastels. Too casual for
  finance and compliance.

## Design Principles

1. **Trust through clarity.** Money is the product. Amounts, statuses, and balances must be
   unambiguous and legible — never decorative, never guessed at. When in doubt, make the
   number easier to read.
2. **Breadth without clutter.** Twelve modules must feel like one product. A single,
   consistent component and interaction vocabulary across every screen is the thing that
   keeps an all-in-one OS calm instead of overwhelming. Consistency over surprise.
3. **Earned familiarity.** Behave like the business tools owners already trust (Mekari,
   Xero). Use standard affordances for standard tasks; the tool should disappear into the
   work, not announce itself.
4. **Approachable for non-experts.** The owner isn't an accountant. Plain Indonesian, sensible
   defaults, empty states that teach, and guidance that lowers intimidation — without
   dumbing the tool down for the staff who live in it daily.
5. **Calm confidence.** Quiet and dependable by default. Reserve color, weight, and motion
   for state and money-moving moments; restraint everywhere else.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**. Body text ≥4.5:1 against its background (mind the near-white
`#FAFAFA` surface and the darker-than-default neutral ramp); large/bold text ≥3:1. Visible
focus states and full keyboard navigation across forms, tables, and the POS. Honor
`prefers-reduced-motion` on every animation. Maintain 44px touch targets — already encoded
as the `h-11` interactive-height rhythm — for staff using the POS and mobile screens on the
shop floor. Status must never rely on color alone (pair with icon/label), given how much of
the product is financial state.
