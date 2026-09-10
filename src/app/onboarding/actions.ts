"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createFamily(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    redirect(`/onboarding?error=${encodeURIComponent("Aile adı gerekli")}`);
  }

  const { error } = await supabase.rpc("create_family", { family_name: name });

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function joinFamily(formData: FormData) {
  const supabase = await createClient();
  const code = String(formData.get("code") ?? "").trim();

  if (!code) {
    redirect(`/onboarding?error=${encodeURIComponent("Davet kodu gerekli")}`);
  }

  const { error } = await supabase.rpc("join_family", { code });

  if (error) {
    redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
