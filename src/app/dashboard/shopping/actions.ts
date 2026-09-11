"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getShoppingCategories } from "@/lib/family";

async function readCategoryId(formData: FormData, familyId: string) {
  const value = String(formData.get("category_id") ?? "").trim();
  if (!value) return null;

  const categories = await getShoppingCategories(familyId);
  return categories.some((c) => c.id === value) ? value : null;
}

export async function addItem(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const quantity = String(formData.get("quantity") ?? "").trim();
  const store = String(formData.get("store") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("shopping_items").insert({
    family_id: family.id,
    name,
    quantity: quantity || null,
    category_id: await readCategoryId(formData, family.id),
    store: store || null,
    created_by: user?.id,
  });

  revalidatePath("/dashboard/shopping");
}

export async function toggleItem(id: string, isBought: boolean) {
  const supabase = await createClient();
  await supabase.from("shopping_items").update({ is_bought: isBought }).eq("id", id);
  revalidatePath("/dashboard/shopping");
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  await supabase.from("shopping_items").delete().eq("id", id);
  revalidatePath("/dashboard/shopping");
}

export async function clearBought() {
  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  await supabase
    .from("shopping_items")
    .delete()
    .eq("family_id", family.id)
    .eq("is_bought", true);

  revalidatePath("/dashboard/shopping");
}
