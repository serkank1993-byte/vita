import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { uploadFile } from "./actions";
import { ArchiveFileRow } from "./ArchiveFileRow";

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: files } = await supabase
    .from("archive_files")
    .select("id, file_name, storage_path, size_bytes, description, category, created_at")
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
        className="space-y-3 rounded-xl border border-vita-100 bg-white p-4"
        encType="multipart/form-data"
      >
        <Field label="Dosya">
          <input name="file" type="file" required className={inputClass} />
        </Field>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Field label="Kategori">
            <select name="category" defaultValue="" className={inputClass}>
              <option value="">Seçilmedi</option>
              <option value="Kimlik">Kimlik</option>
              <option value="Fatura">Fatura</option>
              <option value="Sözleşme">Sözleşme</option>
              <option value="Sağlık">Sağlık</option>
              <option value="Fotoğraf">Fotoğraf</option>
              <option value="Diğer">Diğer</option>
            </select>
          </Field>
          <Field label="Açıklama">
            <input name="description" type="text" className={inputClass} />
          </Field>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
        >
          Yükle
        </button>
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
