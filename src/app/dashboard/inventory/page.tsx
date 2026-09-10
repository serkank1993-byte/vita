import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { addItem } from "./actions";
import { InventoryItemRow, type InventoryItemRow as InventoryItemRowType } from "./InventoryItemRow";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inventory_items")
    .select("id, name, category, location, purchase_date, warranty_until, value, note")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Envanter"
        description="Evdeki eşyaların, garanti belgelerinin ve değerli objelerin listesi."
      />

      <form action={addItem} className="space-y-2 rounded-xl border border-vita-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            name="name"
            type="text"
            placeholder="Ad *"
            required
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <input
            name="category"
            type="text"
            placeholder="Kategori (elektronik, mobilya...)"
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <input
            name="location"
            type="text"
            placeholder="Konum (salon, garaj...)"
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <input
            name="value"
            type="number"
            step="0.01"
            placeholder="Değer (TL, opsiyonel)"
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <div className="flex items-center gap-2 text-xs text-vita-500">
            <label className="w-24 shrink-0">Alım tarihi:</label>
            <input
              name="purchase_date"
              type="date"
              className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-vita-500">
            <label className="w-24 shrink-0">Garanti biter:</label>
            <input
              name="warranty_until"
              type="date"
              className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
          </div>
        </div>
        <textarea
          name="note"
          placeholder="Not (seri no, fatura yeri...)"
          rows={2}
          className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
        />
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
