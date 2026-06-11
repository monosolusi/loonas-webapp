import type { AnalyticsEventName, AnalyticsEventProperties } from "@/core/analytics/events";

export function track<N extends AnalyticsEventName>(name: N, properties: AnalyticsEventProperties<N>): void {
  if (typeof window === "undefined") return;
  try {
    // No-op for LNS-239. LNS-247 will replace this body with vendor dispatch.
    void name;
    void properties;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[analytics] track() failed", { name, err });
    }
  }
}
