---
name: Loonas
description: The calm operating system for Indonesian merchants — payments, invoicing, and the whole back office.
colors:
  lunas-blue: "#007BFF"
  blue-pale: "#F0F7FF"
  blue-mid: "#4CA2FF"
  blue-deep: "#005ABB"
  ledger-navy: "#001933"
  surface: "#FAFAFA"
  white: "#FFFFFF"
  mist: "#D9DADA"
  silver: "#BDBDBD"
  charcoal: "#323636"
  ink-soft: "#1B1B1B"
  ink: "#0D0E0E"
  success: "#17B26A"
  success-deep: "#067647"
  success-pale: "#F6FEF9"
  warning: "#F79009"
  warning-deep: "#B54708"
  warning-pale: "#FFFCF5"
  error: "#F04438"
  error-deep: "#B42318"
  error-pale: "#FFFBFA"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.05em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  control: "44px"
components:
  button-primary:
    backgroundColor: "{colors.lunas-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    height: "{spacing.control}"
    padding: "14px"
  button-primary-hover:
    backgroundColor: "{colors.blue-deep}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    height: "{spacing.control}"
  button-outline-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.lunas-blue}"
    rounded: "{rounded.lg}"
    height: "{spacing.control}"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "{spacing.control}"
    padding: "12px"
  section-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  status-chip-success:
    backgroundColor: "{colors.success-pale}"
    textColor: "{colors.success-deep}"
    rounded: "{rounded.sm}"
  nav-item-selected:
    textColor: "{colors.lunas-blue}"
    rounded: "{rounded.md}"
    padding: "12px"
---

# Design System: Loonas

## 1. Overview

**Creative North Star: "The Calm Ledger"**

Loonas is bookkeeping made calm. The surface behaves like a well-kept ledger: every figure is
legible and in its place, the page breathes with whitespace, and a single blue signal does all
the pointing. An owner runs payments, invoicing, POS, stock, and the books out of one app — so
the system's first job is to make twelve modules feel like one quiet, dependable product. Nothing
shouts. Color, weight, and motion are spent only where money or state actually changes; everywhere
else the interface gets out of the way.

The reference points are the business tools Indonesian owners already trust — **Mekari** and
**Xero**: blue-accented, generous with whitespace, clean cards and tables, data you never have to
squint at. The trust is structural, not decorative. White cards sit on a near-white surface, divided
by hairline borders, never by drop shadows or glass. The brand promise — *lunas*, settled — is the
emotional anchor: the moment a balance hits zero should feel earned and clear.

This system explicitly rejects four things. **Generic templated SaaS** (cream/gray dashboards,
identical icon-heading-text card grids, hero-metric tiles) — the biggest risk for an app this broad.
**Loud crypto/neon fintech** (dark-mode gradients, glassmorphism, glow) — flash that undermines
money-trust. **Cluttered legacy ERP** (every field on one grey page, no hierarchy). And **consumer-toy
playfulness** (over-rounded, emoji-heavy, bouncy pastels) — too casual for finance and compliance.

**Key Characteristics:**
- One quiet voice: Lunas Blue (`#007BFF`) is the only saturated color on most screens, reserved for action, selection, and "pay attention."
- Flat by construction: depth is carried by 1px borders and tonal layering, never shadows.
- A single typographic family (Manrope) tuned across a fixed rem scale — no fluid display type.
- Money legibility is non-negotiable: Indonesian-formatted figures (`Rp 1.250.000`), always clear.
- A 44px control rhythm (`h-11`) across every interactive element for calm vertical cadence and touch comfort.

## 2. Colors

A restrained palette: a deep navy-to-blue brand family, a darker-than-default neutral ramp for ink and
structure, and three pale-tinted semantic families for financial state.

### Primary
- **Lunas Blue** (`#007BFF`, primary-300): The signature. The only saturated color most screens earn — primary buttons, the selected nav item, focus rings, links, and active state. Its rarity is the point.
- **Blue Deep** (`#005ABB`, primary-400): Pressed/hover deepening of the action color and for blue text that needs more contrast on white.
- **Ledger Navy** (`#001933`, primary-500): The darkest brand tone. Deep headers, inverse surfaces, and high-trust emphasis. Reads almost black but stays in-family.
- **Blue Pale** (`#F0F7FF`, primary-50): The wash behind primary-toned chips and selected/info states.

### Neutral
A purpose-built ramp — **darker than Tailwind defaults**. `neutral-50` is pure white, and the mid-steps jump quickly to near-black, so there is no muddy grey middle for text.
- **White** (`#FFFFFF`, neutral-50): Card and panel surfaces, table header rows. The raised plane above the surface.
- **Surface** (`#FAFAFA`, background): The app canvas. Cards float on it as flat white planes.
- **Mist** (`#D9DADA`, neutral-100): The default hairline — card dividers, input borders, table row rules. The lightest grey that is actually visible on white.
- **Silver** (`#BDBDBD`, neutral-200): Placeholder text, disabled fills and text, the quietest UI grey.
- **Charcoal** (`#323636`, neutral-300): Secondary and rest-state text — nav labels, table column headers, supporting copy.
- **Ink** (`#0D0E0E`, neutral-500): Primary body and heading text. The foreground. Maximum contrast against white and surface.

### Semantic (financial state)
Each is a pale tint paired with a deep tone — the tint backs the chip, the deep tone carries the text. Built on the Untitled-UI ramp.
- **Success** (`#17B26A` / deep `#067647` / pale `#F6FEF9`): Paid, settled (*lunas*), active, confirmed.
- **Warning** (`#F79009` / deep `#B54708` / pale `#FFFCF5`): Pending, due-soon, awaiting action, partial.
- **Error** (`#F04438` / deep `#B42318` / pale `#FFFBFA`): Overdue, failed, rejected, destructive.

### Named Rules
**The One Signal Rule.** Lunas Blue is the only saturated accent on a standard screen, and it never decorates — it marks the primary action, the current selection, or a focus ring. If two things on a screen are blue "for emphasis," one of them is wrong.

**The Tint-and-Deep Rule.** Financial status is always a pale-50 background under a -500 deep-tone label (`bg-success-50 text-success-500`). Never a full-saturation -300 fill behind white text; that is loud where calm is required.

**The Color-Is-Never-Alone Rule.** Status must pair color with an icon or word. Red alone does not mean "overdue" for a colorblind owner — the label does.

## 3. Typography

**Body & UI Font:** Manrope (with `system-ui`, `-apple-system`, sans-serif fallback)
**Mono Font:** `ui-monospace, SFMono-Regular, Menlo` — reserved for IDs, codes, and raw references.

**Character:** One humanist-geometric sans does the entire job — headings, labels, buttons, body, and data. Manrope's even color and open counters keep dense financial tables readable; its weights (400/500/600/700) carry the whole hierarchy without a second face. *(Plus Jakarta Sans is loaded in the document head but is not wired into the theme — Manrope is the single canonical family.)*

### Hierarchy
- **Display** (700, `1.875rem`/30px, `tracking-tight`): Page titles (`h1`). Fixed size — never fluid. The only place bold-tight type appears.
- **Title** (600, `1rem`/16px, `leading-6`): Section-card headers, dialog titles, emphasized labels. Semibold carries hierarchy at body size.
- **Body** (400, `1rem`/16px, `leading-6`): The default. Form labels, input text, card copy, table cells. Prose caps at 65–75ch.
- **Nav / compact** (500, `0.875rem`/14px): Navigation labels and secondary controls.
- **Label** (500, `0.75rem`/12px, `tracking-wider`, UPPERCASE, charcoal): Table column headers and micro-labels only. The one place uppercase tracking is allowed — it is a data convention, not a decorative eyebrow.
- **Caption** (400, `0.75rem`/12px, `leading-4`): Input descriptions and error text.

### Named Rules
**The Fixed-Scale Rule.** Product type is sized in fixed rem, never `clamp()`. A heading that shrinks inside a sidebar looks broken, not responsive.

**The One-Family Rule.** Manrope carries everything. Reaching for a second typeface to "add personality" is forbidden — personality here is restraint.

**The Uppercase-Is-Earned Rule.** UPPERCASE tracked text is permitted only on table/data labels. Never as a section eyebrow above headings.

## 4. Elevation

This system is **flat by construction**. Depth is communicated through tonal layering and hairline borders, not shadows. A white (`#FFFFFF`) card on the near-white (`#FAFAFA`) surface, bounded by a 1px Mist border, is the entire elevation language. The legacy shadow-based `Card` is deprecated; `SectionCard` (border, no shadow) replaced it precisely to remove drop shadows from the system.

The single exception is **state feedback on focus**: inputs and interactive controls draw a 2px focus ring in Lunas Blue at ~20% alpha (`focus-within:ring-2 ring-primary-300/20`) plus a solid blue border. The ring is the only "lift" in the system, and it exists to answer "where am I," not to decorate.

### Named Rules
**The Border-Not-Shadow Rule.** Surfaces separate with a 1px Mist (`#D9DADA`) border, never a `box-shadow`. If a card needs a drop shadow to read, the layout has failed.

**The Ring-On-Focus-Only Rule.** The blue focus ring is the system's sole glow. It appears on focus and nowhere else — no resting glows, no hover shadows, no ambient blur.

## 5. Components

Components are **calm and dependable**: quiet at rest, predictable in behavior, with the accent held back for state. Every interactive element stands 44px tall (`h-11`) and rounds to 8px (`rounded-lg`).

### Buttons
- **Shape:** Gently rounded (8px, `rounded-lg`), full-height 44px, centered icon+label, `14px` padding.
- **Primary:** Lunas Blue fill, white label (`bg-primary-300 text-white`). Hover deepens to ~90% opacity; `transition-colors` 200ms. Disabled drops to Silver fill (`bg-neutral-200`) at 50% opacity; loading shows a spinner and `cursor-wait`.
- **Secondary:** Charcoal fill, white label (`bg-neutral-300 text-white`) — present but quiet, for the lower-priority commit.
- **Outline:** Transparent fill, 2px Lunas Blue border and blue label (`border-2 border-primary-300 text-primary-300`), hover wash `bg-primary-300/10`. The default "second action."
- **Danger:** Error-toned variant for destructive commits only.
- **Inverse:** White-on-dark variants for navy/inverse surfaces.

### Inputs / Fields
- **Style:** White field, 1px Mist border, 8px radius, 44px tall, `12px` padding, `12px` gap for add-ons/icons. Label sits above at body size; required fields append a colored asterisk.
- **Add-ons:** Inline text affixes for money and rates — `Rp` left add-on, `%` right add-on — in Charcoal.
- **Focus:** Border shifts to Lunas Blue and a 2px blue/20% ring appears (`focus-within:border-primary-300 focus-within:ring-primary-300/20`).
- **Error:** Border and ring turn Error-toned; a 12px error caption appears below.
- **Disabled:** Mist border and Mist fill, Charcoal text, `not-allowed` cursor. Placeholder text is Silver.

### Cards / Containers (`SectionCard`)
- **Corner Style:** 8px (`rounded-lg`).
- **Background:** White on the `#FAFAFA` surface.
- **Border:** 1px Mist-200 outer; a 1px Mist-100 divider under the header.
- **Header:** `px-6 py-4`, optional 16px icon, semibold Title, optional right-aligned action.
- **Body:** `p-6` (24px) by default.
- **Shadow Strategy:** None — see Elevation. The border is the whole story.

### Status Chips (`StatusChip`)
- **Style:** Pale-tinted background, deep-tone label (`bg-success-50 text-success-500`), 4px radius (`rounded-sm`), `px-2.5 py-1`, 12px medium.
- **Variants:** success / warning / error / primary / neutral, plus a `compact` size.
- **Always paired** with a word; never color alone.

### Navigation (sidebar)
- **Item:** `p-3`, 6px radius (`rounded-md`), 16px icon + 14px medium label, `transition-colors` 200ms.
- **Rest:** Transparent background, Charcoal label.
- **Hover:** `bg-primary-300/20`, label turns Lunas Blue.
- **Selected:** `bg-primary-300/10`, label and icon turn Lunas Blue. The active route is the only persistently blue item.

### Money Display (signature component)
`CurrencyDisplay` / `NumberDisplay` render Indonesian-formatted figures — `Rp ` prefix plus `value.toLocaleString("id-ID")` → `Rp 1.250.000`. This is the most important component in the system: money is always grouped with `.` thousand separators, never a raw integer. Treat it as the canonical way any rupiah amount reaches the screen.

## 6. Do's and Don'ts

### Do:
- **Do** keep Lunas Blue (`#007BFF`) as the single saturated accent — primary action, current selection, focus ring. Nothing else competes for it.
- **Do** separate surfaces with a 1px Mist (`#D9DADA`) border on white-over-`#FAFAFA`; let tonal layering carry depth.
- **Do** size every interactive control at 44px tall (`h-11`) and round it to 8px (`rounded-lg`) for consistent rhythm.
- **Do** render every rupiah value through `CurrencyDisplay` / `NumberDisplay` so it always reads `Rp 1.250.000`.
- **Do** back financial status with a pale-50 tint under a deep-500 label, and always pair the color with a word or icon.
- **Do** keep Manrope as the only typeface, sized in fixed rem across the whole hierarchy.

### Don't:
- **Don't** ship **generic templated SaaS** — cream/gray dashboards, identical icon-heading-text card grids, or hero-metric tiles with gradient accents.
- **Don't** drift toward **loud crypto/neon fintech**: no dark-mode gradients, glassmorphism, glow, or decorative blur.
- **Don't** rebuild a **cluttered legacy ERP** — no walls of fields with no hierarchy; progressive disclosure over density-for-its-own-sake.
- **Don't** go **consumer-toy**: no oversized radii, emoji, bouncy/elastic motion, or pastel-everything.
- **Don't** add a `box-shadow` to a card to make it read — if it needs a shadow, fix the layout (Border-Not-Shadow Rule).
- **Don't** use `text-gray-*` classes or invent a `bg-primary-default` token — use the `neutral-*` ramp and real `primary-*` steps (both appear as drift in legacy files; do not copy them).
- **Don't** use `clamp()` / fluid type for product headings, and never use UPPERCASE tracked text as a section eyebrow — it is reserved for table/data labels.
- **Don't** put a second saturated color next to Lunas Blue for "emphasis," or use a full-saturation -300 fill behind white text for a status chip.
