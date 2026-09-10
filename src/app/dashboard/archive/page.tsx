import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { uploadFile } from "./actions";
import { ArchiveFileRow } from "./ArchiveFileRow";

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: files } = await supabase
    .from("archive_files")
    .select("id, file_name, storage_path, size_bytes, description, created_at")
    .order("created_at", { ascending: false });

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
      />

      <form
        action={uploadFile}
        className="space-y-2 rounded-xl border border-vita-100 bg-white p-4"
        encType="multipart/form-data"
      >
        <input
          name="file"
          type="file"
          required
          className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
        />
        <div className="flex gap-2">
          <input
            name="description"
            type="text"
            placeholder="Açıklama (opsiyonel)"
            className="flex-1 rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
          >
            Yükle
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-2">
        {withUrls.map((file) => (
          <ArchiveFileRow key={file.id} file={file} />
        ))}
        {withUrls.length === 0 && (
          <p className="text-sm text-vita-400">Henüz dosya yüklenmedi.</p>
        )}
      </ul>
    </div>
  );
}
