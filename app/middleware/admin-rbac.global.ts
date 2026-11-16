export default defineNuxtRouteMiddleware(async (to) => {
  // 纯本地模式：没有登录与后台，所有路由收敛到首页（仅「多角色管理」）
  if (useNoSupabaseMode()) {
    if (to.path !== "/") return navigateTo("/", { replace: true });
    return;
  }

  if (!process.client) return;
  if (!to.path.startsWith("/admin")) return;

  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }

  const { role, loaded, fetchRole } = useAdminRole();
  if (!loaded.value) {
    await fetchRole();
  }

  const currentRole = role.value || "user";

  if (currentRole === "admin") return;

  const { config, loaded: rbacLoaded, fetchConfig } = useAdminRbacConfig();
  if (!rbacLoaded.value) {
    await fetchConfig();
  }

  const userAllowed = new Set<string>(config.value.user.allowedPages || []);
  const defaultPage = config.value.user.defaultPage || "/admin/calculator";

  if (to.path === "/admin") {
    return navigateTo(defaultPage);
  }

  if (!userAllowed.has(to.path)) {
    return navigateTo(defaultPage);
  }
});
