"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function addEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "").trim();
  if (!title || !eventDate) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const eventTime = String(formData.get("event_time") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("events").insert({
    family_id: family.id,
    title,
    description: description || null,
    event_date: eventDate,
    event_time: eventTime || null,
    created_by: user?.id,
  });

  revalidatePath("/dashboard/calendar");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/dashboard/calendar");
}
