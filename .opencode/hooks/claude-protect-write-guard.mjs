#!/usr/bin/env node
// PreToolUse guard for all OpenCode agents.
//
// Enforces a legacy-path protection rule: Write/Edit is forbidden on
// anything under `.claude/` and on the project-root `CLAUDE.md` file.
// This keeps the migrated OpenCode agents from accidentally mutating the
// legacy Claude Code configuration.
//
// Wired in via each agent's frontmatter:
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
import path from "node:path";

const CLAUDE_DIR = ".claude";
const CLAUDE_MD = "CLAUDE.md";

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
  deny("claude-protect write-guard: could not parse the PreToolUse payload — blocking the write.");
}

const filePath = input?.tool_input?.file_path;
if (!filePath || typeof filePath !== "string") {
  deny("claude-protect write-guard: tool call had no file_path — blocking the write.");
}

const projectDir = process.env.OPENCODE_PROJECT_DIR || input.cwd || process.cwd();
const baseDir = input.cwd || projectDir;
const resolved = path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(baseDir, filePath);

function isUnderClaudeDir(checkPath, projectRoot) {
  const claudeDir = path.resolve(projectRoot, CLAUDE_DIR);
  return checkPath === claudeDir || checkPath.startsWith(claudeDir + path.sep);
}

function isClaudeMd(checkPath, projectRoot) {
  const rootClaudeMd = path.resolve(projectRoot, CLAUDE_MD);
  return checkPath === rootClaudeMd || path.basename(checkPath).toLowerCase() === CLAUDE_MD.toLowerCase();
}

if (isUnderClaudeDir(resolved, projectDir) || isClaudeMd(resolved, projectDir)) {
  deny(
    `OpenCode agents are forbidden from writing to \`.claude/\` or \`CLAUDE.md\`. ` +
      `Blocked target: ${filePath}. If you need to modify legacy Claude configuration, ask the orchestrator.`,
  );
}

// Allowed: defer to normal permission flow.
process.exit(0);
