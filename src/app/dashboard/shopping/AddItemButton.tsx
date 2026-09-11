"use client";

import { useState, useTransition } from "react";
import type { ShoppingCategory } from "@/lib/family";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { addItem } from "./actions";

export function AddItemButton({ categories }: { categories: ShoppingCategory[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addItem(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <AddButton label="Ürün Ekle" onClick={() => setOpen(true)} />
      {open && (
        <Modal title="Yeni ürün" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Ürün adı">
              <input name="name" type="text" required className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Miktar">
                <input name="quantity" type="text" placeholder="1 kg, 2 adet..." className={inputClass} />
              </Field>
              <Field label="Kategori">
                <select name="category_id" defaultValue="" className={inputClass}>
                  <option value="">Kategorisiz</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Nereden" className="col-span-2">
                <input name="store" type="text" placeholder="Migros, Şok..." className={inputClass} />
              </Field>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700 disabled:opacity-60"
            >
              Ekle
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
