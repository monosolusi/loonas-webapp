import type { Plugin } from "@opencode-ai/plugin";
import path from "node:path";

const CLAUDE_DIR = ".claude";
const CLAUDE_MD = "CLAUDE.md";

export const ClaudeProtectPlugin: Plugin = async ({ directory }) => {
  return {
    "tool.execute.before": async (input, output) => {
      const tool = input.tool;
      if (tool !== "write" && tool !== "edit") {
        return;
      }

      const filePath = output.args?.filePath;
      if (typeof filePath !== "string" || !filePath) {
        return;
      }

      const resolved = path.isAbsolute(filePath)
        ? path.resolve(filePath)
        : path.resolve(directory, filePath);

      const projectRoot = directory;
      const claudeDir = path.resolve(projectRoot, CLAUDE_DIR);
      const isUnderClaudeDir =
        resolved === claudeDir || resolved.startsWith(claudeDir + path.sep);

      const rootClaudeMd = path.resolve(projectRoot, CLAUDE_MD);
      const isClaudeMd =
        resolved === rootClaudeMd ||
        path.basename(resolved).toLowerCase() === CLAUDE_MD.toLowerCase();

      if (isUnderClaudeDir || isClaudeMd) {
        throw new Error(
          `OpenCode agents are forbidden from writing to ${CLAUDE_DIR}/ or ${CLAUDE_MD}. Blocked target: ${filePath}.`,
        );
      }
    },
  };
};
