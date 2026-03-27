export default defineNuxtRouteMiddleware(async (to) => {
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
