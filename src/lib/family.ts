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

export type FamilyMember = {
  id: string;
  full_name: string | null;
  email: string | null;
};

export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("family_members")
    .select("user_id, profiles ( id, full_name, email )")
    .eq("family_id", familyId);

  if (!data) {
    return [];
  }

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.user_id,
      full_name: profile?.full_name ?? null,
      email: profile?.email ?? null,
    };
  });
}

export type NamedCategory = {
  id: string;
  name: string;
  color: string;
};

async function getNamedCategoryList(table: string, familyId: string): Promise<NamedCategory[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from(table)
    .select("id, name, color")
    .eq("family_id", familyId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export type CalendarCategory = NamedCategory;
export function getCalendarCategories(familyId: string) {
  return getNamedCategoryList("calendar_categories", familyId);
}

export type ShoppingCategory = NamedCategory;
export function getShoppingCategories(familyId: string) {
  return getNamedCategoryList("shopping_categories", familyId);
}

export type InventoryCategory = NamedCategory;
export function getInventoryCategories(familyId: string) {
  return getNamedCategoryList("inventory_categories", familyId);
}

export type InventoryLocation = NamedCategory;
export function getInventoryLocations(familyId: string) {
  return getNamedCategoryList("inventory_locations", familyId);
}

export type ArchiveCategory = NamedCategory;
export function getArchiveCategories(familyId: string) {
  return getNamedCategoryList("archive_categories", familyId);
}

export type PetSpecies = NamedCategory;
export function getPetSpecies(familyId: string) {
  return getNamedCategoryList("pet_species", familyId);
}
