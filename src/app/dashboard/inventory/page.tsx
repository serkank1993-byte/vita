import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { AddItemButton } from "./AddItemButton";
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
        action={<AddItemButton />}
      />

      <ul className="space-y-2">
        {(items ?? []).map((item) => (
          <InventoryItemRow key={item.id} item={item as InventoryItemRowType} />
        ))}
        {(items ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz eşya eklenmedi. Sağ üstten ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
