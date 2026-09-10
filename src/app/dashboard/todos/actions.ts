"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("todos").insert({
    family_id: family.id,
    title,
    created_by: user?.id,
  });

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
