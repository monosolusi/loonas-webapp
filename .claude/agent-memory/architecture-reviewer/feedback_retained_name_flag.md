---
name: feedback-retained-file-name-flag
description: When a widget is refactored and sub-components are retained with their old parent-widget name prefix, flag the naming mismatch as a minor issue for EL consideration — do not mandate rename, but surface it.
metadata:
  type: feedback
---

In LNS-232, `dashboard-recent-invoices-column-header.tsx`, `dashboard-recent-invoices-skeleton-row.tsx`, `dashboard-recent-invoices-arrow-icon.tsx`, and `dashboard-recent-invoices-status-text.tsx` were retained and reused by the new `dashboard-recent-activity-*` widget. Their names still reference "recent-invoices" even though the parent widget is gone.

**Why:** EL needs visibility into naming drift. Misleading names can confuse future engineers about which widget owns the component.

**How to apply:** Flag as a minor/informational finding — "should these be renamed to `dashboard-activity-*`?" Leave the decision to EL; do not treat as a blocker.
