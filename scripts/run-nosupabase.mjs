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

const child = spawn(process.execPath, [nuxtBin, ...args], {
  cwd: rootDir,
  stdio: "inherit",
  env: {
    ...process.env,
    NUXT_NOSUPABASE: "1",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
