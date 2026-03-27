/*
 * @Author: whq
 * @Date: 2026-03-27 16:41:15
 * @LastEditTime: 2026-03-27 16:53:27
 * @LastEditors: whq
 * @Description: 
 * @FilePath: /aion2-portal/app/server/middleware/admin-rbac.ts
 */
import { defineEventHandler, createError, getRequestURL } from "h3";
import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url.pathname.startsWith("/api/admin")) return;

  let user: Awaited<ReturnType<typeof serverSupabaseUser>> | null = null;
  try {
    user = await serverSupabaseUser(event);
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const client = await serverSupabaseClient(event);
  const { data } = await client
    .from("admin_user_list")
    .select("role")
    .eq("id", user!.id)
    .maybeSingle();

  if (data?.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
});
