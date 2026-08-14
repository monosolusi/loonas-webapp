/**
 * Bounds an async `operation` to `timeoutMs`. If the operation hasn't settled by then, the
 * returned promise rejects with `new DOMException("TimeoutError", "TimeoutError")` — the same
 * shape callers already branch on via `err instanceof DOMException && err.name === "TimeoutError"`
 * (see `_lib/map-submit-error.ts`).
 *
 * Takes a factory (not a bare promise) so this function owns the whole lifecycle, including
 * when the operation itself starts. The timer is always cleared — on success, on the
 * operation's own rejection, and on timeout — so a late tick can never fire against an
 * already-settled promise.
 *
 * Only wrap a call here if a false timeout rejection is SAFE — i.e. the caller has no further
 * observable side effect it needs to distinguish from a real failure. `setActive()` in
 * `_providers/create-user.tsx` qualifies (the account is already known-created by that point, so
 * "reload and sign in" is the correct recovery regardless of why this rejected). A call whose
 * server-side effect isn't yet confirmed — e.g. `signUp.create()` — must NOT be wrapped here: a
 * false timeout would tell the user it failed while it may still succeed server-side, and a
 * resubmit then collides with `form_identifier_exists` on an account that silently already
 * exists.
 */
export async function withTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException("TimeoutError", "TimeoutError"));
  }, timeoutMs);

  try {
    return await Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener("abort", () => reject(new DOMException("TimeoutError", "TimeoutError")));
      }),
    ]);
  } catch (err) {
    controller.abort();
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
