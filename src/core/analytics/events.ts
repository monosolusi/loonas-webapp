import type { ActivityTab } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-tabs";

export type AnalyticsEvent =
  | { name: "recent_activity_tab_switched"; properties: { from_tab: ActivityTab; to_tab: ActivityTab } }
  | { name: "recent_activity_period_changed"; properties: { tab: ActivityTab; from_date: string; to_date: string } }
  | { name: "recent_activity_row_clicked"; properties: { tab: ActivityTab; row_position: number; destination: string } }
  | { name: "recent_activity_empty_state_shown"; properties: { tab: ActivityTab; from_date: string; to_date: string } };

export type AnalyticsEventName = AnalyticsEvent["name"];

export type AnalyticsEventProperties<N extends AnalyticsEventName> = Extract<AnalyticsEvent, { name: N }>["properties"];
