import { describe, expect, it } from "vitest";
import { classifyCommit, KeystrokeSample } from "@/app/(pos)/pos/_utils/scan-detector";

function chars(gapsMs: number[], startAt = 0): KeystrokeSample[] {
  let t = startAt;
  const samples: KeystrokeSample[] = [{ isEnter: false, timeStamp: t }];
  for (const gap of gapsMs) {
    t += gap;
    samples.push({ isEnter: false, timeStamp: t });
  }
  return samples;
}

function enterAfter(samples: KeystrokeSample[], gapMs: number): KeystrokeSample[] {
  const lastTimeStamp = samples[samples.length - 1]?.timeStamp ?? 0;
  return [...samples, { isEnter: true, timeStamp: lastTimeStamp + gapMs }];
}

describe("classifyCommit", () => {
  it("classifies a fast scanner burst as scanner", () => {
    // 6 characters, ~10ms apart, Enter 10ms after the last character.
    const burst = enterAfter(chars([10, 10, 10, 10, 10]), 10);

    expect(classifyCommit(burst)).toBe("scanner");
  });

  it("classifies slow human typing as human", () => {
    // 4 characters at ~150ms apart (well above scanner threshold), Enter 200ms later.
    const burst = enterAfter(chars([150, 160, 140]), 200);

    expect(classifyCommit(burst)).toBe("human");
  });

  it("classifies a burst not terminated by Enter as incomplete — not a commit", () => {
    const burst = chars([10, 10, 10, 10]);

    expect(classifyCommit(burst)).toBe("incomplete");
  });

  it("classifies an empty sample list as incomplete", () => {
    expect(classifyCommit([])).toBe("incomplete");
  });

  it("classifies a fast-but-short burst as human (below MIN_SCAN_LENGTH guard)", () => {
    // Only 2 characters at scanner speed — too short to trust as a scan.
    const burst = enterAfter(chars([10]), 10);

    expect(classifyCommit(burst)).toBe("human");
  });

  it("treats a gap exactly at the threshold as scanner-speed (inclusive boundary)", () => {
    const burst = enterAfter(chars([35, 35, 35]), 35);

    expect(classifyCommit(burst)).toBe("scanner");
  });

  it("treats a gap one millisecond over the threshold as human (exclusive boundary)", () => {
    const burst = enterAfter(chars([35, 35, 36]), 35);

    expect(classifyCommit(burst)).toBe("human");
  });

  it("classifies a burst with a single slow gap among fast ones as human", () => {
    // A cashier who scans, hesitates, then types the rest manually should not be misread.
    const burst = enterAfter(chars([10, 10, 500, 10]), 10);

    expect(classifyCommit(burst)).toBe("human");
  });
});
