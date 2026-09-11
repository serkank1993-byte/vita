"use client";

import type { ShoppingCategory } from "@/lib/family";
import { pillClassFor } from "@/lib/category-colors";
import { toggleItem, deleteItem } from "./actions";

export type ShoppingItemRow = {
  id: string;
  name: string;
  quantity: string | null;
  category_id: string | null;
  store: string | null;
  is_bought: boolean;
};

export function ShoppingItemRow({
  item,
  categories,
}: {
  item: ShoppingItemRow;
  categories: ShoppingCategory[];
}) {
  const category = categories.find((c) => c.id === item.category_id) ?? null;

  return (
    <li className="flex items-center gap-3 rounded-lg border border-vita-100 bg-white px-4 py-3">
      <input
        type="checkbox"
        defaultChecked={item.is_bought}
        onChange={(e) => toggleItem(item.id, e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-vita-300 text-vita-600"
      />
      <div className="min-w-0 flex-1">
        <span className={item.is_bought ? "text-vita-400 line-through" : "text-vita-900"}>
          {item.name}
        </span>
        {item.quantity && <span className="ml-2 text-sm text-vita-500">({item.quantity})</span>}
        {item.store && <span className="ml-2 text-xs text-vita-400">{item.store}</span>}
      </div>
      {category && (
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${pillClassFor(category.color)}`}>
          {category.name}
        </span>
      )}
      <button
        onClick={() => deleteItem(item.id)}
        className="shrink-0 text-sm text-vita-400 hover:text-red-500"
        aria-label="Sil"
      >
        Sil
      </button>
    </li>
  );
}
