---
name: create-pos-payment-method
description: |
  Scaffold a new POS payment-method plugin under
  src/app/(pos)/pos/_payment-methods/{type}/ and register it in
  registry.ts. Use when the cashier wizard needs to support a new payment
  type (QRIS, EDC, e-wallet, voucher, etc.).

  Triggers: "add POS payment method", "new POS payment method", "create
  payment handler", "add payment plugin", "buat metode pembayaran POS",
  "tambah metode pembayaran POS".

  DO NOT use this for:
  - The existing `src/features/payment/` feature (used by the pay-in /
    incoming-invoice flow, not POS).
  - Editing the wizard chrome itself (header, step transitions, layout).
    If the contract needs to evolve, that is a separate refactor.
---

# Create POS Payment-Method Plugin

This skill scaffolds a new payment method using the plugin pattern in
`src/app/(pos)/pos/_payment-methods/`. The wizard chrome stays untouched;
only the per-method folder + a one-line registration are added.

## Mandatory reads (in order)

Before generating any code:

1. **`src/app/(pos)/pos/_payment-methods/PLUGIN_PATTERN.md`** — the contract
   and rationale. The skill never restates what's in the doc; it cites it.
2. **`src/app/(pos)/pos/_payment-methods/types.ts`** — the
   `PaymentMethodHandler` interface.
3. **`src/app/(pos)/pos/_payment-methods/cash/`** — the canonical reference
   implementation. When generating each new file, read the matching
   `cash-*.{ts,tsx}` first and mirror its structure.
4. **`src/app/(pos)/pos/_payment-methods/registry.ts`** — the only file
   modified outside the new method folder.

## Inputs to gather from the user

Ask before scaffolding:

| Input | Purpose | Example |
|---|---|---|
| `type` | Matches the BE's `paymentGateway.type`, lowercase | `qris`, `edc`, `voucher` |
| `displayLabelFallback` | Shown when the BE omits `title` | `"QRIS"`, `"Kartu Debit"` |
| `initialStep` | `"nominal"` (cash-like) or `"confirm"` (instant) | `"confirm"` for QRIS |
| Method-local state | What needs to flow between nominal & confirm | QRIS: QR URL + status |
| Any extra POST fields | Per-method fields the BE needs | (usually none for v1 methods) |

If the user says "just like Cash" → `initialStep = "nominal"` and clone the
state shape. If they say "just like QRIS" → `initialStep = "confirm"` and
ask about QR generation / polling.

## Files to generate

For a method of type `{type}`:

1. **`{type}/{type}-handler.ts`** — required.
   - Read `cash/cash-handler.ts` first; mirror it.
   - Export a single `{type}Handler` of type `PaymentMethodHandler`.
2. **`{type}/{type}-context.tsx`** — only if state must flow between the
   nominal and confirm steps.
   - Read `cash/cash-context.tsx` first; mirror it.
   - Export `{Type}Provider` and `use{Type}()` hook with a non-null guard.
3. **`{type}/{type}-nominal-step.tsx`** — only if `initialStep === "nominal"`.
   - Read `cash/cash-nominal-step.tsx` first; mirror it.
   - Consume `usePos()` for cart/method/transitions and `use{Type}()` for
     method-local state.
   - Submit advances via `usePos().goToConfirm()`.
4. **`{type}/{type}-confirm-step.tsx`** — required.
   - Read `cash/cash-confirm-step.tsx` first; mirror it.
   - Submit calls `usePos().completeTransaction()` and routes to
     `/pos/receipt/${id}` on success.
   - If your method has an invariant that can break mid-confirm (cash
     uses tendered < total), add a `useEffect` that bounces back via
     `goBackToNominal()`.

## Registry update

Append to `_payment-methods/registry.ts`:

```ts
import { {type}Handler } from "@/app/(pos)/pos/_payment-methods/{type}/{type}-handler";

const HANDLERS: PaymentMethodHandler[] = [cashHandler, {type}Handler];
```

That is the only edit outside the new folder.

## Files NOT to modify

The wizard chrome and contract are off-limits. If you find yourself
needing to edit any of these, **stop and ask the user** — it usually
means the plugin pattern itself needs to evolve.

- `src/app/(pos)/pos/_components/checkout-panel.tsx`
- `src/app/(pos)/pos/_components/checkout-handler-step.tsx`
- `src/app/(pos)/pos/_components/checkout-header.tsx`
- `src/app/(pos)/pos/_components/checkout-step-method.tsx` and
  `checkout-step-method-body-*.tsx`
- `src/app/(pos)/pos/_components/checkout-step-unsupported.tsx`
- `src/app/(pos)/pos/_providers/pos-provider.tsx`
- `src/app/(pos)/pos/_providers/pos-provider.types.ts`
- `src/app/(pos)/pos/_payment-methods/types.ts`
- `src/app/(pos)/pos/_payment-methods/cash/*` (reference impl — keep clean)

## Don'ts

- **Don't import from another method's folder.** Each handler is self-
  contained. Shared helpers go to `_payment-methods/` root or `core/`.
- **Don't put method-specific state in `PosProvider`.** That's what your
  method's context is for. Golden rule: if only your method's components
  read it, it's method-local.
- **Don't hardcode a `type` comparison anywhere outside the registry.**
  The registry's `getPaymentMethodHandler()` is the single dispatch site.
- **Don't render a step component outside `<handler.Provider>` if it
  relies on the context.** The wizard's `CheckoutHandlerStep` already
  wraps the body — keep your step components shallow consumers.

## Verification

After scaffolding:

1. `npx tsc --noEmit` — must be clean.
2. `npm run lint` — must be clean (only the pre-existing `app/layout.tsx`
   font warning is acceptable).
3. Manual smoke test on `/pos`:
   - The new method appears as a chip/card in step 1 when the BE has it
     enabled.
   - Picking it advances to the right initial step.
   - The submit button on the confirm step calls
     `completeTransaction()` and routes to `/pos/receipt/<id>`.
   - The receipt renders the new method's title in `paymentGateway.title`.
4. Edge-case checks:
   - Disable the method on the BE → it stops appearing.
   - Set `requires_scheme_selection: true` on the BE → it appears
     disabled with the "Belum didukung" tooltip.
   - Send the BE `type` in mixed casing → still routes correctly (the
     registry normalizes to lowercase).

## See also

- `.claude/skills/create-component/SKILL.md` — for each new step file's
  component scaffolding (one-component-per-file rule, `clsx`, `h-11`, etc.).
- `.claude/skills/create-provider/SKILL.md` — for the per-method
  `Provider` + `use{Name}()` hook pattern.
- `CLAUDE.md` § Component architecture, § Provider pattern, § File naming —
  for codebase-wide rules every new file inherits.
