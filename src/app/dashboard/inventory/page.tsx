import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { addItem } from "./actions";
import { InventoryItemRow, type InventoryItemRow as InventoryItemRowType } from "./InventoryItemRow";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inventory_items")
    .select(
      "id, name, category, location, purchase_date, warranty_until, value, serial_number, condition, note"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Envanter"
        description="Evdeki eşyaların, garanti belgelerinin ve değerli objelerin listesi."
      />

      <form action={addItem} className="space-y-3 rounded-xl border border-vita-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Field label="Ad">
            <input name="name" type="text" required className={inputClass} />
          </Field>
          <Field label="Kategori">
            <input name="category" type="text" placeholder="Elektronik, mobilya..." className={inputClass} />
          </Field>
          <Field label="Konum">
            <input name="location" type="text" placeholder="Salon, garaj..." className={inputClass} />
          </Field>
          <Field label="Değer (TL)">
            <input name="value" type="number" step="0.01" className={inputClass} />
          </Field>
          <Field label="Seri numarası">
            <input name="serial_number" type="text" className={inputClass} />
          </Field>
          <Field label="Durum">
            <select name="condition" defaultValue="" className={inputClass}>
              <option value="">Belirtilmedi</option>
              <option value="new">Yeni</option>
              <option value="good">İyi</option>
              <option value="fair">Orta</option>
              <option value="poor">Kötü</option>
            </select>
          </Field>
          <Field label="Alım tarihi">
            <input name="purchase_date" type="date" className={inputClass} />
          </Field>
          <Field label="Garanti bitiş">
            <input name="warranty_until" type="date" className={inputClass} />
          </Field>
        </div>
        <Field label="Not">
          <textarea name="note" placeholder="Fatura yeri, ek bilgi..." rows={2} className={inputClass} />
        </Field>
        <button
          type="submit"
          className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
        >
          Ekle
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {(items ?? []).map((item) => (
          <InventoryItemRow key={item.id} item={item as InventoryItemRowType} />
        ))}
        {(items ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz eşya eklenmedi.</p>
        )}
      </ul>
    </div>
  );
}
