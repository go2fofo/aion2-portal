<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h3 class="font-black text-slate-800 text-lg">权限管理</h3>
        <div class="mt-1 text-xs text-slate-500 font-bold">
          控制 user 角色在后台可见/可访问的页面
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="restoreDefault"
          :disabled="saving"
          class="px-4 py-2 rounded-lg font-black text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          恢复默认
        </button>
        <button
          @click="save"
          :disabled="saving"
          class="px-5 py-2 rounded-lg font-black text-sm bg-[#45a6d5] text-white hover:bg-[#3b95c0] transition-colors disabled:opacity-50"
        >
          {{ saving ? "保存中..." : "保存配置" }}
        </button>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              user 默认入口
            </div>
            <div class="text-sm text-slate-600 font-bold">
              user 访问 /admin 或无权限页面时，将跳转到此页面
            </div>
          </div>
          <select
            v-model="defaultPage"
            class="w-full md:w-72 px-4 py-3 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 outline-none focus:border-[#45a6d5]"
          >
            <option v-for="p in allowedPages" :key="p" :value="p">
              {{ pageLabel(p) }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              user 可见页面
            </div>
            <div class="text-sm text-slate-600 font-bold">
              勾选后：侧边栏可见 + 可直接访问
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="selectAll"
              :disabled="saving"
              class="px-4 py-2 rounded-lg font-black text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              全选
            </button>
            <button
              @click="clearAll"
              :disabled="saving"
              class="px-4 py-2 rounded-lg font-black text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              清空
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label
            v-for="p in allPages"
            :key="p.path"
            class="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all cursor-pointer"
          >
            <input
              type="checkbox"
              class="mt-1 w-4 h-4 accent-[#45a6d5]"
              :checked="allowedSet.has(p.path)"
              @change="toggle(p.path)"
            />
            <div class="min-w-0">
              <div class="font-black text-slate-800 text-sm truncate">
                {{ p.label }}
              </div>
              <div class="text-[11px] text-slate-500 font-bold truncate">
                {{ p.path }}
              </div>
            </div>
          </label>
        </div>

        <div v-if="allowedPages.length === 0" class="mt-4 text-sm font-bold text-rose-600">
          至少选择一个页面，否则 user 无法进入后台
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

const { $alert, $loading } = useNuxtApp();
const router = useRouter();

const { role, loaded: roleLoaded, fetchRole } = useAdminRole();
const isAdmin = computed(() => role.value === "admin");

const { config, loaded, fetchConfig, saveConfig, defaultConfig } = useAdminRbacConfig();

const allPages = [
  { path: "/admin", label: "概览" },
  { path: "/admin/content", label: "内容管理" },
  { path: "/admin/members", label: "成员管理" },
  { path: "/admin/tabs", label: "Tab配置" },
  { path: "/admin/ai", label: "AI 模型配置" },
  { path: "/admin/calculator", label: "造价计算器" },
  { path: "/admin/kinah-compare", label: "基纳比价" },
  { path: "/admin/cost-calculator", label: "造价计算配置" },
  { path: "/admin/craft-history", label: "造价历史记录" },
  { path: "/admin/materials", label: "材料库" },
  { path: "/admin/search", label: "即时查询" },
  { path: "/admin/dungeon-plans", label: "副本编排" },
  { path: "/admin/material-trends", label: "材料趋势" },
];

const saving = ref(false);
const allowedPages = ref([]);
const defaultPage = ref("/admin/calculator");

const allowedSet = computed(() => new Set(allowedPages.value));

const pageLabel = (path) => {
  const found = allPages.find((p) => p.path === path);
  return found ? `${found.label} (${found.path})` : path;
};

const normalizeDefault = () => {
  if (!allowedPages.value.includes(defaultPage.value)) {
    defaultPage.value = allowedPages.value[0] || defaultConfig.user.defaultPage;
  }
};

const toggle = (path) => {
  if (allowedSet.value.has(path)) {
    allowedPages.value = allowedPages.value.filter((x) => x !== path);
  } else {
    allowedPages.value = Array.from(new Set([...allowedPages.value, path]));
  }
  normalizeDefault();
};

const selectAll = () => {
  allowedPages.value = allPages.map((p) => p.path);
  normalizeDefault();
};

const clearAll = () => {
  allowedPages.value = [];
  normalizeDefault();
};

const restoreDefault = () => {
  allowedPages.value = [...defaultConfig.user.allowedPages];
  defaultPage.value = defaultConfig.user.defaultPage;
  normalizeDefault();
};

const save = async () => {
  if (allowedPages.value.length === 0) {
    $alert("保存失败", "至少选择一个页面");
    return;
  }

  saving.value = true;
  $loading.show("正在保存权限配置...");

  try {
    const { error } = await saveConfig({
      user: {
        allowedPages: allowedPages.value,
        defaultPage: defaultPage.value,
      },
    });

    if (error) throw error;
    $alert("保存成功", "权限配置已更新");
  } catch (e) {
    $alert("保存失败", e?.message || String(e));
  } finally {
    $loading.hide();
    saving.value = false;
  }
};

onMounted(async () => {
  if (!roleLoaded.value) {
    await fetchRole();
  }

  if (!isAdmin.value) {
    router.push("/admin/calculator");
    return;
  }

  if (!loaded.value) {
    await fetchConfig();
  }

  allowedPages.value = [...(config.value.user.allowedPages || defaultConfig.user.allowedPages)];
  defaultPage.value = config.value.user.defaultPage || defaultConfig.user.defaultPage;
  normalizeDefault();
});

watch(allowedPages, () => {
  normalizeDefault();
});
</script>
