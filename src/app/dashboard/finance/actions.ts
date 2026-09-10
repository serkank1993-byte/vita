"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function addTransaction(formData: FormData) {
  const type = String(formData.get("type") ?? "");
  const amount = Number(formData.get("amount"));
  if ((type !== "income" && type !== "expense") || !amount || amount <= 0) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const category = String(formData.get("category") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const occurredOn = String(formData.get("occurred_on") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("transactions").insert({
    family_id: family.id,
    type,
    amount,
    category: category || null,
    note: note || null,
    occurred_on: occurredOn || new Date().toISOString().slice(0, 10),
    created_by: user?.id,
  });

  revalidatePath("/dashboard/finance");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  revalidatePath("/dashboard/finance");
}
