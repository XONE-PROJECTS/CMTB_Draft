import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/supabase/admin";
import { createClient } from "@/supabase/server";

export const SUPER_ADMIN_ROLE = "super_admin";

export function isSuperAdmin(user: Pick<User, "app_metadata"> | null | undefined): boolean {
  return user?.app_metadata?.role === SUPER_ADMIN_ROLE;
}

export async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login?returnTo=%2Fadmin");

  const { data: adminUser, error: adminError } = await createAdminClient()
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", SUPER_ADMIN_ROLE)
    .maybeSingle();

  if (adminError || !adminUser || !isSuperAdmin(user)) redirect("/");

  return user;
}
