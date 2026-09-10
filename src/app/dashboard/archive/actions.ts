"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const family = await getCurrentFamily();
  if (!family) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const storagePath = `${family.id}/${randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("archive")
    .upload(storagePath, file, {
      contentType: file.type || undefined,
    });

  if (uploadError) return;

  const description = String(formData.get("description") ?? "").trim();

  const { error: insertError } = await supabase.from("archive_files").insert({
    family_id: family.id,
    storage_path: storagePath,
    file_name: file.name,
    content_type: file.type || null,
    size_bytes: file.size,
    description: description || null,
    uploaded_by: user?.id,
  });

  if (insertError) {
    await supabase.storage.from("archive").remove([storagePath]);
  }

  revalidatePath("/dashboard/archive");
}

export async function deleteFile(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("archive").remove([storagePath]);
  await supabase.from("archive_files").delete().eq("id", id);
  revalidatePath("/dashboard/archive");
}
