import { describe, expect, it } from "vitest";
import {
  SLOW_THRESHOLD_MS,
  STALLED_THRESHOLD_MS,
  resolveWaitPhase,
} from "@/app/(user)/onboarding/user/_utils/submit-wait-phase";

describe("resolveWaitPhase", () => {
  it("is 'none' at the very start", () => {
    expect(resolveWaitPhase(0)).toBe("none");
  });

  it("is still 'none' just under the slow threshold", () => {
    expect(resolveWaitPhase(SLOW_THRESHOLD_MS - 1)).toBe("none");
  });

  it("becomes 'slow' exactly at the slow threshold", () => {
    expect(resolveWaitPhase(SLOW_THRESHOLD_MS)).toBe("slow");
  });

  it("is still 'slow' just under the stalled threshold", () => {
    expect(resolveWaitPhase(STALLED_THRESHOLD_MS - 1)).toBe("slow");
  });

  it("becomes 'stalled' exactly at the stalled threshold", () => {
    expect(resolveWaitPhase(STALLED_THRESHOLD_MS)).toBe("stalled");
  });

  it("stays 'stalled' well past the stalled threshold", () => {
    expect(resolveWaitPhase(STALLED_THRESHOLD_MS * 10)).toBe("stalled");
  });
});
