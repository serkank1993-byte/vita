import { createClient } from "@/lib/supabase/server";

export type CurrentFamily = {
  id: string;
  name: string;
  invite_code: string;
  role: string;
};

export async function getCurrentFamily(): Promise<CurrentFamily | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("family_members")
    .select("role, families ( id, name, invite_code )")
    .limit(1)
    .maybeSingle();

  if (!data || !data.families) {
    return null;
  }

  const family = Array.isArray(data.families) ? data.families[0] : data.families;

  return {
    id: family.id,
    name: family.name,
    invite_code: family.invite_code,
    role: data.role,
  };
}
