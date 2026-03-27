/*
 * @Author: whq
 * @Date: 2026-03-27 16:39:39
 * @LastEditTime: 2026-03-27 16:59:49
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/composables/useAdminRole.ts
 */
export const useAdminRole = () => {
  const role = useState<string | any>("adminRole", () => null);
  const loaded = useState<boolean>("adminRoleLoaded", () => false);
  const roleUserId = useState<string | null>("adminRoleUserId", () => null);

  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  const fetchRole = async () => {
    if (!process.client) return role.value;

    if (!user.value?.id) {
      role.value = null;
      loaded.value = true;
      return role.value;
    }

    const { data }: any = await supabase
      .from("admin_user_list")
      .select("role")
      .eq("id", user.value.id)
      .maybeSingle();

    role.value = (data?.role as string) || "user";
    loaded.value = true;
    roleUserId.value = user.value.id;
    return role.value;
  };

  watchEffect(() => {
    if (!process.client) return;
    const id = user.value?.id || null;
    if (roleUserId.value !== id) {
      role.value = null;
      loaded.value = false;
      roleUserId.value = id;
    }
    if (id && !loaded.value) {
      fetchRole();
    }
  });

  return { role, loaded, fetchRole };
};
