# POS Payment-Method Plugin Pattern

This folder hosts a strategy/plugin pattern for POS payment methods. Each
payment method is a self-contained "handler" that the wizard discovers via a
registry. **The wizard chrome (header, step layout, transitions, error
handling) does not change when a new method is added.**

## Why

The cashier wizard has three steps — `method` → `nominal` → `confirm` — but
not every payment method follows the same path. Cash needs a tendered-amount
step; QRIS jumps straight to confirm with a QR display; future methods
(EDC, e-wallet, voucher) will each have unique nominal/confirm UX.

If the wizard core had to know about every method, every new method would
edit shared files, accumulate `if (type === "cash")` branches, and risk
breaking other methods. Instead, the wizard delegates the per-step body to
whatever handler the registry returns.

## Mental model

Three concepts:

- **`PaymentMethodHandler`** — the contract a method exposes (`type`,
  `initialStep`, optional `Provider`, optional `NominalComponent`, required
  `ConfirmComponent`).
- **`registry.ts`** — a list of handlers + a case-insensitive lookup keyed by
  `paymentGateway.type` from the BE.
- **Per-method `Provider`** — owns state shared across that method's steps
  (e.g. cash owns `tenderedAmount`). Mounted by the wizard while the user is
  on the `nominal` or `confirm` step for that method.

## Anatomy of a method folder

```
_payment-methods/
├── PLUGIN_PATTERN.md          # this file
├── types.ts                   # PaymentMethodHandler interface
├── registry.ts                # HANDLERS array + getPaymentMethodHandler()
└── {type}/                    # one folder per method
    ├── {type}-handler.ts      # the handler object (registered into registry)
    ├── {type}-context.tsx     # optional — per-method shared state
    ├── {type}-nominal-step.tsx # optional — only when initialStep === "nominal"
    └── {type}-confirm-step.tsx # required
```

## `PaymentMethodHandler` reference

```ts
export type PaymentHandlerStep = "method" | "nominal" | "confirm";

export type CancelGuardConfig = {
  title: string;
  description: string;
  confirmLabel: string;
};

export type PaymentMethodHandler = {
  /** Identifier matched against paymentGateway.type (case-insensitive). */
  type: string;
  /** Ordered list of steps for this method. Always begins with "method". */
  steps: PaymentHandlerStep[];
  /** Step the wizard advances to after this method is picked. Must be in `steps`. */
  initialStep: Exclude<PaymentHandlerStep, "method">;
  /** Optional wrapper that owns method-specific state shared across steps. */
  Provider?: ComponentType<{ children: ReactNode }>;
  /** Body for the "nominal" step. Required iff `steps` contains "nominal". */
  NominalComponent?: ComponentType;
  /** Body for the "confirm" step. */
  ConfirmComponent: ComponentType;
  /** When defined, ✕ on the wizard header opens a confirmation dialog before cancelling. */
  cancelGuard?: CancelGuardConfig;
};
```

Field rules:

- `type` — lowercase, matches what the BE returns. Case-insensitive matching
  is done by the registry, but keep the canonical form lowercase.
- `steps` — every method's step list begins with `"method"` (the picker step
  the wizard always renders), followed by zero or more method-specific steps
  that end at `"confirm"`. Cash uses `["method", "nominal", "confirm"]`; QRIS
  would use `["method", "confirm"]`. The wizard's back-button derives its
  destination from this array.
- `initialStep` — what the wizard advances to after the cashier picks this
  method. `"nominal"` for tendered/cash-like methods; `"confirm"` for
  digital/instant methods (QR, e-wallet) where the customer pays the exact
  total without a "diterima" amount.
- `Provider` — present only if the method has shared state across nominal
  and confirm. If the only state is in the confirm step, keep it local with
  `useState` and skip the provider.
- `NominalComponent` — present iff `steps` contains `"nominal"`.
- `ConfirmComponent` — always present. The submit button (calls
  `usePos().completeTransaction()`) lives here.
- `cancelGuard` — set when the cashier should be warned before ✕ closes the
  wizard mid-flow (e.g. QRIS may have a payment in flight). When defined, the
  header opens a `ConfirmationDialog` with the supplied copy. Cash omits this
  field — ✕ exits immediately.

## Step-by-step: add a new method

1. **Pick the `type`** — match the BE's `paymentGateway.type` exactly,
   lowercase.
2. **Pick the `initialStep`** — `"nominal"` if you need the cashier to enter
   a number before confirming, otherwise `"confirm"`.
3. **Decide the state model** — does anything need to flow between the
   nominal and confirm steps for this method? If yes, build a context. If
   no, skip the context (`Provider` stays undefined on the handler).
4. **Build the step components** — they consume `usePos()` for cart total,
   selected method, and step transitions; they consume your method's context
   (if present) for method-local state.
5. **Export the handler** in `{type}/{type}-handler.ts`.
6. **Register the handler** by appending it to the `HANDLERS` array in
   `_payment-methods/registry.ts`.

That's it. The wizard picks up the new handler automatically.

## State scoping rules

| State | Where it lives | Reason |
|---|---|---|
| Cart items, total | `PosProvider` | Used everywhere (picker, cart, every step) |
| Selected payment method id | `PosProvider` | The wizard core needs to look up the handler |
| `checkoutStep` | `PosProvider` | The wizard core drives transitions |
| Idempotency key | `PosProvider` | Owned by the submit flow which is method-agnostic |
| `tenderedAmount` (cash) | `CashProvider` | Only cash steps read it |
| QR code URL, payment status (qris) | `QrisProvider` | Only qris steps read it |
| Card token (future credit-card method) | `CreditCardProvider` | Only credit-card steps read it |

**Golden rule:** if only your method's components read a piece of state, it
belongs in your method's context, not in `PosProvider`.

## Wizard navigation contract

`usePos()` exposes the following step transitions. Your step components call
them; the wizard chrome doesn't need to know what triggered a transition.

| Function | Effect |
|---|---|
| `goToConfirm()` | Advance to the confirm step. Caller validates first. |
| `goBack()` | Return to the previous step in `handler.steps`. Generic — derives the destination from the active handler's step list, so methods that skip `nominal` (e.g. QRIS) get the correct path automatically. |
| `cancelCheckout()` | Close the wizard entirely. The header's ✕ button calls this; if the active handler defines `cancelGuard`, the header opens a confirmation dialog first. |
| `completeTransaction()` | Submit `POST /pos/sales`. Returns the receipt id on success, `null` on failure. |

## Edge cases

- **Unknown method `type`** — registry returns `null`; the wizard renders
  `<CheckoutStepUnsupported />` with a "Pilih metode lain" button. The
  cashier is never stuck on a non-functional step.
- **`requiresSchemeSelection: true`** — the method appears as a disabled chip
  in step 1 with a "Belum didukung" tooltip; clicking does nothing. When you
  ship a handler that supports schemes, also lift this restriction in
  `selectPaymentMethod`.
- **Cart edited mid-wizard** — if the cart becomes empty, the wizard auto-
  cancels; if the total goes up past the tendered cash amount, the cash
  confirm step bounces back to nominal automatically.
- **Case-insensitive type lookup** — the BE has shipped `"cash"` and `"Cash"`
  in different responses. The registry normalizes to lowercase, so handlers
  always declare lowercase `type`.

## Worked example 1 — Cash (existing)

`cash/` is the canonical reference. Read these files in order when building
a new method:

| File | What to learn |
|---|---|
| `cash/cash-handler.ts` | Minimal handler with all four optional fields filled in. |
| `cash/cash-context.tsx` | Tiny `Provider` + `useCash()` hook with one piece of state. |
| `cash/cash-nominal-step.tsx` | A nominal step with currency input, quick chips, live preview, and `goToConfirm()` on submit. |
| `cash/cash-confirm-step.tsx` | Confirm step that bounces back if shared state goes invalid; submits via `completeTransaction()` and routes to `/pos/receipt/<id>`. |

## Worked example 2 — QRIS (sketch, not yet shipped)

QRIS skips the nominal step. The confirm step shows a QR code, polls the BE
for payment status, and submits when confirmed. State across the (single)
step lives inside the component, so no `Provider` is needed.

```ts
// qris/qris-handler.ts
export const qrisHandler: PaymentMethodHandler = {
  type: "qris",
  steps: ["method", "confirm"],
  initialStep: "confirm",
  ConfirmComponent: QrisConfirmStep,
  cancelGuard: {
    title: "Batalkan pembayaran?",
    description: "Pembayaran QRIS mungkin sudah masuk. Cek status sebelum membatalkan.",
    confirmLabel: "Ya, batalkan",
  },
};
```

```tsx
// qris/qris-confirm-step.tsx
export function QrisConfirmStep() {
  const { total, completeTransaction } = usePos();
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "paid">("pending");

  // ...generate QR, poll status...

  const onPaid = async () => {
    const id = await completeTransaction();
    if (id) router.push(`/pos/receipt/${id}`);
  };

  return /* QR display + status indicator + cancel */;
}
```

```ts
// _payment-methods/registry.ts (after adding QRIS)
const HANDLERS: PaymentMethodHandler[] = [cashHandler, qrisHandler];
```

That's the entire diff to add QRIS. No file in `_components/` or
`_providers/` is touched.

## Verification checklist

After adding or modifying a handler:

- [ ] `npx tsc --noEmit` is clean.
- [ ] In step 1 the new method appears (when enabled in the BE) and is
      selectable.
- [ ] `requiresSchemeSelection: true` methods still render disabled with the
      "Belum didukung" tooltip.
- [ ] BE responses with mixed casing (`"cash"`, `"Cash"`, `"CASH"`) all route
      to the right handler.
- [ ] Editing the cart mid-wizard behaves correctly per the edge cases above.
- [ ] An unknown `type` from the BE renders `<CheckoutStepUnsupported />`.
- [ ] After a successful transaction, the receipt page shows the right data
      and the cart is cleared.

## Files NOT to modify when adding a method

The following files are the wizard chrome / contract. Adding a new method
should never require editing them. If you think it does, stop — the plugin
contract itself probably needs to evolve, which is a separate refactor.

- `src/app/(pos)/pos/_components/checkout-panel.tsx`
- `src/app/(pos)/pos/_components/checkout-handler-step.tsx`
- `src/app/(pos)/pos/_components/checkout-header.tsx`
- `src/app/(pos)/pos/_components/checkout-step-method.tsx` and
  `checkout-step-method-body-*.tsx`
- `src/app/(pos)/pos/_components/checkout-step-unsupported.tsx`
- `src/app/(pos)/pos/_providers/pos-provider.tsx`
- `src/app/(pos)/pos/_providers/pos-provider.types.ts`
- `src/app/(pos)/pos/_payment-methods/types.ts`
