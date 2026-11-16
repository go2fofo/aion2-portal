/**
 * 纯本地模式（nosupabase）判断
 *
 * 使用 `pnpm dev:nosupabase` 启动时，nuxt.config.ts 会把
 * runtimeConfig.public.noSupabase 置为 true。
 *
 * 该模式下不登录、不鉴权、不访问 Supabase，仅使用 IndexedDB，
 * 页面只保留「多角色管理」。
 */
export const useNoSupabaseMode = (): boolean => {
  const config = useRuntimeConfig();
  return Boolean(config.public?.noSupabase);
};
