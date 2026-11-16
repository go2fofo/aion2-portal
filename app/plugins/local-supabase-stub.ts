/**
 * 纯本地模式（nosupabase）下的 Supabase 占位客户端。
 *
 * 本地模式已在 nuxt.config.ts 中移除了 @nuxtjs/supabase 的插件，
 * 这里补一个空的 `$supabase.client`，保证 useSupabaseClient() 不会因为
 * `$supabase` 未注入而抛错；同时保证本地模式完全不会初始化/请求 Supabase。
 */
export default defineNuxtPlugin(() => {
  if (!useNoSupabaseMode()) return;

  return {
    provide: {
      supabase: {
        client: null as any,
      },
    },
  };
});
