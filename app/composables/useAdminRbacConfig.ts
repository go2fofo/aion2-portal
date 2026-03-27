type AdminRbacRoleConfig = {
  allowedPages: string[];
  defaultPage: string;
};

type AdminRbacConfig = {
  user: AdminRbacRoleConfig;
};

const defaultConfig: AdminRbacConfig = {
  user: {
    allowedPages: ["/admin/calculator", "/admin/kinah-compare"],
    defaultPage: "/admin/calculator",
  },
};

export const useAdminRbacConfig = () => {
  const config = useState<AdminRbacConfig>("adminRbacConfig", () => defaultConfig);
  const loaded = useState<boolean>("adminRbacConfigLoaded", () => false);

  const supabase = useSupabaseClient();

  const fetchConfig = async () => {
    if (!process.client) return config.value;

    const { data } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "admin_rbac_config")
      .maybeSingle();

    if (data?.value && typeof data.value === "object") {
      const value: any = data.value;
      const allowedPages = Array.isArray(value?.user?.allowedPages)
        ? value.user.allowedPages.filter((x: any) => typeof x === "string")
        : defaultConfig.user.allowedPages;
      const defaultPage =
        typeof value?.user?.defaultPage === "string" ? value.user.defaultPage : defaultConfig.user.defaultPage;
      config.value = {
        user: {
          allowedPages,
          defaultPage: allowedPages.includes(defaultPage) ? defaultPage : allowedPages[0] || defaultConfig.user.defaultPage,
        },
      };
    } else {
      config.value = defaultConfig;
    }

    loaded.value = true;
    return config.value;
  };

  const saveConfig = async (next: AdminRbacConfig) => {
    const payload: AdminRbacConfig = {
      user: {
        allowedPages: Array.from(new Set(next.user.allowedPages)).filter((x) => typeof x === "string"),
        defaultPage: next.user.defaultPage,
      },
    };

    if (!payload.user.allowedPages.includes(payload.user.defaultPage)) {
      payload.user.defaultPage = payload.user.allowedPages[0] || defaultConfig.user.defaultPage;
    }

    const { error } = await supabase.from("site_config").upsert(
      {
        key: "admin_rbac_config",
        value: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (!error) {
      config.value = payload;
      loaded.value = true;
    }

    return { error };
  };

  return { config, loaded, fetchConfig, saveConfig, defaultConfig };
};

