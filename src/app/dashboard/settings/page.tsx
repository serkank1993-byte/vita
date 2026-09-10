import { getCurrentFamily, getCalendarCategories } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { updateFamilyName } from "./actions";
import { CategoryManager } from "./CategoryManager";

export default async function SettingsPage() {
  const family = await getCurrentFamily();
  const categories = family ? await getCalendarCategories(family.id) : [];

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Ayarlar"
        description="Sitenin genel ayarlarını buradan yönetebilirsin."
      />

      <section className="rounded-xl border border-vita-100 bg-white p-4">
        <h2 className="font-medium text-vita-900">Aile</h2>
        <form action={updateFamilyName} className="mt-3 flex flex-wrap items-end gap-2">
          <Field label="Aile adı" className="min-w-[10rem] flex-1">
            <input
              name="name"
              type="text"
              required
              defaultValue={family?.name ?? ""}
              className={inputClass}
            />
          </Field>
          <button
            type="submit"
            className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
          >
            Kaydet
          </button>
        </form>
        <p className="mt-3 text-xs text-vita-500">
          Davet kodu:{" "}
          <span className="font-mono font-medium text-vita-800">{family?.invite_code}</span>
        </p>
      </section>

      <section className="rounded-xl border border-vita-100 bg-white p-4">
        <h2 className="font-medium text-vita-900">Takvim Kategorileri</h2>
        <p className="mt-0.5 text-xs text-vita-500">
          Takvim&apos;de kullanılan etkinlik türlerini buradan ekleyip düzenleyebilirsin. Bir
          kategoriyi silersen o kategoriyi kullanan etkinlikler kategorisiz kalır.
        </p>
        <CategoryManager categories={categories} />
      </section>
    </div>
  );
}
