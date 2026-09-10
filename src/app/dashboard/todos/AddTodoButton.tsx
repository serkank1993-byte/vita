"use client";

import { useState, useTransition } from "react";
import type { FamilyMember } from "@/lib/family";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { addTodo } from "./actions";

export function AddTodoButton({ members }: { members: FamilyMember[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addTodo(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <AddButton label="Görev Ekle" onClick={() => setOpen(true)} />
      {open && (
        <Modal title="Yeni görev" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Görev başlığı">
              <input name="title" type="text" required className={inputClass} />
            </Field>
            <Field label="Detay">
              <textarea name="description" rows={2} className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Son tarih">
                <input name="due_date" type="date" className={inputClass} />
              </Field>
              <Field label="Öncelik">
                <select name="priority" defaultValue="medium" className={inputClass}>
                  <option value="low">Düşük</option>
                  <option value="medium">Orta</option>
                  <option value="high">Yüksek</option>
                </select>
              </Field>
              <Field label="Sorumlu" className="col-span-2">
                <select name="assigned_to" defaultValue="" className={inputClass}>
                  <option value="">Atanmadı</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name || m.email}
                    </option>
                  ))}
                </select>
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
