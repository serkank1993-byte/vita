"use client";

import type { InventoryCategory, InventoryLocation } from "@/lib/family";
import { pillClassFor } from "@/lib/category-colors";
import { Field, inputClass } from "@/components/Field";
import { updateItem, deleteItem } from "./actions";

export type InventoryCondition = "new" | "good" | "fair" | "poor";

export type InventoryItemRow = {
  id: string;
  name: string;
  category_id: string | null;
  location_id: string | null;
  purchase_date: string | null;
  warranty_until: string | null;
  value: number | null;
  serial_number: string | null;
  condition: InventoryCondition | null;
  note: string | null;
};

const currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

const conditionLabels: Record<InventoryCondition, string> = {
  new: "Yeni",
  good: "İyi",
  fair: "Orta",
  poor: "Kötü",
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value + "T00:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isExpired(value: string | null) {
  if (!value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(value + "T00:00:00") < today;
}

export function InventoryItemRow({
  item,
  categories,
  locations,
}: {
  item: InventoryItemRow;
  categories: InventoryCategory[];
  locations: InventoryLocation[];
}) {
  const updateWithId = updateItem.bind(null, item.id);
  const warrantyExpired = isExpired(item.warranty_until);
  const category = categories.find((c) => c.id === item.category_id) ?? null;
  const location = locations.find((l) => l.id === item.location_id) ?? null;

  return (
    <li className="rounded-xl border border-vita-100 bg-white">
      <details>
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-vita-900">{item.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {category && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${pillClassFor(category.color)}`}>
                  {category.name}
                </span>
              )}
              {location && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${pillClassFor(location.color)}`}>
                  {location.name}
                </span>
              )}
              {item.condition && (
                <span className="text-xs text-vita-500">{conditionLabels[item.condition]}</span>
              )}
            </div>
          </div>
          {item.value != null && (
            <span className="shrink-0 text-sm font-medium text-vita-700">
              {currency.format(item.value)}
            </span>
          )}
          {item.warranty_until && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                warrantyExpired ? "bg-red-50 text-red-600" : "bg-vita-50 text-vita-600"
              }`}
            >
              Garanti: {formatDate(item.warranty_until)}
            </span>
          )}
        </summary>

        <form action={updateWithId} className="space-y-2 border-t border-vita-100 px-4 py-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="Ad">
              <input name="name" type="text" defaultValue={item.name} required className={inputClass} />
            </Field>
            <Field label="Kategori">
              <select name="category_id" defaultValue={item.category_id ?? ""} className={inputClass}>
                <option value="">Kategorisiz</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Konum">
              <select name="location_id" defaultValue={item.location_id ?? ""} className={inputClass}>
                <option value="">Belirtilmedi</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Değer (TL)">
              <input
                name="value"
                type="number"
                step="0.01"
                defaultValue={item.value ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Seri numarası">
              <input
                name="serial_number"
                type="text"
                defaultValue={item.serial_number ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Durum">
              <select name="condition" defaultValue={item.condition ?? ""} className={inputClass}>
                <option value="">Belirtilmedi</option>
                <option value="new">Yeni</option>
                <option value="good">İyi</option>
                <option value="fair">Orta</option>
                <option value="poor">Kötü</option>
              </select>
            </Field>
            <Field label="Alım tarihi">
              <input
                name="purchase_date"
                type="date"
                defaultValue={item.purchase_date ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Garanti bitiş">
              <input
                name="warranty_until"
                type="date"
                defaultValue={item.warranty_until ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Not">
            <textarea name="note" defaultValue={item.note ?? ""} rows={2} className={inputClass} />
          </Field>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-lg bg-vita-600 px-3 py-2 text-sm font-medium text-white hover:bg-vita-700"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => deleteItem(item.id)}
              className="ml-auto text-sm text-vita-400 hover:text-red-500"
            >
              Sil
            </button>
          </div>
        </form>
      </details>
    </li>
  );
}
