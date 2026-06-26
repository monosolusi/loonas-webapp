import type { Plugin } from "@opencode-ai/plugin";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.BASH_GUARD_MODEL || "gemma4:31b-cloud";
const REQUEST_TIMEOUT_MS = 15_000;

export const BashGuardPlugin: Plugin = async ({ client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "bash") {
        return;
      }

      const command = output.args?.command;
      if (typeof command !== "string" || !command) {
        throw new Error(
          "bash-guard: tool call had no command — blocking the Bash call.",
        );
      }

      const systemPrompt = `You are a strict shell-command security classifier for an agent that must NEVER modify files on disk.

Classify the provided shell command. Reply with **only** a single JSON object and no other text:
{"is_write_or_edit": true}

Use true if the command (directly, or via any pipeline/redirect/substitution/heredoc) would write, edit, create, modify, append, truncate, move, copy, install, rename, patch, delete, or unlink any file or directory. This includes but is not limited to: >, >>, 1>, 2>, &>, tee, cat <<EOF, cat >, sed -i, awk with redirection, perl -i, dd, cp, mv, install, truncate, touch, rm, unlink, rmdir, shred, mkfs, mount, chmod/chown when applied to paths, and any editor such as nano/vim/emacs/code.

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
          await client.app.log({
            body: {
              service: "bash-guard",
              level: "warn",
              message: `Ollama returned HTTP ${res.status} — blocking Bash command.`,
            },
          });
          throw new Error(
            `bash-guard: Ollama returned HTTP ${res.status} — blocking the Bash call to stay safe.`,
          );
        }

        const data = await res.json();
        responseText = data?.message?.content ?? "";
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        await client.app.log({
          body: {
            service: "bash-guard",
            level: "warn",
            message: `Could not reach Ollama at ${OLLAMA_HOST} (${error.name}: ${error.message}) — blocking Bash command.`,
          },
        });
        throw new Error(
          `bash-guard: could not reach Ollama at ${OLLAMA_HOST} (${error.name}: ${error.message}) — blocking the Bash call.`,
        );
      }

      let classification: { is_write_or_edit?: boolean };
      try {
        classification = JSON.parse(responseText.trim());
      } catch {
        await client.app.log({
          body: {
            service: "bash-guard",
            level: "warn",
            message: `Ollama response was not valid JSON (${responseText.slice(0, 200)}) — blocking Bash command.`,
          },
        });
        throw new Error(
          `bash-guard: Ollama response was not valid JSON (${responseText.slice(0, 200)}) — blocking the Bash call.`,
        );
      }

      if (classification.is_write_or_edit === true) {
        throw new Error(
          `This Bash command appears to write, edit, or delete files. Blocked command: ${command.slice(0, 200)}`,
        );
      }
    },
  };
};
