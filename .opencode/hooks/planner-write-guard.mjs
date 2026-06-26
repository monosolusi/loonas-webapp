#!/usr/bin/env node
// PreToolUse guard for the `planner` primary agent.
//
// Enforces the planner's read-only mandate: `Write` and `Edit` are ALWAYS
// denied, regardless of target path. The planner produces plans inline in the
// conversation; any implementation that requires file changes must be done by
// another agent after the plan is approved.
//
// Wired in via .opencode/agents/planner.md frontmatter:
//   hooks.PreToolUse[ matcher: "Write|Edit" ] -> this script.
//
// Contract (OpenCode PreToolUse hook):
//   - reads the event JSON on stdin (tool_name, tool_input.file_path, cwd, ...)
//   - exit 0 with no stdout  -> defer to normal permission flow (allow)
//   - exit 0 with JSON stdout containing hookSpecificOutput.permissionDecision
//     === "deny" -> block the tool call and show the reason to the agent
//
// Fails CLOSED: if the payload can't be parsed or has no file path, the write
// is blocked.

import { readFileSync } from "node:fs";

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

let input;
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  deny("planner write-guard: could not parse the PreToolUse payload — blocking the write.");
}

const filePath = input?.tool_input?.file_path;
if (!filePath || typeof filePath !== "string") {
  deny("planner write-guard: tool call had no file_path — blocking the write.");
}

deny(
  `planner is READ-ONLY and must never write or edit files. ` +
    `Produce the plan inline; implementation must be done by another agent after approval. ` +
    `Blocked target: ${filePath}`,
);
