"use client";

import { updateItem, deleteItem } from "./actions";

export type InventoryItemRow = {
  id: string;
  name: string;
  category: string | null;
  location: string | null;
  purchase_date: string | null;
  warranty_until: string | null;
  value: number | null;
  note: string | null;
};

const currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

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

export function InventoryItemRow({ item }: { item: InventoryItemRow }) {
  const updateWithId = updateItem.bind(null, item.id);
  const warrantyExpired = isExpired(item.warranty_until);

  return (
    <li className="rounded-xl border border-vita-100 bg-white">
      <details>
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-vita-900">{item.name}</p>
            <p className="truncate text-xs text-vita-500">
              {[item.category, item.location].filter(Boolean).join(" · ") || "Detay yok"}
            </p>
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
            <input
              name="name"
              type="text"
              defaultValue={item.name}
              required
              placeholder="Ad"
              className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
            <input
              name="category"
              type="text"
              defaultValue={item.category ?? ""}
              placeholder="Kategori"
              className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
            <input
              name="location"
              type="text"
              defaultValue={item.location ?? ""}
              placeholder="Konum (salon, garaj...)"
              className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
            <input
              name="value"
              type="number"
              step="0.01"
              defaultValue={item.value ?? ""}
              placeholder="Değer (TL)"
              className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
            <div className="flex items-center gap-2 text-xs text-vita-500">
              <label className="w-24 shrink-0">Alım tarihi:</label>
              <input
                name="purchase_date"
                type="date"
                defaultValue={item.purchase_date ?? ""}
                className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-vita-500">
              <label className="w-24 shrink-0">Garanti biter:</label>
              <input
                name="warranty_until"
                type="date"
                defaultValue={item.warranty_until ?? ""}
                className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
              />
            </div>
          </div>
          <textarea
            name="note"
            defaultValue={item.note ?? ""}
            placeholder="Not (seri no, fatura yeri...)"
            rows={2}
            className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
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
