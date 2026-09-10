"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

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

export async function addItem(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("inventory_items").insert({
    family_id: family.id,
    name,
    category: String(formData.get("category") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    purchase_date: readDate(formData, "purchase_date"),
    warranty_until: readDate(formData, "warranty_until"),
    value: readValue(formData),
    note: String(formData.get("note") ?? "").trim() || null,
    created_by: user?.id,
  });

  revalidatePath("/dashboard/inventory");
}

export async function updateItem(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase
    .from("inventory_items")
    .update({
      name,
      category: String(formData.get("category") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      purchase_date: readDate(formData, "purchase_date"),
      warranty_until: readDate(formData, "warranty_until"),
      value: readValue(formData),
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
