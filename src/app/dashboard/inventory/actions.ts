"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getInventoryCategories, getInventoryLocations } from "@/lib/family";

const CONDITIONS = ["new", "good", "fair", "poor"] as const;

function readDate(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value ? value : null;
}

function readValue(formData: FormData) {
  const raw = String(formData.get("value") ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function readCondition(formData: FormData) {
  const value = String(formData.get("condition") ?? "").trim();
  return (CONDITIONS as readonly string[]).includes(value) ? value : null;
}

function pickValidId(value: string, list: { id: string }[]) {
  return value && list.some((c) => c.id === value) ? value : null;
}

export async function addItem(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const [categories, locations] = await Promise.all([
    getInventoryCategories(family.id),
    getInventoryLocations(family.id),
  ]);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("inventory_items").insert({
    family_id: family.id,
    name,
    category_id: pickValidId(String(formData.get("category_id") ?? "").trim(), categories),
    location_id: pickValidId(String(formData.get("location_id") ?? "").trim(), locations),
    purchase_date: readDate(formData, "purchase_date"),
    warranty_until: readDate(formData, "warranty_until"),
    value: readValue(formData),
    serial_number: String(formData.get("serial_number") ?? "").trim() || null,
    condition: readCondition(formData),
    note: String(formData.get("note") ?? "").trim() || null,
    created_by: user?.id,
  });

  revalidatePath("/dashboard/inventory");
}

export async function updateItem(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const [categories, locations] = await Promise.all([
    getInventoryCategories(family.id),
    getInventoryLocations(family.id),
  ]);

  const supabase = await createClient();
  await supabase
    .from("inventory_items")
    .update({
      name,
      category_id: pickValidId(String(formData.get("category_id") ?? "").trim(), categories),
      location_id: pickValidId(String(formData.get("location_id") ?? "").trim(), locations),
      purchase_date: readDate(formData, "purchase_date"),
      warranty_until: readDate(formData, "warranty_until"),
      value: readValue(formData),
      serial_number: String(formData.get("serial_number") ?? "").trim() || null,
      condition: readCondition(formData),
      note: String(formData.get("note") ?? "").trim() || null,
    })
    .eq("id", id);

  revalidatePath("/dashboard/inventory");
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  await supabase.from("inventory_items").delete().eq("id", id);
  revalidatePath("/dashboard/inventory");
}
