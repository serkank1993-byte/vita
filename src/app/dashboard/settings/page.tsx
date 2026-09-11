import {
  getCurrentFamily,
  getCalendarCategories,
  getShoppingCategories,
  getInventoryCategories,
  getInventoryLocations,
  getArchiveCategories,
  getPetSpecies,
} from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { CategoryManager } from "@/components/CategoryManager";
import {
  updateFamilyName,
  addCalendarCategory,
  updateCalendarCategory,
  deleteCalendarCategory,
  addShoppingCategory,
  updateShoppingCategory,
  deleteShoppingCategory,
  addInventoryCategory,
  updateInventoryCategory,
  deleteInventoryCategory,
  addInventoryLocation,
  updateInventoryLocation,
  deleteInventoryLocation,
  addArchiveCategory,
  updateArchiveCategory,
  deleteArchiveCategory,
  addPetSpecies,
  updatePetSpecies,
  deletePetSpecies,
} from "./actions";

function SettingsSection({
  title,
  description,
  open,
  children,
}: {
  title: string;
  description?: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={open}
      className="group rounded-xl border border-vita-100 bg-white [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
        <span className="font-medium text-vita-900">{title}</span>
        <span className="text-vita-400 transition group-open:rotate-180">▾</span>
      </summary>
      <div className="border-t border-vita-100 px-4 py-4">
        {description && <p className="mb-3 text-xs text-vita-500">{description}</p>}
        {children}
      </div>
    </details>
  );
}

export default async function SettingsPage() {
  const family = await getCurrentFamily();
  const [
    calendarCategories,
    shoppingCategories,
    inventoryCategories,
    inventoryLocations,
    archiveCategories,
    petSpeciesList,
  ] = family
    ? await Promise.all([
        getCalendarCategories(family.id),
        getShoppingCategories(family.id),
        getInventoryCategories(family.id),
        getInventoryLocations(family.id),
        getArchiveCategories(family.id),
        getPetSpecies(family.id),
      ])
    : [[], [], [], [], [], []];

  return (
    <div className="max-w-2xl space-y-3">
      <PageHeader
        title="Ayarlar"
        description="Sitenin genel ayarlarını buradan yönetebilirsin."
      />

      <SettingsSection title="Aile" open>
        <form action={updateFamilyName} className="flex flex-wrap items-end gap-2">
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
      </SettingsSection>

      <SettingsSection
        title="Takvim Kategorileri"
        description="Takvim'de kullanılan etkinlik türleri. Bir kategoriyi silersen o kategoriyi kullanan etkinlikler kategorisiz kalır."
      >
        <CategoryManager
          categories={calendarCategories}
          addLabel="Kategori Ekle"
          addAction={addCalendarCategory}
          updateAction={updateCalendarCategory}
          deleteAction={deleteCalendarCategory}
        />
      </SettingsSection>

      <SettingsSection
        title="Alışveriş Kategorileri"
        description="Alışveriş Listesi'nde ürünlere atanan kategoriler."
      >
        <CategoryManager
          categories={shoppingCategories}
          addLabel="Kategori Ekle"
          addAction={addShoppingCategory}
          updateAction={updateShoppingCategory}
          deleteAction={deleteShoppingCategory}
        />
      </SettingsSection>

      <SettingsSection
        title="Envanter Kategorileri"
        description="Envanter'deki eşyalara atanan kategoriler."
      >
        <CategoryManager
          categories={inventoryCategories}
          addLabel="Kategori Ekle"
          addAction={addInventoryCategory}
          updateAction={updateInventoryCategory}
          deleteAction={deleteInventoryCategory}
        />
      </SettingsSection>

      <SettingsSection
        title="Envanter Konumları"
        description="Envanter'deki eşyaların ev içindeki konumları."
      >
        <CategoryManager
          categories={inventoryLocations}
          addLabel="Konum Ekle"
          addAction={addInventoryLocation}
          updateAction={updateInventoryLocation}
          deleteAction={deleteInventoryLocation}
        />
      </SettingsSection>

      <SettingsSection
        title="Dijital Arşiv Kategorileri"
        description="Yüklenen dosyalara atanan kategoriler."
      >
        <CategoryManager
          categories={archiveCategories}
          addLabel="Kategori Ekle"
          addAction={addArchiveCategory}
          updateAction={updateArchiveCategory}
          deleteAction={deleteArchiveCategory}
        />
      </SettingsSection>

      <SettingsSection
        title="Evcil Hayvan Türleri"
        description="Evcil Hayvanlar'da seçilebilen türler."
      >
        <CategoryManager
          categories={petSpeciesList}
          addLabel="Tür Ekle"
          addAction={addPetSpecies}
          updateAction={updatePetSpecies}
          deleteAction={deletePetSpecies}
        />
      </SettingsSection>
    </div>
  );
}
