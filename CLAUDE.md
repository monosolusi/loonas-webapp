# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # Type-check (tsc --noEmit) — use to verify after edits
npm run test         # Vitest (node environment, pure units only)
```

Verify changes with `npm run typecheck`, `npm run lint` and `npm run test`.

A fresh worktree has no `node_modules` and no `.env.local`: run `npm ci` first, and give `npm run build` a
correctly *shaped* throwaway `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk validates the base64
`*.clerk.accounts.dev$` payload, not merely its presence — or static prerendering fails.

Tests are **pure units only** — parsers, domain calculations, payload construction. There is
no DOM, Clerk or network harness, so anything needing a rendered tree or a live session is
verified by manual smoke instead. Suites are `src/**/*.test.ts` next to the code they cover.
The include glob matches `.test.ts` only and the environment is `node`, so logic that lives inside a
`.tsx` provider or component is **unreachable by the suite**. To cover it, first extract it to a plain
`.ts` module — no JSX, no React imports — under the page's `_utils/`, then colocate the `.test.ts`
beside it. Precedents: `products/create/_utils/build-variant-params.ts` (payload construction, LNS-572)
and `products/[id]/_utils/sync-variants.ts` (mutation planning, LNS-570).

**CI gate** (`.github/workflows/ci.yml`): runs `lint → typecheck → test → build` on PRs to
`dev`/`main`/`release/**`. Node version pinned via `.nvmrc` (currently 20.20.2, engines `>=20.19.4`).

## Tech Stack

- **Next.js 15** (App Router) / **React 19** / **TypeScript 5** (strict)
- **Tailwind CSS 4** with `prettier-plugin-tailwindcss` for class sorting
- **clsx** for className composition (preferred over template literals)
- **Headless UI** (`@headlessui/react`) + **Heroicons** (`@heroicons/react`) for UI primitives
- **Clerk** for authentication (middleware + session management)
- **SWR** for client-side data fetching
- **Luxon** for dates, **Joi** for validation

## Architecture

Clean Architecture with feature-based modules. Three layers per feature:

```
src/
├── app/                              # Next.js pages & layouts
│   ├── (authenticated)/              # Protected routes (Clerk)
│   │   └── {route}/
│   │       ├── page.tsx              # Composition only — wraps provider + components
│   │       ├── _providers/           # Page-level context providers
│   │       └── _components/          # Components that consume context
│   ├── (authentication)/             # Sign-in, reset-password
│   ├── (user)/                       # Onboarding
│   ├── (pos)/                        # Cashier POS shell + payment-method plugins (see _payment-methods/PLUGIN_PATTERN.md)
│   └── (external-app)/              # Public external routes
├── features/{feature}/               # Feature modules
│   ├── domain/                       # Entities, guards, types, enums, repository interfaces, use cases, factories, helpers
│   ├── data/                         # Repository impls, services (sources), models, types
│   └── presentations/                # hooks/, components/, providers/
└── core/                             # Shared utilities, base classes, global components
```

### Data Flow

**Use case → Repository (interface) → Repository impl → Service (HTTP) → API**

Hooks wrap use cases with SWR:

```
useGetInvoice → SWR fetcher → GetInvoiceUseCase → InvoiceRepositoryImpl → InvoiceServiceImpl → HTTP
```

### Key Patterns

- **Presentation layer naming**: Older features use `presentation/` (singular), newer ones use `presentations/` (
  plural) — `features/bank/` is singular while `features/accounting/` and `features/product/` are plural, so an
  import path copied between them silently breaks. Match the existing directory name when adding to a feature.
- **Entity immutability**: All entity properties must be `public readonly`. Models are also `public readonly`.
- **Derived-invariant getters**: when a getter expresses the complement or a refinement of an existing one,
  derive it FROM that getter instead of restating its predicate. `ProductEntity.defaultVariant` is
  `if (this.hasVariants) return null; return this.variants[0] ?? null;` — not a re-spelled
  `length === 1 && variants[0].isDefault`. Restating the clauses creates two rules that can drift; deriving
  makes drift structurally impossible. LNS-570 was exactly this drift: a caller hand-rolled its own copy of
  "is this product single-priced?", disagreed with the entity, and silently destroyed variant-scoped
  sub-resources on every save. If you catch yourself re-deriving an entity rule at a call site, the rule
  belongs on the entity. Corollary: if you introduce a domain getter, route the presentation through it —
  do not leave it unused while a helper re-derives the same predicate from the underlying field. An unused
  getter plus a parallel helper is a drift surface even when both reference the same constant today, because
  a future change to one will not reach the other. LNS-608 arch-review caught `VariantForSaleEntity.isOutOfStock`
  sitting unused while `outOfStockBadgeProps(status)` re-derived `stockStatus === OUT_OF_STOCK`; the fix routed
  `OutOfStockBadge` through `isOutOfStock: boolean` and deleted the helper.
- **Model nested references**: When a model has nested objects from API, use actual Model classes (e.g.,
  `RawMaterialModel`, `VariantModel`) with their `fromJson()`, not plain objects. `toEntity()` maps to domain types.
- **DataState pattern**: Use cases return `DataSuccess<T>` or `DataFailed` instead of throwing
- **Hook return types**: Discriminated unions (`InitialState | LoadedState | ErrorState`)
- **ServerError + ErrorCodes**: Centralized error registry with Indonesian messages
- **Factory pattern**: `PayInDetailFactory` etc. for polymorphic creation
- **`domain/helpers/`**: pure, stateless calculations over domain entities — no DI, no
  repository, no `DataState`, no imports from `data/` or `presentations/`. Use when logic is
  domain knowledge but belongs to no single entity (see
  `features/product/domain/helpers/price-tier-preview.ts`). Anything that needs a repository
  is a use case instead. **Injected I/O callbacks disqualify it too**: a function that fires
  mutations through passed-in trigger functions is orchestration, not calculation, no matter how
  pure its signature looks — it stays in the app layer (see
  `app/(authenticated)/products/[id]/_utils/sync-variants.ts`). A second disqualifier is the input
  type: if the function's primary input is a form/edit-buffer type owned by `_components/`, moving it
  into `domain/` would force a domain-side mirror of a presentation type. Extract only the genuinely
  domain-owned fact (usually onto the entity) and leave the rest where its collaborators live.
- **A `_utils/` resolver's exhaustiveness comes from the ABSENCE of a `default` branch**: the enum resolvers
  (`resolve-cash-entry-status-chip.ts`, `resolve-cash-entry-cross-reference.ts`, `resolve-settings-form-state.ts`)
  switch over an enum with a non-nullable declared return type and **no** `default`, so a new enum member leaves a
  path returning implicit `undefined` — a `tsc` error under `strict`. Adding a `default`, including one with a
  `never` assertion, reads as a safety improvement and silently destroys that guarantee: every future member then
  compiles into the fallback. Do not add one. To express "this case deliberately produces nothing", return a
  `{ kind: "none" }` member of a discriminated result union rather than `null` — it keeps the sibling resolvers'
  vocabulary and forces call sites to branch explicitly instead of null-checking.
- **Impl components**: `*-impl.tsx` files are smart components that fetch data and pass to presentational siblings
- **Type guards**: `domain/guards/` contains `instanceof` checks for discriminating entity types
- **SectionCard**: Standard card component (`rounded-lg`, `border-neutral-200`, icon header) for detail pages
- **Skeleton loading**: Loading states use `animate-pulse` placeholder divs inside `SectionCard`
- **Fetch-error state inside a card**: when a `SectionCard`-scoped fetch fails, render a sibling error component
  (`{noun}-error.tsx`) rather than collapsing to `null` — a hidden card is indistinguishable from an empty one.
  Canonical shape (see `accounting/profitability/[productId]/[variantId]/_components/cogs-block-error.tsx`):
  `flex flex-col items-center gap-y-3 py-4` inside the card, `ExclamationCircleIcon` from `@heroicons/react/20/solid`
  at `size-5 text-error-300`, and a `SecondaryButton outlined className="h-11" label="Coba Lagi"` wired to the hook's
  `refresh`. Do **not** copy the full-page error pattern (`receipt-error.tsx`) for an in-card error — that one is
  page-scoped and carries a navigation action. Omit the retry button when the error is terminal (a `NOT_FOUND` will
  never succeed on retry). `SectionCard` already applies `p-6` to its body, so the inner block only needs `py-4`.
  Corollary — **a status card's branch selector is the status flag, never the payload it links to**: ANDing the two
  (`isReversal && reversedJournalId`) means a true status whose id is missing renders *nothing*, which reads as "this
  record has no such status" rather than "the link target is unknown". Select the branch on the flag alone and let a
  missing id yield the chip **without** a link — see
  `cash-entries/[id]/_utils/resolve-cash-entry-cross-reference.ts`, whose test pins it;
  `journal-reversal-status-card.tsx` still ANDs and is the one to fix, not follow.
  Second corollary — **never badge the ordinary case**: a chip for the healthy/default state is the negation of an
  exception promoted to a permanent per-row marker, and `StatusChip` is a bare span with no tooltip or description,
  so it reads as a state the user is expected to understand and cannot. Absence means normal — the journals list
  carries no status marker at all, and cash entries render a chip only for `cancelled` / `cancellation`, with the
  cross-reference card carrying the detail (LNS-781 removed the green "Aktif" chip that every row of a healthy
  ledger was showing). Keep the column when it still carries the cross-reference link, and let it be blank.
- **Interactive element height**: All interactive elements (buttons, inputs, selects, custom controls) use `h-11` (44px)
  for consistent vertical rhythm. Exception: icon-only action buttons (edit, delete) in tables use `size-8` (32px).
- **Account resolution**: Backend resolves account from Clerk JWT `orgId` (set via `setActive({ organization })`).
  Frontend never sends account ID in headers or params — only `Authorization: Bearer {token}`
- **Org-scoped vs user-scoped endpoints — only the latter survives "no active org"**: `GET /accounts`
  (`useListAccount`) is **user**-scoped, resolved from the bearer token alone, and returns every account the user
  owns with its own `latest_status` / `verification_outcome` / `membership` — it works with no organization active.
  `GET /accounts/me` (`useGetCurrentAccount`) and `GET /accounts/verification-works`
  (`useGetAccountVerificationWork`) are **org**-scoped: they resolve from the JWT `orgId` and fail outright when
  none is set. So any state that must render *before* an org is chosen — a returning user Clerk did not restore an
  org for, anything after `setActive({ organization: null })` — may only read the user-scoped list. Note
  `/accounts` returns **404 when the user has zero accounts**, which `useListAccount` maps to `[]`; and a redirect
  guard keyed on one specific error code (`ErrorCodes.NOT_FOUND`) silently does nothing for every other code, so
  never let such a guard be the only thing recovering a no-org session.
- **Session parameter order**: In repository and service method signatures, `session: SessionEntity` must always be the
  **last** parameter. Methods have **maximum 2 parameters**: `(params, session)`. All business parameters grouped into a
  single object: `list({ search, page }, session)`, `update({ id, name, status }, session)`.
- **SWR key management**: SWR keys defined as constants in `presentations/constants/swr-keys.ts`. Use
  `revalidateSWRKey()` to invalidate cache after mutations. Hooks use these constants, never hardcoded strings.
- **`revalidateSWRKey()` can reject — never `await` it unguarded inside a `catch`**: it wraps SWR's global
  `mutate(filter)`, which triggers a **refetch**, not a cache write, and `internalMutate` defaults to
  `throwOnError: true`. If the refetch fails (e.g. recovering from a 404 — the entity is still gone), the `await`
  throws and everything after it is skipped. In an error-recovery path, show the toast and set state **first**
  (synchronous, cannot fail), then attempt the revalidation inside its own `try {} catch {}`. On the success path
  it is fine unguarded, since the surrounding `catch` already handles it — but that allowance is for plain async
  handlers, not for a `useSWRMutationClerk` fetcher: there the fetcher's rejection becomes the mutation's `trigger`
  error, so **never `await` it inside a fetcher at all** — fire-and-forget
  `void revalidateSWRKey(...).catch(() => {})`, or a successful write gets reported as failed.
- **UseCase params independence**: Use case param types are defined in the use case file itself. Use cases MUST NOT
  import param types from repositories or sources. The use case defines its own params, then maps to repo params
  internally.
- **Source owns its params (LNS-402)**: `domain/sources/*.ts` define their own `*ServiceParams` types locally and
  MUST NOT import param types from `domain/repositories/`. The repository keeps its own params; the use case maps
  between repo and service params. Mirrors Use-Case params independence one layer down — when adding a source, check
  its siblings follow the same ownership and fold any repo-owned stragglers in the same PR (same defect class,
  adjacent path).
- **UseCase workflow**: `execute()` should read like a clean workflow — delegate to private methods. Common pattern:
  `resolveSession()` as private method that throws on failure, then private action methods that call repository.
- **Provider pattern (feature-level)**: When a feature needs shared state across components, extract to a provider in
  `features/{feature}/presentations/providers/`. Provider exports a `use{Name}()` hook via `createContext`/`useContext`.
- **Provider pattern (page-level)**: Complex pages use `_providers/` folder next to `_components/`. Provider manages
  state, hooks, and actions. Components in `_components/` consume context individually. Page (`page.tsx`) only composes
  provider + components — no business logic.
- **Provider guarantee pattern**: Detail page providers accept a `loading: React.ReactNode` prop. Provider renders
  loading indicator until data is ready, then renders children with guaranteed non-nullable context data. Children never
  need null checks.
- **Provider data locality**: Provider only hosts data shared across multiple components. If data is used by only one
  component, that component fetches it locally.
- **Latch dialog display values through the close fade — and never latch the error**: a provider nulls its
  `editingCategory`-style holder when a dialog closes, but `LoonasDialog`'s panel stays mounted through its 200ms
  leave transition, so the body re-renders from the nulled holder mid-fade — a direction falls back to its default
  enum (a WRONG value, not a blank) and a name blanks to "menghapus kategori ?". Wrap the display values in
  `useLatchedValue` (`core/presentations/hooks/use-latched-value.ts`) so the last non-null value survives the fade.
  The corollary is load-bearing: errors stay **unlatched** — the open handler nulls the error in the same batch as
  the entity, so a latched error resurrects the *previous* record's error strip on the next open. (LNS-742)
- **A plain hook is not shared state — `use{X}Data()` called by N components is N independent `useState`s**: this
  reads as shared state at every call site and is not, so the failure is silent and total. On `/onboarding/account`,
  `usePersonalAccountData` was a plain hook (no `createContext`) called by 14 components:
  `personal-account-form-wrapper` called `submit()` and wrote `submitError` / `submitStatus` / `submitAttempted` /
  `createdAccountId` to **its own** instance, while `submit-error-banner`, `submit-incomplete-banner` and
  `submit-button` read three *other* instances that were forever `null` / `[]` / `"idle"`. The entire F8 remediation
  (error banner, named missing-field list, "Membuat akun..." in-flight label) was therefore dead on arrival while
  looking correct in review — and `createdAccountId` being instance-local meant a second submit re-ran the create and
  could open a **duplicate account**. The tell is a component wired to state that only a *different* component ever
  writes; `grep -rln` the hook and if more than one consumer both reads and writes, it must be a provider. Two
  corollaries: (1) the same defect was mirrored verbatim in the business twin — when a flow has personal/business
  siblings, fix and grep both; (2) a `disabled` submit button does **not** block Enter-key submission from a text
  input, so promoting the state is necessary but not sufficient — the handler still needs an `if (isCreating) return;`
  re-entry guard. None of this is reachable by the vitest suite (`.tsx`, node env), so it is a review-and-smoke
  concern, not a test one.
- **Preserve invariants when narrowing a mutation-clear callback**: when a cart-mutation callback that cleared
  multiple error maps is narrowed to one concern (e.g. `clearStockErrorFor` → `clearPriceMismatch` after removing the
  stock-error map), the renamed callback must still fire on every `addItem` / `updateQty` / `removeItem` path that
  previously called it — otherwise the remaining concern (a stale `UNIT_PRICE_MISMATCH` marker) survives a cart edit.
  LNS-608 preserved this on all three mutation paths.
- **An `async` event handler must never `throw`, and a catch-all must never swallow**: React does not await
  `onSubmit`/`onClick`, so a `throw` inside one becomes an unhandled promise rejection — the user sees nothing, the
  button silently resets, and the failure is invisible. The mirror defect is a provider-side `catch` that logs
  instead of rethrowing: the async function then *resolves*, and the caller runs its success path (`router.push`)
  on a failure that never happened. Both shipped together on `/onboarding/user` — registration appeared to succeed
  while no account existed. Rules: (1) every branch of a handler's `catch` either navigates or sets error state,
  never `throw`; (2) a `catch` that re-wraps errors must rethrow deliberate ones first (`if (err instanceof
  ServerError) throw err;`) — otherwise a narrowing guard like `isClerkAPIResponseError` returns false for your OWN
  thrown `ServerError` and the catch-all eats it; (3) `console.error(JSON.stringify(err))` on a native `Error` logs
  `{}` (message/stack are non-enumerable) — log the raw object. Extract the error→outcome decision into a pure
  `_utils/classify-submit-error.ts` so vitest can reach it; the `.tsx` handler itself cannot be tested.
- **A third-party widget injected into a DOM slot needs the slot mounted, visible, and ordered before the submit
  control**: Clerk mounts its Turnstile challenge into `#clerk-captcha` at `signUp.create()` call time, not on page
  load. That slot was rendered *after* the submit button, so the challenge appeared below the fold and the button
  spun forever with nothing explaining why. The slot must exist before submit fires (if absent, Clerk degrades to
  invisible-only and can hard-block a falsely-flagged user with no recourse); it must never be `display:none`
  (Turnstile fails to measure inside a hidden node — reveal the *label*, not the container); and it belongs between
  the last field and the button, per Clerk's own examples. Clerk exposes **no** app-observable captcha state — no
  `captcha_unsolved` code, no callback — so do not build UI around detecting an unsolved challenge. Watch the slot's
  *size* with a `ResizeObserver` instead, and reveal only on non-zero height: the widget is injected on every submit
  including the invisible path, so an unguarded observer shows a "solve the captcha" hint and scroll-jumps every
  successful signup.
- **Never race a real mutating call against a client-side deadline — bound the *display*, not the promise**:
  `Promise.race([signUp.create(), timeout])` rejects the UI promise but does **not** cancel the request. It keeps
  running and can still succeed server-side, so the user is told "gagal", retries, and the retry collides with
  `form_identifier_exists` on an account that silently already exists — manufacturing the very duplicate-account
  trap the timeout was added to prevent. This applies to any call whose server-side effect is not safely
  re-triggerable (account creation, payment capture, stock adjustment). Instead: `await` the real promise and let
  its real settlement be the **only** thing that ends the loading state, and run a separate `setInterval` purely
  to track elapsed time, feeding a pure `resolveWaitPhase(elapsedMs)` that escalates the *copy*
  (`_utils/submit-wait-phase.ts` → `_components/create-user-status-notice.tsx`, 8s caption → 20s advisory). Past the
  stall threshold the copy must stay honestly uncertain ("mungkin sudah berhasil dibuat di latar belakang") and
  steer to **reload-and-check**, never resubmit. The carve-out: a deadline IS safe once the mutation has already
  returned and the *next* step is what's hanging — `withTimeout()` (`core/utilities/`) bounds `setActive()` only,
  because by then the account is known-created, so "akun sudah dibuat, sesi gagal diaktifkan — muat ulang lalu
  masuk" is correct whether Clerk truly failed or merely never answered. Test the boundary by asking: *if I reject
  now and I'm wrong, is my copy still true?* Note the two `onboarding/account` hooks still race a 60s
  `AbortController` against account creation — same defect class, pre-existing, deliberately left untouched here.
- **A submit's success is a terminal UI state, and the auth library owns the post-auth navigation**: three
  separate mistakes shipped together on `/onboarding/user` and each alone reproduces "the user cannot tell whether
  it worked". (1) `disabled = !isClean || !isReady || isSignedIn` on the submit button: the instant `setActive()`
  resolves, `isSignedIn` flips true while the in-flight flag flips false **on the same tick**, so the button renders
  dead grey — no spinner, no error — whether or not navigation actually happened. Model the lifecycle as a
  `SubmitStatus` union where `"succeeded"` is TERMINAL and never falls back to `"idle"`, and resolve the button
  through a pure `_utils/create-user-button-state.ts` carrying the invariant *no input yields `disabled && !loading`
  while succeeded*. (2) `Button` renders `label` only when **not** loading, so `loading` without `loadingLabel` is a
  bare spinner with zero text — every `loading: true` branch must carry a `loadingLabel`. (3) A bare
  `await setActive({ session })` followed by a separate `router.push()` is the one shape Clerk's docs never use and
  it gets dropped; pass `setActive({ session, redirectUrl })` as `SignInProvider` already does, and keep a
  ref-guarded `status === "succeeded"` effect as the fallback. When two navigation paths exist (post-signup vs a
  pre-existing session), give each its own destination and make each consume the other's ref guard, or they race.
- **Clerk throws two unrelated error classes and `isClerkAPIResponseError` only catches one**: a client-side
  failure before any request — notably `{ code: "captcha_unavailable" }` when Turnstile itself cannot load — is a
  `ClerkRuntimeError`, for which that guard returns **false**, so a catch-all silently collapses it to a generic
  message. Duck-type both structurally rather than importing `@clerk/*`, so the classifier stays reachable by the
  node-env vitest suite (house precedent: `sign-in.tsx`'s `classifyClerkError`): `ClerkAPIResponseError` has
  `status: number` + `errors: Array<{ code }>` + optional `retryAfter` (seconds, surface it in rate-limit copy);
  `ClerkRuntimeError` has only `code: string`. Check `status === 429` **before** pattern-matching `errors[0].code` —
  the HTTP status is authoritative. Never render a raw `SignUpResource.status` (`"missing_requirements"`) as user
  copy; map it, and keep the raw value in `details` for logging.
- **A `disabled` submit button must never be the only thing standing between the user and the block**:
  a boolean gate over a whole multi-step form can only ever render as grey, so whichever of its N conditions
  failed, the user sees the same dead end — and on a wizard whose off-step pages `return null`, the offending
  field is not even on screen. QA F8 was `disabled={!isClean}` over a 13-condition `useMemo` spanning all three
  `/onboarding/account` steps. The fix shape: resolve completeness to a **step-ordered `FieldIssue[]`**
  (`field`, `step`, `label`, `message`) plus `isComplete` and `firstIncompleteStep`
  (`account/_utils/{personal,business}-account-completeness.ts`), leave the button **clickable**, and let the
  submit handler answer — reveal errors on every step carrying one, navigate to `firstIncompleteStep`, and list
  the missing fields *with their step name* in a banner. Same family as the "affordance stays, dialog explains
  the block" rule. Enforce it structurally with a pure button-state resolver whose regression test asserts **no
  input yields `disabled && !loading`** (`_utils/create-account-button-state.ts`, mirroring
  `user/_utils/create-user-button-state.ts`); the only disabled states left are in-flight ones, which always
  carry a `loadingLabel`. Corollary: a "Next" button with no per-step validation is what lets an empty step-1
  field become an unexplained step-3 blocker — validate the current step and block by *revealing that step's
  inline errors*, never by disabling Next.
- **An escape hatch must never be gated on the state that creates the need for it**: `/onboarding/kyc-summary`'s
  only exit was `UseOtherAccountAction`, which `return null`s when `status.approvedAccount.count === 0` — precisely
  the state of a user whose single account is still awaiting KYC. The `(user)/onboarding` layout renders no header,
  so the app's only "Keluar" (`(authenticated)/_components/header-sign-out-menu.tsx`) was off-screen, and `/sign-in`
  bounces an already-signed-in visitor back to `/home`, which redirects to kyc-summary again. The loop was closed:
  the only documented escape was clearing cookies. The gate itself was *correct* — an account **switcher** has
  nothing to offer when there is nothing to switch to — the defect is that it was the ONLY exit. Rule: any route a
  redirect can strand a user on carries an exit whose sole precondition is that a session exists
  (`onboarding/_components/sign-out-action.tsx`: never reads verification/account state, never `return null`s for a
  signed-in user, renders a pending state rather than vanishing while `!isLoaded`). Same family as the
  disabled-button rule — a control that renders nothing is strictly worse than one that renders grey. Corollary,
  and the reason this shipped: when a component whose whole job is escape can render `null`, the sibling that wraps
  it inherits that emptiness silently — `GoToSignIn` wrapped it in a flex div and its own `signOut` branch was
  wired *only* to the signed-out case, which `account/layout.tsx` redirects away before it can ever render.
- **A whole-page `return null` is a blank screen, not a loading state**: `kyc-summary/page.tsx` opened with
  `if (!isLoaded || !organization) return null;` on a route with **no auth guard at all**, so a signed-out visitor
  or anyone without an active Clerk org got a permanently blank page inside the marketing shell — no message, no
  redirect, nothing to click. Resolve route entry through a pure `_utils/` resolver returning a discriminated
  `loading | redirect | ready`, with a regression test asserting **no input renders nothing and redirects nowhere**
  (`kyc-summary/_utils/resolve-kyc-summary-entry.ts`, mirroring `_utils/create-account-button-state.ts`). Two
  supporting facts that decide such a resolver: **client-side redirects use `router.replace`, never `push`** — a
  push stacks a history entry, so Back walks the user straight back into the state that triggered it; and a
  **blocking redirect needs a path exemption for the surface that resolves the block** — the `SelectedAccountProvider`
  KYC redirect fired from anywhere in `(authenticated)`, so `/accounts`, the one surface that can reactivate a
  pending Clerk org, was unreachable by the exact user who needed it (`resolve-account-redirect.ts` exempts
  `/accounts` and `/onboarding*`).
- **Session readiness is not form validity — never `&&` them into one gate**: `isClean` ended in `&& isLoaded`
  from Clerk's `useOrganizationList()`. Per Clerk's docs that flag **never becomes true for a signed-out user**
  (the docs' own loading guard doubles as an auth guard) and reverts to false while auth state updates — and
  `src/middleware.ts` is a bare `clerkMiddleware()` with **no route protection**, so `/onboarding/account` is
  reachable with no live session. The result was a permanently dead button on a form that was genuinely
  complete. Removing it loses nothing: the use case resolves the Clerk session *before* any network write, so a
  signed-out submit fails with `NO_VALID_SESSION` and copy the user can act on, and the existing
  `createdAccountId` cache keeps the retry safe. A readiness flag belongs in a loading state or an error
  message, never in a validity predicate.
- **Reveal field errors per step, not with one global `submitAttempted` latch**: a single latch set by "Next" on
  step 1 lights up step 2's untouched fields the moment the user arrives — errors for data they have not been
  asked for yet. Track `attemptedSteps: Step[]` in the provider and derive
  `showFieldErrors = attemptedSteps.includes(currentStep)`; since every field renders only on its own step, that
  is exactly the right revelation scope. A field may still add its own `isTouched` on top for blur-time feedback,
  but it must take its *copy* from the shared resolver (`issueFor(field)?.message`) rather than restating it.
- **An uncontrolled shared input inside a step that unmounts will lie about its value**: `FileUploadInput` keeps
  its own `internalFile` when no `value` prop is passed, and `/onboarding/account`'s step pages `return null`
  when off-step. `KtpFileUploadInput` omitted `value`, so stepping away and back re-rendered the empty
  "Klik untuk upload file" state while the provider still held the `File` — an empty-looking dropzone, an enabled
  button, and the stale file submitted. The business flow passed `value` and was fine. Whenever a shared input
  supports both modes, the page that owns the buffer must pass `value`. Related: that component's size check
  `return`s **before** `onChange`, so an over-cap pick silently keeps the previous file — keeping it is correct
  (a fat-finger should not destroy a valid selection), but only once `value` makes the retained file visible.
- **When adding a validation `error` surface, check every input primitive the form actually uses**: when this was first
  audited only `TextInput` had `error` — `SelectInput`, `TextAreaInput`, `EmailInput` and `FileUploadInput` did not,
  and the five `(user)/onboarding` address/occupation selects had no way to show one at all. Those gaps are now
  closed (`SelectInput` carries `error`, `description`, and a `useId()`-based `aria-describedby` association; all five
  selects are wired), so read that list as a record of what was found, not of the code today — re-check the primitive
  you are about to touch. The rule itself stands for the next one: mirror `TextInput`'s contract (red border, `text-xs
  leading-4 font-normal text-red-500` message, `aria-invalid`, error takes precedence over `description`) and
  **destructure the new `error` out of the props-spread** (`cleanedInputProps`) or it lands on the DOM node as an
  unknown attribute. Where a primitive already owns a local error (`EmailInput`'s format check, `FileUploadInput`'s
  size check), the local one describes what the user just did and outranks the caller's standing copy:
  `localError ?? props.error`. **When the primitive cannot grow the prop, the wrapper owns the surface**:
  `SearchCombobox` has no `error`, no `description`, and no passthrough to its inner `ComboboxInput`, so a call
  site cannot reach that node — render a sibling `<span className="text-xs leading-4 font-normal text-red-500"
  role="alert">` inside a `flex flex-col gap-y-2` wrapper (the repo carries three divergent shapes for this; that
  is the one to copy), and accept that `aria-invalid` / `aria-describedby` cannot be restored from outside. Two of
  its other props lie: `required` is **inert** under `noLabel` (it only draws the label's asterisk and is never
  forwarded), so your own label must carry the `*`; and `keywords` is the ONLY extra field its filter matches
  (`description` / `caption` are display-only), making it the right home for a value that must be **searchable but
  never shown** — e.g. an account code behind a name-only label (LNS-782).
- **An object-valued picker must never hold a value absent from its `options`**: `SearchCombobox` takes
  `value: T | null` identity-matched out of `options`, so a selection the fetched list does not contain renders as
  a **blank field**, not as an error. That is reachable whenever a create flow selects optimistically — the cash
  entry flow does `setCategory(created)` with no `revalidateSWRKey`, unlike the `products/` combobox+create
  precedents that revalidate first — so the option builder must fold the current selection back in when absent.
  Keep that fold-back in the same pure `_utils/` module that builds the options, and pin it with a test over an
  **empty** fetched list — the exact path a first-category create takes (LNS-782).
- **A component consuming a fetch hook must read `error`, not only `loading`**: all five `(user)/onboarding`
  address/occupation selects destructured `{ data, loading }` and dropped `error`. On a failed fetch `loading` flips
  false while the option list stays `[]`, so the control renders **enabled, empty and silent** — strictly worse than a
  disabled one, because it looks fully functional. A user whose province list failed could not finish the KYC address
  step and nothing said why; on the child selects it was also indistinguishable from "parent not chosen yet". The tell
  is a destructure taking `loading` but not `error` from a hook that returns both. Corollary for the retry affordance:
  a **bound** SWR `mutate()` triggers a refetch and defaults to `throwOnError: true`, so wiring a button straight to it
  yields an unhandled rejection from an `onClick` when the retry also fails — swallow it deliberately
  (`void refresh().catch(() => {})`), which is safe precisely because SWR leaves `error` set, so the field keeps its
  copy and the button stays on screen. Same mechanism as the `revalidateSWRKey()` rule above. Two things must hold
  for that swallow to keep working. **Type `refresh` as the promise it actually returns** — `KeyedMutator<T>`, the
  shape the loaded state already uses — never `() => void`: an expression-bodied `() => mutate()` does hand back
  SWR's promise, so a `.catch()` on it is merely incidental, and a later edit conforming the implementation to its
  own `void` signature silently removes the only thing catching the second failure, with neither `tsc` nor lint
  objecting. And **render the refetch-error strip above the state switch, never inside the success branch**: under
  `keepPreviousData` a failed refetch over a retained *empty* page derives to `"empty"`, so a strip living in the
  table component never mounts and the user is told "no data" about a request that failed — the empty-list twin of
  the stale-rows case the strip exists to prevent. `cost-valuation-gaps-provider.tsx` is cited as the template for
  optional-range list shells and gets **both** of these wrong (unguarded `onRetry`; a `shellState` letting `"empty"`
  outrank a non-null `pageError`) — mirror its structure, not those two lines. `accounting/cash-entries/` is the
  corrected shape. Corollary — **error copy may only promise recovery that actually exists**: SWR auto-retry is on
  app-wide (`swr-provider.tsx` sets `shouldRetryOnError` with backoff; `revalidateOnFocus` defaults true), so a
  fetch-error state with no retry button can be an honest wait-state — but then the copy must say so ("daftar akan
  dimuat ulang otomatis…"), never instruct a manual action that cannot work: "tutup lalu coba lagi" over a hook that
  stays mounted is a no-op, since closing and reopening never re-runs the fetch (LNS-740 arch review).
- **When one message slot serves several conditions, order by which fact is true *right now*, in one pure module**:
  `SelectInput` renders `description` only when `error` is falsy, so exactly one message can ever surface while four
  conditions compete for it. `onboarding/_utils/resolve-select-field-state.ts` ranks them: parent-unchosen → loading
  → fetch-error → caller's standing required-error. Two rungs are non-obvious.
  **Loading outranks a fetch error**, because SWR keeps the previous `error` populated while revalidating (`isLoading`
  is `isValidating && data === undefined`), so a retry otherwise leaves stale red copy beside a live retry button —
  it reads as "still broken" and invites a double-tap. **The caller's standing required-error ranks last**, because
  "Pilih kota/kabupaten" before a province is chosen, or after the list failed, instructs an impossible action and the
  user blames themselves; suppressing it is safe only because submit is gated by the step-ordered completeness
  resolver and its banner, not by the field's red text. Same shape as `localError ?? props.error` above. Make the bad
  states unrepresentable rather than merely tested — model unselectability as `{ selectable: false; reason: string }`
  and a parent dependency as `{ hasParent: true; parentChosen: boolean; parentHintCopy: string }`, so copy-less
  inertness is a type error. The regression test asserts the field is never `disabled` without an `error` or
  `description`; keep that implication **one-directional**, because the fetch-error state deliberately carries copy
  while staying *enabled* (disabling it would drop it out of tab order) — tightening it to an iff forbids the correct
  behaviour. Corollary for a control whose copy lives in two places at once: `SearchCombobox`'s `emptyMessage`
  renders only *inside* the open dropdown, which anchors `bottom start` — directly over a sibling hint below the
  field. So swapping a `SelectInput` for it silently drops the `description` slot, and a single static
  `emptyMessage` will occlude the correct copy with a wrong one ("nothing matched" over a catalogue that is simply
  empty). Branch it on `options.length === 0` (empty catalogue) vs a non-empty list (query matched nothing); the
  two are mutually exclusive by construction, since the component only renders it when `filtered.length === 0`.
- **A disabled state that carries copy must recede by colour, never by `opacity`**: a wrapper-level `opacity-50`
  composites every descendant against the page, so the sentence explaining the disabled state fades with it. On this
  app's white surfaces `text-neutral-300` (`#323636`, 11.9:1) collapses to ~2.8:1 and even `text-neutral-500` reaches
  only ~3.6:1 — no token survives, so there is no "pick a darker grey" escape. Both instances shipped the same shape:
  the WNA citizenship card was `opacity-50` and nothing else (QA F10), and `SelectInput` faded its whole wrapper
  including the error/description line — exactly when that line is doing the work of explaining why the field is
  inert. Second half of the rule, and why `opacity` was load-bearing at all: **`bg-neutral-50` is not a disabled
  fill** — `neutral-50` is `#FFFFFF`, identical to the surface, so `SelectInput`'s `disabled ? "bg-neutral-50"` was a
  no-op and the fade was doing 100% of the signalling. Use `bg-neutral-100/25` (≈`#F5F6F6`), keep the fill a
  *supporting* cue only, and let visible text carry the state (`StatusChip variant="neutral" compact`) — never colour
  alone. Same family as the disabled-submit-button and vanishing-escape-hatch rules above, one layer down in the
  styling.
- **Component context rule**: When a component needs context data, it consumes context itself inside `_components/`.
  Page does not wrap children in a single content component — each component is self-contained.
- **Component architecture**: One component per file. Use `useMemo` for computed/derived data. No conditional rendering
  of multiple states in return — split into separate components instead (e.g., loading, empty, list components).
- **A conditionally-rendered cell or slot in a shared list row fails silently — keep the placeholder, and pass
  explicit `undefined`**: two variants, neither reachable by `tsc`, lint, or the vitest suite (`.tsx`, node env).
  (1) Desktop rows are CSS grids with a fixed track template and **auto-placed** children (`cash-entry-row.tsx`'s
  `grid-cols-[1fr_0.8fr_1fr_0.9fr_1fr_1.1fr_56px]`), so a cell that renders conditionally must keep an
  always-rendered wrapper `<div>` and make only its *contents* conditional — drop the div and every later column,
  the action slot included, slides one track left, visible only in a screenshot. A legitimately empty cell holding
  its column is the correct outcome. (2) `MobileListCard`
  (`core/presentations/components/table/mobile-list-card.tsx`) gates `subtitle`, `meta`, `trailingTop` and
  `trailingBottom` on `!== undefined`, so a conditional slot must be a ternary yielding an explicit `undefined` —
  `cond && <X/>` yields `false`, which passes that check and opens an empty styled slot (for `trailingBottom`, the
  entire trailing column).
- **A stray `;` after a JSX element is a text node, not a statement terminator**: inside a JSX body, `<Foo />;`
  renders a literal semicolon into the DOM. Nothing in the toolchain catches it — `tsc` sees valid JSX, Prettier
  reformats around it, and `eslint-plugin-react`'s recommended set has no rule for bare-punctuation children
  (`react/jsx-no-literals` would flag every line of Indonesian UI copy, so it stays off). The defect is least
  visible in review and most visible in UAT when the sibling component can return `null`: `GoToSignIn` wrapped
  `<UseOtherAccountAction />;` in a flex div, and `UseOtherAccountAction` returns `null` both while user status
  loads and when `approvedAccount.count === 0` — so the div shipped holding nothing but a floating `;` at the
  bottom-left of the "Pilih Jenis Akun" step. When touching JSX, grep the shape:
  `grep -rnE '^[[:space:]]+(<[A-Za-z][^=]*/>|</[A-Za-z][A-Za-z0-9.]*>)[[:space:]]*;[[:space:]]*$' --include="*.tsx" src`
  — a `return <X />;` on its own line is correct JS, a punctuation-terminated JSX *child* never is. Same reading
  applies to a dead class token (`fo` in the step-indicator pill): a typo'd utility is invisible to Tailwind and to
  lint, so verify unknown class names against the `@theme` block in `globals.css` rather than assuming they resolve.
  A *valid* utility can be just as inert, and this is the harder half: Tailwind v4 emits every utility at the same
  specificity, so an override wins only by being emitted **later** — the order you wrote the classes in is
  irrelevant. `Button` bakes `flex h-11 w-full … p-3.5` into its base class and appends `props.className` after it,
  yet `.w-auto` and `.w-fit` are both emitted *before* `.w-full`, so `className="w-auto"` on a `Button` does nothing
  while `sm:w-auto` works only because responsive variants emit later. Use the `!` modifier (`w-auto!`) and confirm
  against the COMPILED CSS (grep `.next/static/css/*.css` after a build), never by reasoning about class order — an
  override that "obviously" wins is exactly the one that silently does not. The ~7 call sites already passing a bare
  `w-auto` to `Button` (`cash-entry-detail-error.tsx`, `journal-detail-error.tsx`, …) are known debt, not a pattern
  to copy.
- **Displayed mode and saved mode must be the same expression**: never mask a form value for display while the
  save path reads the raw one. `hasVariants={form.type !== ProductType.SERVICE && form.hasVariants}` passed a
  masked value to the card while `syncVariants` / `handleSubmit` read the unmasked `form.hasVariants`, so the
  UI showed one editor and the request wrote the other — edits silently discarded (LNS-570). If a mode should
  not apply, hide the *control* (`hideVariantToggle`) or change the *state*; do not fork the value between the
  renderer and the writer. When you fix one instance of this, grep for the twin — the create and detail pages
  share these cards and the same divergence usually exists on both.
- **A synthetic form row needs exactly one owner module**: when "single-price" (or any no-real-row-yet) mode is
  represented by an invented `VariantFormRow`, one module mints it *and* is the only module that reads its key
  back. `product-create-recipe-card.tsx` minted `{ key: "default", … }` for the recipe editor while
  `handleSubmit` built its own copy for the payload — the two agreed by coincidence, not by contract, and the
  payload copy never read the recipes Map, so a recipe entered on a product without variants was silently
  discarded (LNS-572). Fix by **collapsing the branch, not patching it**: resolve the rows once
  (`create/_utils/build-variant-params.ts::resolveVariantRows`), then map that single list to the payload with
  no second per-mode fork. A builder that still reads `hasVariants ? … : …` will drift again — the branch you
  don't touch is the one that rots. Keep the sentinel key module-private, as `NEW_SINGLE_VARIANT_KEY` in
  `[id]/_utils/sync-variants.ts` does; if two modules need it, that is the signal to move the derivation, not
  to export the constant.
- **A multi-part form buffer must never back-fill the parts the user has not chosen**: when one logical value is
  entered through several controls (day/month/year, and any similar composite), each control edits ONLY its own
  part, and a *single* pure resolver turns the parts into the committed domain value. The onboarding birth-date
  field did the opposite — `updateDate()` filled the untouched components with defaults (`day ?? 1`, `month ?? 1`,
  `year ?? currentYear`), so picking only a year committed 1 Januari of the current year and *passed the `isClean`
  submit gate*: a KYC birth date the user never entered. Model the buffer as independently-optional parts
  (`DateOfBirthParts`) and return a discriminated resolution (`empty | incomplete | invalid | underage | valid`)
  from one `_utils/` module (`onboarding/account/_utils/date-of-birth.ts`), so "partially chosen" is representable
  and fabricating a missing component is structurally impossible. Same family as LNS-570/572: the gate and the
  payload must read the SAME resolved value, never re-derive. Corollary: when an edit orphans another part (day 31
  → Februari), **clear it and say so** — silently clamping to `endOf("month")` is the same fabricate-a-value defect
  wearing a different hat, and a clear with no message is only marginally better. Clearing feedback must NOT be
  gated behind a touched/blur flag: selecting an option usually leaves focus on the control, so a blur-gated
  message never appears in the common path.
- **A dependent-field reset must distinguish a FIRST selection from a genuine switch**: when choosing option A
  invalidates field B, the reset condition is "B's governing value *changed* from one chosen value to another" — not
  "A was clicked". `nationality-radio-group.tsx` cleared `identityNumber` on every checked change, so a user who
  typed their NIK *before* picking "WNI" (the first, not-yet-made selection) had it silently wiped and was then
  shown "NIK harus terdiri dari 16 digit" against the field the app itself had just emptied — QA F9. On the
  `undefined → "WNI"` transition nothing has become invalid, so there is nothing to reset. Resolve the transition in
  one pure `_utils/` module returning both the buffer patch and whether anything was actually discarded
  (`nationality-change.ts::resolveNationalityChange`), and put the *only* writer of the coupled pair in the buffer
  owner (`CreateAccountProvider.changeNationality`) — a shallow-merge `update()` at a call site is how the invariant
  ends up re-implemented and drifting (LNS-570). Three refinements the F9 fix encodes: (1) preserve even a
  *partially typed*, currently-invalid value — only the user may discard their own input; (2) announce the clear
  only when something was actually lost, and remember that a "was cleared" flag is a **latch, not a derived
  value** — guarding the notice on `cleared && value === ""` reads as self-dismissing but is one-way, so refilling
  the field and then emptying it again resurrects a notice about a change made several edits ago; pair the guard
  with an explicit dismiss on the field's own edit path; (3) do not "helpfully" reset a field's `isTouched` on
  the governing change — after the fix that erases an error the user had already earned, which is the same defect
  wearing a different hat. Do not delete the switch branch just because the second option is currently
  `disabled` in the UI: `PASSPORT_PATTERN` (`/^[A-Za-z0-9]{1,16}$/`) **accepts a 16-digit NIK**, so enabling WNA
  later without the clear would submit a NIK as a passport number and pass validation. Known unfixed sibling of
  this class: `@addressDetail/page.tsx` writes `update?.({ province })` alone, so changing province leaves
  `city`/`district`/`subDistrict` from the old one — and since the resolver only checks `!data.city`, a stale
  entity is truthy and submits a city that is not in the submitted province.
- **Never pass `undefined` as a controlled input's `value`, and never encode "nothing chosen" as an out-of-range
  index**: React downgrades the element to UNCONTROLLED, and for
  `<select>` the HTML select-reset algorithm then auto-selects the first non-disabled `<option>` — silently
  committing a phantom value while a placeholder overlay makes the field look empty. `SelectInput`'s three
  birth-date selects showed exactly this (day `1` / `Januari` / current year, the year list being descending), and
  re-tapping the already-highlighted option fires no `change` event, so state stayed empty with no feedback.
  `SelectInput` now coerces `value ?? ""` after the props spread (mirroring `TextInput`), so the component owns its
  controlled contract — but an uninitialised provider/form-buffer field is the recurring source, so check the
  threading at the call site too. The same phantom-selection failure reaches Headless UI, where the sentinel is an
  index rather than `undefined`: `TabGroup` treats any non-`null` `selectedIndex` as controlled and its reducer
  resolves a NEGATIVE index to the first enabled tab, while `Tab` derives `selected` from that reducer state and not
  from the prop — so `selectedIndex={-1}` paints tab 0 as chosen while your state is still `null`, and the user reads
  a default they never picked. "Nothing picked yet" is simply not representable in that control: render the
  unselected state as plain toggle buttons keyed off `value === option` — carrying `aria-pressed`, since you lose the
  `aria-selected` that `Tab` emitted for free — or add an explicit placeholder tab. Note Tailwind v4's preflight resets `button`/`input`/`select`/`textarea` but has
  **no `fieldset`/`legend` rule at all** — a native pair needs `m-0 min-w-0 border-0 p-0` / `p-0` added by hand, and
  `<legend>` does not lay out reliably as a flex child. For a NEW group of controls sitting inline with ordinary
  div/span-labelled fields, prefer `role="group"` + `aria-labelledby`; reserve real `fieldset`/`legend` for fixing
  markup that is already broken (as `nationality-radio-group.tsx` was, with its `<legend>` an invalid sibling
  *before* the `<fieldset>`).
- **Interface Segregation (repositories)**: When a feature has distinct sub-resources (e.g., master + entries), split
  into separate repository/source interfaces, implementations, and files. Each concern gets its own file:
  `fixed-cost.ts` (master) + `fixed-cost-entry.ts` (entries).
- **Display vs Implementation pattern**: When a dialog/form is used across different contexts (e.g., list page vs detail
  page), extract a display component (props-based, no context) and create separate implementation components that
  consume their respective providers. Display component naming: `{noun}-form-dialog.tsx`. Implementation naming:
  `{noun}-edit-dialog.tsx`.
- **Advisory display field vs hard-gate field**: when the BE exposes an advisory display field alongside a
  hard-gate field (e.g. `ProductForSaleVariant.stock_status` advisory vs `is_available` hard-gate), consume the
  advisory field for display and the hard-gate field for sellability — never re-derive the server-owned predicate
  from the advisory field or from raw quantities (`current_stock` / `max_makeable`). The server owns the
  availability call; duplicating it in the FE invites drift. LNS-608: `stock_status` drives the "Habis" badge,
  `is_available` drives `disabled` / addable.
- **A server-side rule that blocks an action does not remove the affordance**: the menu shape stays uniform and
  a dialog explains the block. Suppressing an option on a per-row predicate makes two rows of the same table
  offer different menus, which reads as a broken or inconsistent UI rather than as a rule. Incident:
  `isNegativeBalance` suppressed "Sesuaikan Stok" across four surfaces (both `/inventory` lists plus the product
  and raw-material detail stock cards) while `StockAdjustmentDialog` already owned the block and its
  explanation; the fix kept the option everywhere and routed it to `StockAdjustmentBlockedDialog`. Corollary:
  when the guard already exists in one shared component, a second gate at the call site is not defence-in-depth,
  it is a divergent UI.
- **POS payment methods**: plugin pattern — see `src/app/(pos)/pos/_payment-methods/PLUGIN_PATTERN.md` before adding or
  modifying a payment method. The wizard chrome (header, step layout, transitions) is method-agnostic; each method is a
  self-contained handler in `_payment-methods/{type}/`.
- **Chrome page title**: when adding a new route under `(authenticated)/`, also add an entry to `ROUTE_MAP` in
  `src/app/(authenticated)/_components/header-title.tsx` — otherwise the chrome header silently falls back to
  "Dashboard". `ROUTE_MAP` is keyed by **literal pathnames only** — it does NOT match `[param]` bracket keys
  (`usePathname()` returns real ids, e.g. `/finance/journals/abc-123`, so a `"/finance/journals/[id]"` key never
  matches and the title falls back). For a dynamic route, add a `segments[]`-based `if` block in the `useMemo`
  (mirror `/accounts/:id`), not a bracket key.
- **Nav icon assets: one file per color state, and unique among siblings**: sidebar icons live in
  `public/assets/images/` as `{shape}-icon-{token}-w16-h16.svg` pairs — a `-neutral-300` (`#323636`) resting file and a
  `-primary-300` (`#007BFF`) selected file — wired through `NavigationGroup` / `NavigationItem`'s `iconPath` /
  `selectedIconPath`. The hex is baked into the asset (there is no `currentColor` variant), so keep it identical to the
  matching `@theme` token in `globals.css`. Geometry follows the sibling set: `16x16` viewBox, `fill="none"`,
  `stroke-width="1.33333"`, round `stroke-linecap` / `stroke-linejoin`. **Before pointing a new nav entry at an existing
  asset, check no sibling already claims it** — "Produk" and "Inventaris" both shipped on `box-icon-*`, leaving two
  adjacent groups indistinguishable. Also check the new silhouette against the Heroicons in `mobile-tab-bar.tsx`: the
  "Lainnya" sheet renders the full `NavigationMenu` above that bar, so both icon sets are on screen at once (a warehouse
  shape for Inventaris was rejected for colliding with `HomeIcon`). Two follow-ons apply when authoring the pair, not
  just pointing at it: (1) legacy assets like `coins-icon-*` and `box-icon-*` ship `stroke-width="1.33"` — set new SVGs
  to the `1.33333` value above, not to the skeleton you copied, or an AC will flag the mismatch (LNS-735 AC3 failed on
  exactly this). (2) a shape may exist as a partial color-state pair (one file) already in use by a non-nav component
  — grep usage before reusing or completing it (`wallet-icon-primary-300` is primary-only and claimed by
  `accounting/page.tsx` and invoices, so it is not free to complete as a nav pair).
- **List-page header/toolbar standard**: every list/index page uses one layout. Heuristic: **action top-right,
  filters bottom-left, search bottom-right.**
  - **Row 1 — header**: `ListPageHeader` (`core/presentations/components/list-page-header.tsx`) for top-level pages,
    or `DetailPageHeader` for `/settings/*` sub-pages. The primary create/add button ALWAYS goes in the header's
    `action` slot (right) — **never in the toolbar**. It is a `PrimaryButton` with `className="w-full sm:w-auto"` and
    the plus icon `<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />` (never a
    Heroicons `PlusIcon`, never icon-less). Wrap in `<Link>` when it navigates; keep the `onClick` (no `Link`) when it
    opens a dialog — and colocate the dialog + its open-state in the header component.
  - **Row 2 — toolbar**: the shared `TableToolbar` (`core/presentations/components/table/table-toolbar.tsx`). Filters
    (`DateRangePicker`, `FilterDropdown`, `TabFilter`, toggles) go in a LEFT group
    (`<div className="flex flex-row flex-wrap items-center gap-3">…</div>`); search goes on the RIGHT and is ALWAYS the
    shared `TableSearch` (`core/presentations/components/table/table-search.tsx`, `sm:w-[280px]`, right-pinned via
    `sm:ml-auto`) — never an inline `TextInput` search copy, never a bespoke search box.
  - **Row 3 (optional)**: active-filter `FilterPill` row below the toolbar.
- **Optional date-range reports must not use the shared `DateRangeProvider`**: `DateRangeProvider`
  (`core/presentations/providers/date-range-provider.tsx`) ALWAYS defaults to month-to-date and has no "no filter"
  state. For reports/lists where the date range is OPTIONAL and omitting both `start_date`/`end_date` returns ALL data
  (the both-or-neither rule), manage `{ from: Date | undefined; to: Date | undefined }` locally in the page-level
  provider (buku-besar style — `accounting/reports/_providers/buku-besar-provider.tsx`), defaulting both to
  `undefined` (= no filter). Enforce both-or-neither at pick-commit (ignore partial picks) and provide a
  "clear / semua periode" affordance back to the unfiltered state. (LNS-640)

### HTTP Requests

Custom `HttpRequest` class injects Clerk session headers:

- `Authorization: Bearer {token}` (account resolved from Clerk JWT `orgId` on the backend)
- Base URL from `NEXT_PUBLIC_BASE_API_URL`
- `FetchConfig` supports `requireAuth` (default `true`), `contentType`, and `headers` — no account-level config
- Services that bypass `HttpRequest` (manual `fetch`) must still set `Authorization` header manually

**Idempotency key minted at the orchestration layer**: the `Idempotency-Key` is generated in the dialog/handler that
owns form state (`crypto.randomUUID()`), then threaded `trigger → use case → repo → source → Idempotency-Key
header`. Never minted in the service/source layer (the LNS-117 anti-pattern) — the service only forwards what it's
given. The header rides `HttpRequest.request`'s **second** argument (`FetchConfig.headers`); the first
(`FetchParams`) has no `headers` field at all, so a key threaded into the body params never reaches the wire.
**Reuse the key across retries** until a definitive 4xx, then rotate — gate rotation with
`shouldRotateIdempotencyKey(httpStatus, code)` (`core/helpers/idempotency-rotation.ts`, as `pos-provider` does;
it lives in `core/` precisely so no feature reaches into another feature's copy). A fresh key per attempt is
unsafe: a lost 5xx/network response may have already been processed server-side, and a new key lets the server
record a second adjustment (duplicate stock decrement). Mint once per logical attempt, reuse on retry, rotate only
when the helper says so — and **never rotate in a bare `catch`**, which sweeps 5xx and network failures in with the
4xx. `journals/[id]/_providers/journal-detail-provider.tsx` rotates on every terminal error and is the one to fix,
not follow; copying it into a *cancellation* flow is worse than the original, because a rotated key on a retried
cancel records a second reversing entry.

That `httpStatus` argument is the **transport** status — `details["status"]`, which `HttpRequest` sets for exactly
this purpose — and **never `ServerError.httpCode`**, which is copied from the static `ErrorCodes` registry entry
rather than from the response. The two diverge on any code the registry does not carry: it falls back to
`ErrorCodes.UNKNOWN`, whose `httpCode` is **500**, so a genuine 4xx reads as a 5xx and the key is wrongly *kept* —
pinning every retry to a cached failure. `pos-provider` passes `details["status"]` and is the shape to copy;
`stock-adjustment-dialog.tsx` and `journal-detail-provider.tsx` (`err.httpCode === 422`) both branch on the static
label and are the ones to fix, not follow. The same distinction
applies anywhere you branch on a response status: `httpCode` is a static label, `details.status` is what happened.

**The BE contract is the live `dev-api openapi`, not a PR or ticket.** Fetch
`dev-api.loonas.id/openapi.json` to confirm a field/endpoint is live before modeling it; trust the
deployed schemas over BE PR or ticket prose — a ticket's own AC is prose, and can be wrong about the
contract it cites (LNS-736 carried a `422` and a `search` param the spec did not have; both were
corrected against the spec and the correction recorded on the ticket). Never pre-add a field to a
Model (`data/models/`) or Entity (`domain/entities/`) for a BE contract that hasn't shipped to
dev-api — that invents a contract the backend hasn't committed to (the LNS-637 FE guard
deliberately omitted a discriminator field that LNS-631 had not added). The ticket's **file list**
deserves the same skepticism: check each `new` path against the current tree before creating — a path
that already exists is an edit, often a load-bearing one whose doc comment says extend-not-duplicate
(LNS-738's list marked `cash-category-model.ts` "new" while `CashEntryEntity.category` depended on it).
The same skepticism covers the paths a ticket cites as templates or helpers, not just `new` ones — a cited
path can be wrong by root or never have existed (LNS-740's Notes cited
`features/invoice/presentations/helpers/idempotency-rotation.ts`, which does not exist — the helper is
`core/helpers/idempotency-rotation.ts`), **or exist and yet not demonstrate the behaviour it is cited for** —
LNS-782 named `products/_components/category-select.tsx` as the precedent for a wrapper-provided validation error,
but that call site has no error handling at all, its field being optional. So do not merely grep a cited path:
open it and confirm it actually shows the thing.
**Read error codes per operation, not per resource** — a code declared on POST is not implied on PATCH;
document and handle exactly what each operation declares (LNS-738: `CASH_CATEGORY_DIRECTION_MISMATCH`
is create-only — the update path rejects 409). **Read the declared
`format`, not just the type** — a spec
`{"type":"string","format":"date"}` means a plain `YYYY-MM-DD`, so serialise it with Luxon's
`toISODate()`, never `toISO()`: the latter emits an offset datetime
(`2000-05-14T00:00:00.000+07:00`) that can shift the calendar day if the BE normalises through UTC.
`POST /accounts/personal`'s `date_of_birth` shipped this way — a silent off-by-one on a KYC birth
date. The spec is also where you confirm a rule is *not* the backend's: that endpoint declares no
min/max and no age-related error code, so `MINIMUM_ACCOUNT_HOLDER_AGE_YEARS` is documented in-code
as an FE-owned floor rather than a mirrored BE constraint.

**A documented path is not a mounted route — verify the route, not just the schema.** A deploy can publish the
OpenAPI bundle without the routes it describes: LNS-736 found all six cash-entry paths in the live
`openapi.json` while every one still returned Express's `Cannot <METHOD> <path>` 404 handler. Probe with the
endpoint's real method and read the response **body**, not the status alone — a 404 handler and a genuine auth
gate are told apart by the body, and a malformed probe can return a plausible `400` that reads as "exists, auth
gated". This is the normal case when the FE and BE halves of one release run in parallel, and it does not block
FE work: build against the published spec, but say plainly in the PR and on the ticket that the routes are not
mounted, scope verification to unit tests, and never report an end-to-end check that could not have run.

**Partial-update PUTs: `undefined` omits, `null` clears — never conflate them.** `HttpRequest`
serialises with `JSON.stringify`, which **silently drops `undefined`-valued keys**. On a partial-update
endpoint an absent key means "leave unchanged", so `sku: value || undefined` in a request body does not
clear a field — it preserves the old one, reports success, and the stale value returns on the next
refetch. That was LNS-573. To clear a nullable field, send an explicit `null`; widen the param type to
`string | null` rather than reaching for `undefined`. Note most Loonas write endpoints reject `""` with a
400, so an empty form input must be converted, not forwarded. Corollary (LNS-743): an editor buffer for a
nullable **saved** value needs three distinguishable states — never-set, cleared-by-user, and
saved-but-no-longer-valid (its referenced record is gone from the list). A bare nullable id conflates all
three, and only the first two map onto omit vs explicit `null`; model the selection as a tagged type and
resolve it once in the pure body builder to `absent | null | blocked`, so body semantics and UI state
derive from one source instead of re-deriving each other.

Two rules follow, and both are load-bearing:

- **Build partial-update bodies explicitly; never `body: params` passthrough.** Passthrough is exactly how
  key-omission became an accident of the serializer rather than an intentional encoding. Follow
  `ProductServiceImpl.update` / `updateVariant`: `if (params.x !== undefined) body["x"] = params.x`. A
  `POST` create may stay passthrough when it needs no key renaming or nesting — comment the asymmetry so
  it does not read as an oversight.
- **Test the serialized payload, not the params object.** `expect(obj.sku).toBeUndefined()` passes whether
  the bug is present or not, because the key is a literal property either way; only
  `JSON.stringify(body)` reveals whether it survives the wire. Mock `HttpRequest.request` with a `vi.fn()`
  that captures `params.body` and assert on the stringified result — see
  `features/invoice/data/sources/create-pos-sale-body.test.ts` and
  `features/product/data/sources/product.test.ts`. **Where the endpoint also has a header contract
  (`Idempotency-Key`), capture the second argument too.** Both precedent helpers take only the first, so a test
  copied from them cannot see the header and passes just as happily on a request that never sent one — widen the
  mock to `(params, config)` and assert on `config.headers` (`features/accounting/data/sources/cash-entry.test.ts`).

**Dead error-code removal — branch and constant, not just the branch.** When a BE error code becomes
unreachable (confirmed absent from `dev-api.loonas.id/openapi.json`), remove the FE runtime handler **and**
the now-unreferenced shared `ErrorCodes` constant, not just the handler. LNS-608: `POST /pos/sales` can no
longer return `INSUFFICIENT_STOCK`, so the `pos-provider` handler, `handleStockErrorDetails`,
`StockErrorEntry`, **and** `ErrorCodes.INSUFFICIENT_STOCK` in `core/resources/server-error.ts` were all
removed — leaving the dead constant is exactly the "removed rather than left as dead code" intent.

The `""` → `null` conversion belongs in the **app layer that owns the form buffer** (e.g.
`products/[id]/_utils/sync-variants.ts`), not the service: `""` is a presentation fact about an emptied
text input, `null` is the domain fact. Use one fallback expression across every path that builds the same
value — forking `|| null` on update and `|| undefined` on create recreates the LNS-572 drift.

### Deprecated — Do Not Use

| Deprecated                                             | Replacement                                                                                                                                            |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Card` (shadow-based, `text-gray-*`)                   | `SectionCard`                                                                                                                                          |
| `FilledButton`                                         | `PrimaryButton` / `SecondaryButton` / `DangerButton` from `core/presentations/components/buttons/`                                                     |
| `LocalStorageSessionService`                           | `ClerkSessionService` (will throw "No valid session")                                                                                                  |
| Lottie animations (`@lottiefiles/react-lottie-player`) | Skeleton loading (`animate-pulse`)                                                                                                                     |
| `OutlinedButton`                                       | `SecondaryButton` with `outlined` prop                                                                                                                 |
| Template literal classNames (`` `${a} ${b}` ``)        | `clsx(a, b)`                                                                                                                                           |
| `text-gray-*` color classes                            | `text-neutral-*` equivalents                                                                                                                           |
| `X-Account-Id` header                                  | Backend resolves account from Clerk JWT `orgId` — do not add account headers                                                                           |
| `selectedAccount` on `SessionEntity`/`SessionModel`    | Account resolved server-side from JWT; no client-side account on session                                                                               |
| `requireAccount` in `HttpRequest` config               | Removed — account resolution is implicit via JWT                                                                                                       |
| `SelectedAccountProvider` context value                | Deprecated — provider only handles redirects; use `useGetCurrentAccount()` for account data                                                            |
| `*-impl.tsx` monolith pattern (new code)               | Provider + split components pattern. Page composes provider + components, each component consumes context. Existing pages will be migrated gradually.  |
| `InvoiceTableShell` (removed)                          | `TableContainer` + `TableHeader` + `TablePagination` from `core/presentations/components/table/`. Toolbar is a sibling above the container; header is the first child; pagination is the last child, gated `meta && meta.totalPages > 1`. |
| Inline edit/delete icon buttons in tables (new code)   | `ActionMenu` from `core/presentations/components/action-menu.tsx` — consistent 3-dot action menu                                                       |
| `ProductPhotoCard` standalone                          | Split into `ProductPhotoGrid` + `ProductPhotoDropzone` + `ProductPhotoUploadArea`                                                                      |

### Environment

Required env vars (see `.env.local`):

- `NEXT_PUBLIC_BASE_API_URL` — Backend API base URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key

## Conventions

### Imports

Always use `@/` path alias (maps to `src/`). No relative imports.

### File Naming

| Type                   | Pattern                                                          | Example                             |
|------------------------|------------------------------------------------------------------|-------------------------------------|
| Use cases              | `{verb}-{noun}.usecases.ts` (new) or `{verb}-{noun}.ts` (legacy) | `get-invoice.usecases.ts`           |
| Hooks                  | `use-{verb}-{noun}.ts`                                           | `use-get-invoice.ts`                |
| Hook types             | `use-{verb}-{noun}.types.ts`                                     | `use-get-invoice.types.ts`          |
| Entities               | `{noun}.ts`                                                      | `invoice.ts`                        |
| Guards                 | `domain/guards/{noun}-guards.ts`                                 | `invoice-guards.ts`                 |
| Repo interfaces        | `domain/repositories/{noun}.ts`                                  | `invoice.ts`                        |
| Repo impls             | `data/repositories/{noun}.ts`                                    | `invoice.ts`                        |
| Services               | `data/sources/{noun}.ts`                                         | `invoice.ts`                        |
| Factories              | `{noun}-factory.ts`                                              | `pay-in-detail-factory.ts`          |
| Providers (page-level) | `_providers/{noun}-provider.tsx`                                 | `fixed-cost-entries-provider.tsx`   |
| Display components     | `{noun}-form-dialog.tsx`                                         | `raw-material-edit-form-dialog.tsx` |

Directories use kebab-case. Components use kebab-case filenames.

### Core Components

| Component       | Location                                           | Usage                                                 |
|-----------------|----------------------------------------------------|-------------------------------------------------------|
| `ActionMenu`    | `core/presentations/components/action-menu.tsx`    | 3-dot action menus in tables and cards                |
| `NumberDisplay` | `core/presentations/components/number-display.tsx` | Thousand separator formatting with optional suffix    |
| `Dropzone`      | `core/presentations/components/dropzone.tsx`       | Drag & drop file upload area                          |
| `MiniToggle`    | `core/presentations/components/mini-toggle.tsx`    | Small toggle switch display                           |
| `StatusChip`    | `core/presentations/components/status-chip.tsx`    | Status badges (success/warning/error/primary/neutral) |
| `TablePagination` | `core/presentations/components/table/table-pagination.tsx` | Pagination controls; pairs with `TableContainer` + `TableHeader` |
| `TableToolbar`  | `core/presentations/components/table/table-toolbar.tsx` | List-page toolbar row: filters left, search right (see List-page header/toolbar standard) |
| `TableSearch`   | `core/presentations/components/table/table-search.tsx` | Standard list search input (`sm:w-[280px]`, right-pinned); use instead of inline `TextInput` search |

### Pagination

Newer features use `PaginatedData<T>` from `core/resources/paginated` in repository interfaces. Source interfaces use
custom `ListXxxServiceResult` types (returning Models, not Entities).

### Fetcher Naming

SWR fetcher functions use singular noun: `ListStockItemFetcher` (not `ListStockItemsFetcher`).

### Code Style

- Prettier: 2-space indent, 120 char width
- `@typescript-eslint/no-explicit-any` is disabled
- Domain layer must not import from presentation layers. Domain source interfaces (`domain/sources/`) may import data
  models since they define the service contract that data layer implements. Conversely, **presentation**
  (`presentations/`) and **domain** (`domain/entities/`, `domain/usecases/`) layers must **not** import from
  `data/models/` — that exemption is `domain/sources/`-only; cross the seam via the Model's `toEntity()` into a domain
  entity/type.
- **Neutral palette diverges from Tailwind defaults**: `neutral-50` is `#FFFFFF` (pure white), not off-white. For
  visible-on-white chips/badges/borders, use `neutral-100` (`#D9DADA`) or darker. Check `src/app/globals.css` `@theme`
  for the canonical palette.
- **Inline text links use `text-primary-400`, not `text-primary-300`**: `primary-300` (`#007BFF`, Lunas Blue) is
  **3.98:1** on white — below the 4.5:1 WCAG AA floor PRODUCT.md sets for body text. `primary-400` (`#005ABB`) is
  **6.61:1** and is DESIGN.md's documented token for blue text needing contrast on white; `hover:text-primary-500`
  remains available beneath it. Roughly six existing links (`gross-profit-block-no-pos.tsx`, `data-kurang-card.tsx`,
  `coa-account-delete-mapping-body.tsx`, `coa-account-delete-journal-lines-body.tsx`, `production-create-form-card.tsx`,
  `opening-balance-readonly.tsx`) still use the `primary-300` base — that is known a11y debt, **not** a convention to
  match. Same defect class as `text-warning-400` body text (~3.4:1). Also underline inline links by default rather than
  `hover:underline` only: a link sitting inline among similarly-weighted text needs a non-color cue for users who never
  hover (WCAG 1.4.1). The `h-11` interactive-height rule does not apply to inline links — WCAG 2.5.5 exempts links
  within a run of text. Generally: a color used at many call sites is not thereby AA-compliant — compute the ratio
  against `globals.css` before citing any color as established.
- **Validation copy renders in Tailwind's default `text-red-500`, which fails AA — app-wide debt, do not fix it
  locally**: `red-500` is `oklch(63.7% 0.237 25.331)` ≈ `#fb2c36`, **3.81:1** on white, under the 4.5:1 body-text
  floor. It is the validation color in ~22 component files (`TextInput`, `SelectInput`, `nationality-radio-group.tsx`
  and the form fields that follow them), so darkening it in one component makes that field inconsistent with every
  other for no user gain. What makes it worth recording rather than shrugging at: the project already ships a
  compliant ramp for exactly this use — `error-500` (`#B42318`) is **6.57:1** and `error-400` (`#D92D20`) is
  **4.83:1**, already used at ~57 call sites — so the app reaches for a Tailwind default where its own token is both
  available and passing. Same class as the `primary-300` and `text-warning-400` debt above, the app-wide
  secondary/placeholder token `neutral-200` (`#BDBDBD`, **1.88:1**) as used by `SearchCombobox`'s disabled-option
  text under an `opacity-50` wrapper, and core `ConfirmationDialog`'s warning-slot copy `text-error-300`
  (`#F04438`, **3.76:1**): each needs one deliberate sweep with its own ticket, never a drive-by. All ratios here
  are measured against `globals.css`, not estimated.
- **Nullable API fields where `null` = unclassified/unknown render distinctly — never as `0` or `Rp 0`**: when a row
  field is nullable and `null` means the system has NOT classified/measured it (not that it found zero), render `null`
  as an em-dash (`—`, `text-neutral-200`) or "Belum diklasifikasi" — NEVER `0`. Same for nullable money:
  `correcting_amount: null` is the ordinary case, never `Rp 0`; `current_wac: null` → em-dash. Do not pass nullable
  values to `NumberDisplay` (no null handling) — gate first: `value != null ? <BalanceDisplay value={value}/> : <span className="text-neutral-200">—</span>`. A per-row quantity in a row-specific `unit` (pieces vs grams) is meaningful
  WITHIN that row only — never total/subtotal/aggregate it across rows (a count like `meta.total` is fine). Extract
  these render-decisions to a pure `_utils/*.ts` with a colocated `.test.ts` (mirror
  `accounting/reports/cost-valuation-gaps/_utils/classify-row.ts`). (LNS-640)

### Git

- Branch naming: prefix with `feat/`, `fix/`, `refactor/`, or `hotfix/` + `{description}` (e.g. `fix/exclude-pos-from-outgoing-invoices`). Do NOT use the legacy `features/` prefix.
- Always create branches from `dev`
- Commit style: Conventional Commits — `feat(scope):`, `fix(scope):`, `refactor(scope):`, `chore(scope):`

## Design Context

Design intent lives in two root files (source of truth for any UI/UX work; read before designing new screens):

- **`PRODUCT.md`** — strategic: register (`product`), users (Indonesian SME owners + staff), the all-in-one merchant
  OS purpose, brand personality (**trustworthy, precise, calm**), references (Mekari, Xero), anti-references, the 5
  design principles, and the WCAG 2.1 AA bar.
- **`DESIGN.md`** — visual: the "Calm Ledger" system. Lunas Blue (`#007BFF`) as the single accent, flat
  border-not-shadow elevation, Manrope on a fixed rem scale, and the canonical component vocabulary. Machine-readable
  tokens live in its YAML frontmatter; `.impeccable/design.json` is the live-mode sidecar.

These are maintained via the `impeccable` skill (`/impeccable document` regenerates DESIGN.md; `/impeccable critique`
/ `audit` / `polish` evaluate surfaces against this intent).
