---
name: icon-alt-text-beside-visible-label-generalizes
description: the icon+adjacent-visible-label -> alt="" WCAG 1.1.1 rule isn't nav-specific; apply it to any Image icon paired with a visible text label, and prefer alt="" over a more-specific/per-variant alt string
metadata:
  type: feedback
---

[[project_nav_icon_alt_text_and_sibling_collision_check]] documented this defect class only for
`NavigationGroup`/`NavigationItem` sidebar icons. Confirmed in the LNS onboarding stray-JSX-artifact review
(2026-08-14) that the same principle applies outside nav: `AccountTypeCard`
(`src/app/(user)/onboarding/account/@accountType/_components/account-type-card.tsx:18`) hardcodes
`alt="Person Icon"` on an `Image` whose `iconPath` is a prop — so the "Akun Bisnis" card's building icon is also
announced as "Person Icon" (wrong AND redundant, since `props.title` sits right below it with the same info).

**Why:** WAI's alt-decision-tree: when an icon sits adjacent to visible text conveying the same meaning, the
correct WCAG 1.1.1 treatment is `alt=""` (decorative, skipped by screen readers) — not a more accurate/specific
per-variant string. A tempting-looking fix ("plumb an `iconAlt` prop so each card gets the right label") still
produces doubled/redundant announcements and is the wrong fix even though it corrects the mismatch.

**How to apply:** when a review turns up any `<Image alt="...">` sitting next to a sibling text node that already
conveys the icon's meaning, recommend `alt=""` over a more-specific alt string, regardless of whether the icon
is in `NavigationGroup`, a card component, a list row, or anywhere else. Judge "adjacent" narrowly — an icon with
no nearby text label (e.g. a bare hover-reveal chevron with no caption) is a separate case, not covered by this
rule, and needs its own descriptive alt or `aria-label` if it's interactive.

Also confirmed in the same review: a mismatched/wrong-but-not-yet-broken alt-text finding on a file the diff
doesn't touch, with a genuinely debatable correct fix (decorative vs. descriptive), is the right kind of finding
to route to a separate ticket rather than fold into an in-flight PR — even under this project's "fold adjacent
same-class bugs into the PR" default, because the defect class differs from what the PR is fixing and the fix
required actual judgment, not a mechanical parallel.
