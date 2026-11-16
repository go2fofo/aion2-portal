/**
 * 纯本地（无 Supabase）模式启动脚本
 *
 * 用法：
 *   node scripts/run-nosupabase.mjs dev --host
 *   node scripts/run-nosupabase.mjs build
 *   node scripts/run-nosupabase.mjs generate
 *
 * 作用：注入 NUXT_NOSUPABASE=1 后再执行 nuxt 对应命令，
 * 兼容 Windows / macOS / Linux，无需额外依赖。
 */
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nuxtBin = resolve(rootDir, "node_modules", "nuxt", "bin", "nuxt.mjs");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("请指定 nuxt 命令，例如：node scripts/run-nosupabase.mjs dev --host");
  process.exit(1);
}

/**
 * 部分编辑器扩展会通过 NODE_OPTIONS 注入 `--require ...node-language-shim.cjs`
 * （如 Console Ninja / Genie），它会给 Nuxt 内部模块插入 TypeScript 代码，
 * 导致 dev 日志出现 `[unctx:transform] Unexpected token`，甚至把某些依赖
 * 转成语法错误的 JS。这里只移除这类插桩参数，保留其它 Node 参数。
 */
const stripInstrumentationRequire = (nodeOptions = "") => {
  return nodeOptions
    .replace(
      /--require(?:=|\s+)(?:"([^"]+)"|'([^']+)'|(\S+))/g,
      (match, dq, sq, bare) => {
        const target = String(dq || sq || bare || "")
          .replace(/\\/g, "/")
          .toLowerCase();
        const isInstrumentation =
          target.includes("node-language-shim") ||
          target.includes("console-ninja") ||
          target.includes("console_ninja");
        return isInstrumentation ? "" : match;
      },
    )
    .replace(/\s+/g, " ")
    .trim();
};

const env = {
  ...process.env,
  NUXT_NOSUPABASE: "1",
};

if (env.NODE_OPTIONS) {
  const sanitized = stripInstrumentationRequire(env.NODE_OPTIONS);
  if (sanitized) {
    env.NODE_OPTIONS = sanitized;
  } else {
    delete env.NODE_OPTIONS;
  }
}

const child = spawn(process.execPath, [nuxtBin, ...args], {
  cwd: rootDir,
  stdio: "inherit",
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
