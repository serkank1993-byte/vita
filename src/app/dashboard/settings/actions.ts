"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import { isCategoryColor } from "@/lib/category-colors";

function readColor(formData: FormData) {
  const value = String(formData.get("color") ?? "");
  return isCategoryColor(value) ? value : "vita";
}

export async function updateFamilyName(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  await supabase.from("families").update({ name }).eq("id", family.id);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export async function addCalendarCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  await supabase.from("calendar_categories").insert({
    family_id: family.id,
    name,
    color: readColor(formData),
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/calendar");
}

export async function updateCalendarCategory(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase
    .from("calendar_categories")
    .update({ name, color: readColor(formData) })
    .eq("id", id);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/calendar");
}

export async function deleteCalendarCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("calendar_categories").delete().eq("id", id);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/calendar");
}

export async function addShoppingCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  await supabase.from("shopping_categories").insert({
    family_id: family.id,
    name,
    color: readColor(formData),
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/shopping");
}

export async function updateShoppingCategory(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase
    .from("shopping_categories")
    .update({ name, color: readColor(formData) })
    .eq("id", id);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/shopping");
}

export async function deleteShoppingCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("shopping_categories").delete().eq("id", id);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/shopping");
}
