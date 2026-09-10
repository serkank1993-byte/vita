import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { clearBought } from "./actions";
import { AddItemButton } from "./AddItemButton";
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
        action={<AddItemButton />}
      />

      <div className="flex items-center justify-between">
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
          <p className="text-sm text-vita-400">Liste boş. Sağ üstten ürün ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
