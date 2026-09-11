import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getArchiveCategories } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { AddFileButton } from "./AddFileButton";
import { ArchiveFileRow } from "./ArchiveFileRow";

export default async function ArchivePage() {
  const supabase = await createClient();

  const [family, { data: files }] = await Promise.all([
    getCurrentFamily(),
    supabase
      .from("archive_files")
      .select("id, file_name, storage_path, size_bytes, description, category_id, created_at")
      .order("created_at", { ascending: false }),
  ]);
  const categories = family ? await getArchiveCategories(family.id) : [];

  const rows = files ?? [];

  const withUrls = await Promise.all(
    rows.map(async (file) => {
      const { data } = await supabase.storage
        .from("archive")
        .createSignedUrl(file.storage_path, 60 * 60);
      return { ...file, downloadUrl: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Dijital Arşiv"
        description="Önemli belgeler, fotoğraflar ve dosyalar — sadece ailen görebilir."
        action={<AddFileButton categories={categories} />}
      />

      <ul className="space-y-2">
        {withUrls.map((file) => (
          <ArchiveFileRow key={file.id} file={file} categories={categories} />
        ))}
        {withUrls.length === 0 && (
          <p className="text-sm text-vita-400">Henüz dosya yüklenmedi. Sağ üstten yükleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
