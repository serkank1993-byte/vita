"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";

function readDate(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value ? value : null;
}

function readPerson(formData: FormData, memberIds: string[]) {
  const value = String(formData.get("person_id") ?? "").trim();
  return value && memberIds.includes(value) ? value : null;
}

export async function addRecord(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const members = await getFamilyMembers(family.id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("health_records").insert({
    family_id: family.id,
    person_id: readPerson(formData, members.map((m) => m.id)),
    title,
    record_date: readDate(formData, "record_date") ?? new Date().toISOString().slice(0, 10),
    next_date: readDate(formData, "next_date"),
    note: String(formData.get("note") ?? "").trim() || null,
    created_by: user?.id,
  });

  revalidatePath("/dashboard/health");
}

export async function deleteRecord(id: string) {
  const supabase = await createClient();
  await supabase.from("health_records").delete().eq("id", id);
  revalidatePath("/dashboard/health");
}
