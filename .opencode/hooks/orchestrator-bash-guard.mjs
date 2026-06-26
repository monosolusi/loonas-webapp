#!/usr/bin/env node
// PreToolUse guard for the `orchestrator` primary agent: Bash edition.
//
// Enforces the orchestrator's read-only mandate for shell commands. Every Bash
// tool call is sent to a local Ollama LLM (gemma4:31b-cloud on localhost:11434)
// to classify whether the command writes, edits, creates, modifies, appends,
// truncates, moves, copies, installs, or deletes any file — including via
// heredocs, redirection, tee, sed, awk, perl, dd, rm, unlink, rmdir, etc.
//
// Wired in via .opencode/agents/orchestrator.md frontmatter:
//   hooks.PreToolUse[ matcher: "Bash" ] -> this script.
//
// Contract (OpenCode PreToolUse hook):
//   - reads the event JSON on stdin (tool_name, tool_input.command, cwd, ...)
//   - exit 0 with no stdout  -> defer to normal permission flow (allow)
//   - exit 0 with JSON stdout containing hookSpecificOutput.permissionDecision
//     === "deny" -> block the tool call and show the reason to the agent
//
// Fails CLOSED: parse errors, missing command, network failures, Ollama errors,
// non-JSON responses, and timeouts all result in a deny.

import { readFileSync } from "node:fs";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.ORCHESTRATOR_BASH_GUARD_MODEL || "gemma4:31b-cloud";
const REQUEST_TIMEOUT_MS = 15_000;

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
  deny("orchestrator bash-guard: could not parse the PreToolUse payload — blocking the Bash call.");
}

const command = input?.tool_input?.command;
if (!command || typeof command !== "string") {
  deny("orchestrator bash-guard: tool call had no command — blocking the Bash call.");
}

const systemPrompt = `You are a strict shell-command security classifier for an orchestrator agent that must NEVER modify files on disk.

Classify the provided shell command. Reply with **only** a single JSON object and no other text:
{"is_write_or_edit": true}

Use true if the command (directly, or via any pipeline/redirect/substitution/heredoc) would write, edit, create, modify, append, truncate, move, copy, install, rename, patch, delete, or unlink any file or directory. This includes but is not limited to: >, >>, 1>, 2>, &>, tee, cat <<EOF, cat >, sed -i, awk with redirection, perl -i, dd, cp, mv, install, truncate, touch, rm, unlink, rmdir, shred, mkfs, dd, mount, chmod/chown when applied to paths, and any editor such as nano/vim/emacs/code.

Use false for read-only commands such as: ls, pwd, cat, grep, rg, find (without -exec that mutates), head, tail, read, echo, printenv, date, git status, git diff, git log, git branch -a, git show, git rev-parse, and similar observational commands.

Important: if you are uncertain, reply true (fail closed).`;

const userPrompt = `Command to classify:\n${command}\n\nReply only with JSON: {"is_write_or_edit": true} or {"is_write_or_edit": false}`;

let responseText = "";
try {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: false,
      format: "json",
      options: { temperature: 0 },
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!res.ok) {
    deny(
      `orchestrator bash-guard: Ollama returned HTTP ${res.status} — blocking the Bash call to stay safe.`,
    );
  }

  const data = await res.json();
  responseText = data?.message?.content ?? "";
} catch (err) {
  deny(
    `orchestrator bash-guard: could not reach Ollama at ${OLLAMA_HOST} (${err.name}: ${err.message}) — blocking the Bash call.`,
  );
}

let classification;
try {
  classification = JSON.parse(responseText.trim());
} catch {
  deny(
    `orchestrator bash-guard: Ollama response was not valid JSON (${responseText.slice(0, 200)}) — blocking the Bash call.`,
  );
}

if (classification?.is_write_or_edit === true) {
  deny(
    `orchestrator is READ-ONLY. This Bash command appears to write, edit, or delete files. ` +
      `Delegate file-mutating work to the software-engineer agent via Task. Blocked command: ${command.slice(0, 200)}`,
  );
}

// Allowed: defer to normal permission flow.
process.exit(0);
