#!/usr/bin/env node
// PreToolUse write guard for non-editing OpenCode agents.
//
// Enforces per-agent write/edit policy:
//   - deny-all:    Write/Edit is always denied regardless of target path.
//   - memory-only: Write/Edit is permitted only inside the agent's own memory
//                  directory under .opencode/agent-memory/<agent-name>/.
//
// Wired in via each agent's frontmatter, with the agent name passed as the
// first positional argument:
//   hooks.PreToolUse[ matcher: "Write|Edit" ]
//     -> node ".../write-guard.mjs" <agent-name>
//
// This guard is intended for agents that must NOT edit project source files.
// The universal claude-protect-write-guard.mjs (applied to ALL agents) should be
// wired separately to also block writes to .claude/ and CLAUDE.md.
//
// Contract (OpenCode PreToolUse hook):
//   - reads the event JSON on stdin (tool_name, tool_input.file_path, cwd, ...)
//   - exit 0 with no stdout  -> defer to normal permission flow (allow)
//   - exit 0 with JSON stdout containing hookSpecificOutput.permissionDecision
//     === "deny" -> block the tool call and show the reason to the agent
//
// Fails CLOSED: if the payload can't be parsed, has no file path, or the agent
// policy is unknown, the write is blocked.

import { readFileSync } from "node:fs";
import path from "node:path";

const AGENT_NAME = process.argv[2];

const POLICY = {
  planner: { type: "deny-all" },
  orchestrator: { type: "deny-all" },
  "ui-designer": { type: "memory-only" },
};

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

if (!AGENT_NAME) {
  deny("write-guard: no agent name provided — blocking the write.");
}

const policy = POLICY[AGENT_NAME];
if (!policy) {
  deny(`write-guard: unknown agent '${AGENT_NAME}' — blocking the write.`);
}

let input;
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  deny(`${AGENT_NAME} write-guard: could not parse the PreToolUse payload — blocking the write.`);
}

const filePath = input?.tool_input?.file_path;
if (!filePath || typeof filePath !== "string") {
  deny(`${AGENT_NAME} write-guard: tool call had no file_path — blocking the write.`);
}

if (policy.type === "deny-all") {
  deny(
    `${AGENT_NAME} is READ-ONLY and must never write or edit files. ` +
      `Produce the plan inline; implementation must be done by another agent after approval. ` +
      `Blocked target: ${filePath}`,
  );
}

if (policy.type === "memory-only") {
  const projectDir = process.env.OPENCODE_PROJECT_DIR || input.cwd || process.cwd();
  const baseDir = input.cwd || projectDir;
  const memorySubdir = path.join(".opencode", "agent-memory", AGENT_NAME);
  const allowedDir = path.resolve(projectDir, memorySubdir);
  const resolved = path.isAbsolute(filePath)
    ? path.resolve(filePath)
    : path.resolve(baseDir, filePath);

  const allowed = resolved === allowedDir || resolved.startsWith(allowedDir + path.sep);

  if (allowed) {
    process.exit(0);
  }

  deny(
    `${AGENT_NAME} is READ-ONLY. Write/Edit is restricted to ${memorySubdir}/ (your own memory). ` +
      `Blocked target: ${filePath}. Do not implement — produce a design spec and hand it to the software-engineer agent.`,
  );
}

// Unknown policy type should never happen due to the earlier lookup, but fail
// closed just in case.
deny(`${AGENT_NAME} write-guard: unhandled policy type — blocking the write.`);
