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

function makeCategoryActions(table: string, revalidatePaths: string[]) {
  async function add(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return;

    const family = await getCurrentFamily();
    if (!family) return;

    const supabase = await createClient();
    await supabase.from(table).insert({
      family_id: family.id,
      name,
      color: readColor(formData),
    });

    revalidatePath("/dashboard/settings");
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  async function update(id: string, formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return;

    const supabase = await createClient();
    await supabase.from(table).update({ name, color: readColor(formData) }).eq("id", id);

    revalidatePath("/dashboard/settings");
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  async function remove(id: string) {
    const supabase = await createClient();
    await supabase.from(table).delete().eq("id", id);

    revalidatePath("/dashboard/settings");
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return { add, update, remove };
}

const calendarCategoryActions = makeCategoryActions("calendar_categories", ["/dashboard/calendar"]);
export const addCalendarCategory = calendarCategoryActions.add;
export const updateCalendarCategory = calendarCategoryActions.update;
export const deleteCalendarCategory = calendarCategoryActions.remove;

const shoppingCategoryActions = makeCategoryActions("shopping_categories", ["/dashboard/shopping"]);
export const addShoppingCategory = shoppingCategoryActions.add;
export const updateShoppingCategory = shoppingCategoryActions.update;
export const deleteShoppingCategory = shoppingCategoryActions.remove;

const inventoryCategoryActions = makeCategoryActions("inventory_categories", ["/dashboard/inventory"]);
export const addInventoryCategory = inventoryCategoryActions.add;
export const updateInventoryCategory = inventoryCategoryActions.update;
export const deleteInventoryCategory = inventoryCategoryActions.remove;

const inventoryLocationActions = makeCategoryActions("inventory_locations", ["/dashboard/inventory"]);
export const addInventoryLocation = inventoryLocationActions.add;
export const updateInventoryLocation = inventoryLocationActions.update;
export const deleteInventoryLocation = inventoryLocationActions.remove;

const archiveCategoryActions = makeCategoryActions("archive_categories", ["/dashboard/archive"]);
export const addArchiveCategory = archiveCategoryActions.add;
export const updateArchiveCategory = archiveCategoryActions.update;
export const deleteArchiveCategory = archiveCategoryActions.remove;
