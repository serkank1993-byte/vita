"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";

function readAssignedTo(formData: FormData, memberIds: string[]) {
  const value = String(formData.get("assigned_to") ?? "").trim();
  if (!value || !memberIds.includes(value)) {
    return null;
  }
  return value;
}

function readDueDate(formData: FormData) {
  const value = String(formData.get("due_date") ?? "").trim();
  return value ? value : null;
}

export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const members = await getFamilyMembers(family.id);
  const description = String(formData.get("description") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("todos").insert({
    family_id: family.id,
    title,
    description: description || null,
    due_date: readDueDate(formData),
    assigned_to: readAssignedTo(formData, members.map((m) => m.id)),
    created_by: user?.id,
  });

  revalidatePath("/dashboard/todos");
}

export async function updateTodo(id: string, formData: FormData) {
  const family = await getCurrentFamily();
  if (!family) return;

  const members = await getFamilyMembers(family.id);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) return;

  const supabase = await createClient();
  await supabase
    .from("todos")
    .update({
      title,
      description: description || null,
      due_date: readDueDate(formData),
      assigned_to: readAssignedTo(formData, members.map((m) => m.id)),
    })
    .eq("id", id);

  revalidatePath("/dashboard/todos");
}

export async function toggleTodo(id: string, isDone: boolean) {
  const supabase = await createClient();
  await supabase.from("todos").update({ is_done: isDone }).eq("id", id);
  revalidatePath("/dashboard/todos");
}

export async function deleteTodo(id: string) {
  const supabase = await createClient();
  await supabase.from("todos").delete().eq("id", id);
  revalidatePath("/dashboard/todos");
}
