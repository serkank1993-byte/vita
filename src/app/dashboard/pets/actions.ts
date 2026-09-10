"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

function readDate(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value ? value : null;
}

function readWeight(formData: FormData) {
  const raw = String(formData.get("weight_kg") ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function addPet(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("pets").insert({
    family_id: family.id,
    name,
    species: String(formData.get("species") ?? "").trim() || null,
    breed: String(formData.get("breed") ?? "").trim() || null,
    birth_date: readDate(formData, "birth_date"),
    next_vet_date: readDate(formData, "next_vet_date"),
    weight_kg: readWeight(formData),
    microchip_number: String(formData.get("microchip_number") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    created_by: user?.id,
  });

  revalidatePath("/dashboard/pets");
  revalidatePath("/dashboard");
}

export async function updatePet(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase
    .from("pets")
    .update({
      name,
      species: String(formData.get("species") ?? "").trim() || null,
      breed: String(formData.get("breed") ?? "").trim() || null,
      birth_date: readDate(formData, "birth_date"),
      next_vet_date: readDate(formData, "next_vet_date"),
      weight_kg: readWeight(formData),
      microchip_number: String(formData.get("microchip_number") ?? "").trim() || null,
      notes: String(formData.get("notes") ?? "").trim() || null,
    })
    .eq("id", id);

  revalidatePath("/dashboard/pets");
  revalidatePath("/dashboard");
}

export async function deletePet(id: string) {
  const supabase = await createClient();
  await supabase.from("pets").delete().eq("id", id);
  revalidatePath("/dashboard/pets");
  revalidatePath("/dashboard");
}
