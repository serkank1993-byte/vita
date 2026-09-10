"use client";

import { useState, useTransition } from "react";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { addTransaction } from "./actions";

export function AddTransactionButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addTransaction(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <AddButton label="Kayıt Ekle" onClick={() => setOpen(true)} />
      {open && (
        <Modal title="Yeni gelir/gider kaydı" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tür">
                <select name="type" defaultValue="expense" className={inputClass}>
                  <option value="expense">Gider</option>
                  <option value="income">Gelir</option>
                </select>
              </Field>
              <Field label="Tutar (TL)">
                <input name="amount" type="number" step="0.01" min="0.01" required className={inputClass} />
              </Field>
              <Field label="Kategori">
                <input name="category" type="text" placeholder="Market, fatura..." className={inputClass} />
              </Field>
              <Field label="Tarih">
                <input
                  name="occurred_on"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className={inputClass}
                />
              </Field>
              <Field label="Ödeme yöntemi">
                <input name="payment_method" type="text" placeholder="Nakit, kart..." className={inputClass} />
              </Field>
              <Field label="Not">
                <input name="note" type="text" className={inputClass} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-vita-600">
              <input
                name="is_recurring"
                type="checkbox"
                className="h-4 w-4 rounded border-vita-300 text-vita-600"
              />
              Düzenli/sabit ödeme
            </label>
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
