#!/usr/bin/env node
// PreToolUse guard for the `ui-designer` agent.
//
// Enforces ui-designer's read-only mandate: the `Write` and `Edit` tools are
// permitted ONLY inside the agent's own memory directory
// (.claude/agent-memory/ui-designer/). Any other target — i.e. anything in the
// project source tree — is denied.
//
// Wired in via .claude/agents/ui-designer.md frontmatter:
//   hooks.PreToolUse[ matcher: "Write|Edit" ] -> this script.
//
// Scope: because the hook lives in ui-designer's definition, it ONLY affects
// ui-designer. Other agents (e.g. software-engineer) are unaffected and can
// still write code normally.
//
// Contract (Claude Code PreToolUse hook):
//   - reads the event JSON on stdin (tool_name, tool_input.file_path, cwd, ...)
//   - exit 0 with no stdout  -> defer to normal permission flow (allow)
//   - exit 0 with JSON stdout containing hookSpecificOutput.permissionDecision
//     === "deny" -> block the tool call and show the reason to the agent
//
// Fails CLOSED: if the payload can't be parsed or has no file path, the write
// is blocked (staying read-only is the safe default).

import { readFileSync } from "node:fs";
import path from "node:path";

const MEMORY_SUBDIR = path.join(".claude", "agent-memory", "ui-designer");

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
  deny("ui-designer write-guard: could not parse the PreToolUse payload — blocking the write to stay read-only.");
}

const filePath = input?.tool_input?.file_path;
if (!filePath || typeof filePath !== "string") {
  deny("ui-designer write-guard: tool call had no file_path — blocking the write to stay read-only.");
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const baseDir = input.cwd || projectDir;
const allowedDir = path.resolve(projectDir, MEMORY_SUBDIR);

// path.resolve normalizes any `..` segments, so traversal out of the memory
// directory (e.g. ".../ui-designer/../../src/x.tsx") collapses before the check.
const resolved = path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(baseDir, filePath);

const allowed = resolved === allowedDir || resolved.startsWith(allowedDir + path.sep);

if (allowed) {
  // Permitted: a write to the agent's own memory. Defer to normal flow.
  process.exit(0);
}

deny(
  `ui-designer is READ-ONLY. Write/Edit is restricted to ${MEMORY_SUBDIR}/ (your own memory). ` +
    `Blocked target: ${filePath}. Do not implement — produce a design spec and hand it to the software-engineer agent.`,
);
