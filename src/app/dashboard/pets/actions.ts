"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

function readDate(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value ? value : null;
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
    notes: String(formData.get("notes") ?? "").trim() || null,
    created_by: user?.id,
  });

  revalidatePath("/dashboard/pets");
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
      notes: String(formData.get("notes") ?? "").trim() || null,
    })
    .eq("id", id);

  revalidatePath("/dashboard/pets");
}

export async function deletePet(id: string) {
  const supabase = await createClient();
  await supabase.from("pets").delete().eq("id", id);
  revalidatePath("/dashboard/pets");
}
