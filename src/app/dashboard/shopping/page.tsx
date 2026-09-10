import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { addItem, clearBought } from "./actions";
import { ShoppingItemRow, type ShoppingItemRow as ShoppingItemRowType } from "./ShoppingItemRow";

export default async function ShoppingPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("shopping_items")
    .select("id, name, quantity, category, store, is_bought")
    .order("is_bought", { ascending: true })
    .order("created_at", { ascending: false });

  const boughtCount = (items ?? []).filter((i) => i.is_bought).length;

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Alışveriş Listesi"
        description="Ailece paylaşılan alışveriş listesi — biri alınca işaretlesin, herkes görsün."
      />

      <form action={addItem} className="space-y-3 rounded-xl border border-vita-100 bg-white p-4">
        <Field label="Ürün adı">
          <input name="name" type="text" required className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label="Miktar">
            <input name="quantity" type="text" placeholder="1 kg, 2 adet..." className={inputClass} />
          </Field>
          <Field label="Kategori">
            <input name="category" type="text" placeholder="Market, eczane..." className={inputClass} />
          </Field>
          <Field label="Nereden">
            <input name="store" type="text" placeholder="Migros, Şok..." className={inputClass} />
          </Field>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
            >
              Ekle
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-vita-400">
          {(items ?? []).length} ürün{boughtCount > 0 ? ` · ${boughtCount} alındı` : ""}
        </p>
        {boughtCount > 0 && (
          <form action={clearBought}>
            <button type="submit" className="text-xs text-vita-500 underline hover:text-vita-700">
              Alınanları temizle
            </button>
          </form>
        )}
      </div>

      <ul className="mt-2 space-y-2">
        {(items ?? []).map((item) => (
          <ShoppingItemRow key={item.id} item={item as ShoppingItemRowType} />
        ))}
        {(items ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Liste boş. Yukarıdan ürün ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
