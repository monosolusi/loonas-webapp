---
name: openapi-webfetch-truncation
description: WebFetch summariser truncates and even invents fields on dev-api.loonas.id/openapi.json — fetch the raw JSON via curl + python and parse the dict
metadata:
  type: feedback
---

`WebFetch https://dev-api.loonas.id/openapi.json` returns a summarised view that (a) truncates mid-document so later paths look "missing" and (b) sometimes fabricates plausible-but-wrong field names from the summariser's prior. During LNS-193 planning, it told me `/dashboard` response had `revenue.total` + `revenue.comparison.previous_period` — the raw spec has `revenue.amount` + `revenue.last_month_amount` + `revenue.changes`.

**Why:** The full spec is ~413KB; WebFetch's content-window is smaller. The summariser then fills gaps from training-data priors, which produces convincing-looking falsehoods.

**How to apply:** For BE contract verification, **never trust WebFetch on the OpenAPI JSON**. Instead: `curl -s https://dev-api.loonas.id/openapi.json -o /tmp/loonas-openapi.json && python3 -c "import json; spec=json.load(open(...))"` and walk the dict with a `$ref` resolver. Treat the WebFetch result as a hint at most; the raw JSON is the source of truth. The same approach also lets you confirm/deny endpoint existence cheaply.
