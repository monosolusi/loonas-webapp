import type { Plugin } from "@opencode-ai/plugin";
import path from "node:path";

const FILE_TOOLS = new Set([
  "read",
  "write",
  "edit",
  "glob",
  "listDirectory",
  "move",
  "copy",
  "deleteFile",
]);

function resolvePath(target: unknown, directory: string): string | null {
  if (typeof target !== "string" || !target) {
    return null;
  }
  return path.isAbsolute(target) ? path.resolve(target) : path.resolve(directory, target);
}

function isOutsideProject(resolved: string, directory: string): boolean {
  const dir = path.resolve(directory);
  return resolved !== dir && !resolved.startsWith(dir + path.sep);
}

function* extractCommandPaths(command: string): Generator<string> {
  // Match quoted strings, tilde/home expansions, absolute paths, and parent-dir segments.
  const tokenPattern = /"([^"]+)"|'([^']+)'|([^\s"'|<>]+)/g;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(command)) !== null) {
    const token = match[1] ?? match[2] ?? match[3];
    if (!token) continue;

    if (token.startsWith("/") || token.startsWith("~")) {
      yield token;
    }

    // Catch any ".." sequence anywhere in the token (e.g. ../../foo, foo/../bar).
    if (token.includes("..")) {
      yield token;
    }
  }
}

export const ProjectBoundaryPlugin: Plugin = async ({ directory, client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (FILE_TOOLS.has(input.tool)) {
        for (const argName of ["filePath", "path", "pattern", "sourcePath", "targetPath"]) {
          const argValue = output.args?.[argName];
          if (argValue === undefined || argValue === null) continue;

          const paths = Array.isArray(argValue) ? argValue : [argValue];
          for (const p of paths) {
            const resolved = resolvePath(p, directory);
            if (resolved === null) continue;

            if (isOutsideProject(resolved, directory)) {
              await client.app.log({
                body: {
                  service: "project-boundary",
                  level: "warn",
                  message: `Blocked ${input.tool} tool access outside project directory: ${resolved}`,
                },
              });
              throw new Error(`Access outside project directory is blocked. Target: ${String(p)}`);
            }
          }
        }
        return;
      }

      if (input.tool === "bash") {
        const command = output.args?.command;
        if (typeof command !== "string" || !command) {
          return;
        }

        for (const rawPath of extractCommandPaths(command)) {
          let resolved: string;
          if (rawPath.startsWith("~")) {
            const home = process.env.HOME || process.env.USERPROFILE || "/";
            resolved = path.resolve(path.join(home, rawPath.slice(1)));
          } else if (path.isAbsolute(rawPath)) {
            resolved = path.resolve(rawPath);
          } else {
            resolved = path.resolve(directory, rawPath);
          }

          if (isOutsideProject(resolved, directory)) {
            await client.app.log({
              body: {
                service: "project-boundary",
                level: "warn",
                message: `Blocked Bash command path outside project directory: ${resolved}`,
              },
            });
            throw new Error(`Access outside project directory is blocked. Target: ${rawPath}`);
          }
        }
      }
    },
  };
};
