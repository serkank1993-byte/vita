"use client";

import { useState, useTransition } from "react";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { addItem } from "./actions";

export function AddItemButton() {
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
      <AddButton label="Eşya Ekle" onClick={() => setOpen(true)} />
      {open && (
        <Modal title="Yeni eşya" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Ad" className="col-span-2">
                <input name="name" type="text" required className={inputClass} />
              </Field>
              <Field label="Kategori">
                <input name="category" type="text" placeholder="Elektronik, mobilya..." className={inputClass} />
              </Field>
              <Field label="Konum">
                <input name="location" type="text" placeholder="Salon, garaj..." className={inputClass} />
              </Field>
              <Field label="Değer (TL)">
                <input name="value" type="number" step="0.01" className={inputClass} />
              </Field>
              <Field label="Seri numarası">
                <input name="serial_number" type="text" className={inputClass} />
              </Field>
              <Field label="Durum">
                <select name="condition" defaultValue="" className={inputClass}>
                  <option value="">Belirtilmedi</option>
                  <option value="new">Yeni</option>
                  <option value="good">İyi</option>
                  <option value="fair">Orta</option>
                  <option value="poor">Kötü</option>
                </select>
              </Field>
              <Field label="Alım tarihi">
                <input name="purchase_date" type="date" className={inputClass} />
              </Field>
              <Field label="Garanti bitiş">
                <input name="warranty_until" type="date" className={inputClass} />
              </Field>
            </div>
            <Field label="Not">
              <textarea name="note" placeholder="Fatura yeri, ek bilgi..." rows={2} className={inputClass} />
            </Field>
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
