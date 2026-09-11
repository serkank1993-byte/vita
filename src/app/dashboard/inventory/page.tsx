import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getInventoryCategories, getInventoryLocations } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { AddItemButton } from "./AddItemButton";
import { InventoryItemRow, type InventoryItemRow as InventoryItemRowType } from "./InventoryItemRow";

export default async function InventoryPage() {
  const supabase = await createClient();

  const [family, { data: items }] = await Promise.all([
    getCurrentFamily(),
    supabase
      .from("inventory_items")
      .select(
        "id, name, category_id, location_id, purchase_date, warranty_until, value, serial_number, condition, note"
      )
      .order("created_at", { ascending: false }),
  ]);

  const [categories, locations] = family
    ? await Promise.all([getInventoryCategories(family.id), getInventoryLocations(family.id)])
    : [[], []];

  const rows = items ?? [];

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Envanter"
        description="Evdeki eşyaların, garanti belgelerinin ve değerli objelerin listesi."
        action={<AddItemButton categories={categories} locations={locations} />}
      />

      <ul className="space-y-2">
        {rows.map((item) => (
          <InventoryItemRow
            key={item.id}
            item={item as InventoryItemRowType}
            categories={categories}
            locations={locations}
          />
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-vita-400">Henüz eşya eklenmedi. Sağ üstten ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
