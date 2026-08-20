import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withTimeout } from "@/core/utilities/with-timeout";

describe("withTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with the operation's value when it settles before the deadline", async () => {
    const result = await withTimeout(() => Promise.resolve("ok"), 1_000);

    expect(result).toBe("ok");
  });

  it("rejects with a TimeoutError DOMException once the deadline elapses", async () => {
    const neverResolves = () => new Promise<string>(() => {});

    let caught: unknown;
    withTimeout(neverResolves, 1_000).catch((err) => {
      caught = err;
    });

    await vi.advanceTimersByTimeAsync(1_000);

    expect(caught).toBeInstanceOf(DOMException);
    expect((caught as DOMException).name).toBe("TimeoutError");
  });

  it("propagates the operation's own rejection instead of a timeout error", async () => {
    const customError = new Error("boom");

    await expect(withTimeout(() => Promise.reject(customError), 1_000)).rejects.toBe(customError);
  });

  it("clears its timer once settled so a late tick can't reject an already-settled promise", async () => {
    const result = await withTimeout(() => Promise.resolve("ok"), 1_000);

    expect(result).toBe("ok");
    // No pending timer should remain — proves clearTimeout ran on the success path rather than
    // leaving the deadline timer armed for a tick nobody is listening for anymore.
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears its timer when the operation rejects on its own, before the deadline", async () => {
    await expect(withTimeout(() => Promise.reject(new Error("boom")), 1_000)).rejects.toThrow("boom");

    expect(vi.getTimerCount()).toBe(0);
  });
});
