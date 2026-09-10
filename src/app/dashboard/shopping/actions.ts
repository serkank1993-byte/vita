"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function addItem(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const quantity = String(formData.get("quantity") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("shopping_items").insert({
    family_id: family.id,
    name,
    quantity: quantity || null,
    category: category || null,
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
