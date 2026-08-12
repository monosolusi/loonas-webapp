---
name: feedback_headless_chrome_screenshot_viewport_floor
description: Chrome headless --screenshot enforces an internal viewport floor around 500px wide regardless of a smaller --window-size, causing the output PNG (sized to the requested width) to crop a wider, still-centered layout — looks like a rendering bug but isn't
metadata:
  type: feedback
---

When using the cached Playwright Chromium's `--headless --screenshot=...
--window-size=W,H` CLI pattern (the project's established static-preview
verification technique) to test a **mobile** (<640px) layout, requesting a
narrow width like `375,700` does NOT produce a 375px-wide layout viewport.
Confirmed by injecting a `getComputedStyle`/`getBoundingClientRect` dump
into the test page: requesting `375,700` (or even `281,525`) still yields
an internal viewport of `500x613`. The output PNG is written at the
*requested* dimensions, so it ends up as a 375px-wide crop of a 500px-wide
centered layout — the centered content appears shifted right and clipped,
which looks exactly like a real centering/overflow bug in the component
under test but is a pure tooling artifact. `--headless=new` and
`--force-device-scale-factor=1` do not change this floor.

**How to apply:** when verifying a `<sm:` (mobile) breakpoint via this
screenshot technique, request `--window-size` at or above the floor (e.g.
`500,800`) rather than a "true" phone width. 500px is still below
Tailwind's `sm:` (640px) breakpoint, so the mobile code path is still
correctly exercised — just diagnose any apparent off-center/clipped mobile
screenshot by first re-testing a trivial-content page at the SAME component
markup before concluding the component itself is broken. Desktop widths
(1280px etc.) are well above the floor and are not affected — confirmed via
the same rect-dump technique (`mid width: 1280px` matched exactly).
See this refactor (branch `refactor/dialog-footer-single-row`) for the full
repro sequence.
