import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getShoppingCategories } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { clearBought } from "./actions";
import { AddItemButton } from "./AddItemButton";
import { ShoppingItemRow, type ShoppingItemRow as ShoppingItemRowType } from "./ShoppingItemRow";

export default async function ShoppingPage() {
  const supabase = await createClient();

  const [family, { data: items }] = await Promise.all([
    getCurrentFamily(),
    supabase
      .from("shopping_items")
      .select("id, name, quantity, category_id, store, is_bought")
      .order("is_bought", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);
  const categories = family ? await getShoppingCategories(family.id) : [];

  const rows = items ?? [];
  const boughtCount = rows.filter((i) => i.is_bought).length;

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Alışveriş Listesi"
        description="Ailece paylaşılan alışveriş listesi — biri alınca işaretlesin, herkes görsün."
        action={<AddItemButton categories={categories} />}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-vita-400">
          {rows.length} ürün{boughtCount > 0 ? ` · ${boughtCount} alındı` : ""}
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
        {rows.map((item) => (
          <ShoppingItemRow key={item.id} item={item as ShoppingItemRowType} categories={categories} />
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-vita-400">Liste boş. Sağ üstten ürün ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
