---
name: restart-server
description: |
  Start (or restart) the Next.js dev server on port 3000. Kills any
  existing process bound to port 3000, verifies the port is free, runs
  `npm run dev` in the background, and confirms the server is listening
  before reporting success.

  Triggers: "start server", "restart server", "start dev server",
  "restart dev server", "run dev server", "boot server", "boot the dev",
  "reboot server", "kill and restart server", "restart 3000",
  "jalankan server", "restart server", "mulai server", "matikan dan
  jalankan server".

  DO NOT use this for:
  - Production builds (`npm run build`) — this is dev only.
  - Running on a port other than 3000 (e.g. ad-hoc E2E ports).
  - Killing arbitrary processes — only port-3000 listeners are touched.
---

# Restart Dev Server

Single-purpose skill: get a fresh `npm run dev` running on port 3000 and
prove it is up before returning. Run the steps below in order. Do not
skip the verification steps — the whole point of the skill is that the
server is **actually listening** on 3000 when it returns.

## Steps

### 1. Find anything bound to port 3000

```bash
lsof -ti tcp:3000
```

- Empty output → port is free, skip to step 3.
- One or more PIDs → continue to step 2.

### 2. Kill the existing listener(s) and verify the port is free

```bash
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null; sleep 1; lsof -ti tcp:3000
```

Verification rule: the second `lsof` MUST print nothing. If it still
prints PIDs, the kill failed — repeat the kill once. If it still fails
after the second attempt, stop and report the offending PIDs to the user
rather than starting a second server on a conflicting port.

### 3. Start `npm run dev` in the background

Use Bash with `run_in_background: true` so the server keeps running after
the tool call returns. Pipe output to a logfile so the verification step
can read it.

```bash
cd /Users/fsiswanto/Documents/loonas-webapp && npm run dev > /tmp/loonas-dev.log 2>&1
```

Capture the shell id returned by the tool — you will need it to read
output for verification.

### 4. Wait for the server to become ready

Next.js with Turbopack typically takes **around 10 seconds** to boot and
print `Ready in <ms>`. Give it that initial budget before checking, then
poll the log until either:

- `Ready in` appears in the log → server is up, continue to step 5.
- 30 seconds total elapse without `Ready in` → server failed to start.
  Tail the last ~40 lines of the log and report the error to the user.
  Do NOT return success.

Use this combined initial-wait + poll in a single Bash call so the
runtime's no-leading-sleep guard is satisfied:

```bash
sleep 10; until grep -q "Ready in" /tmp/loonas-dev.log; do sleep 2; done
```

Do not check `lsof` or grep the log earlier than 10 s after step 3 — an
empty log at t=2 s is the normal cold-boot state, not a failure.

### 5. Confirm the port is actually bound

Belt-and-suspenders check after the log says ready:

```bash
lsof -ti tcp:3000
```

Must print at least one PID. If empty, the server crashed between
"Ready" and the check — read the tail of the log and report to the user.

### 6. Report

Output **exactly** the following sentence to the user:

```
SERVER IS RUNNING ON PORT 3000
```

No additional preamble, no extra summary. If any step failed, do not
output that line — report what went wrong instead.

## Notes

- Default working directory is `/Users/fsiswanto/Documents/loonas-webapp`.
  Always `cd` there explicitly so the skill works regardless of where the
  parent shell happens to be.
- Use `kill -9` only on PIDs returned by `lsof -ti tcp:3000`. Never blanket-
  kill node/next processes by name — other dev tasks may be running.
- Do not run `npm install` as part of this skill. If `npm run dev` fails
  due to missing deps, surface the error and let the user decide.
