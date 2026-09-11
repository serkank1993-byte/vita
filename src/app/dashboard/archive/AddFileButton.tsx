"use client";

import { useState, useTransition } from "react";
import type { ArchiveCategory } from "@/lib/family";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { uploadFile } from "./actions";

export function AddFileButton({ categories }: { categories: ArchiveCategory[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await uploadFile(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <AddButton label="Dosya Yükle" onClick={() => setOpen(true)} />
      {open && (
        <Modal title="Yeni dosya yükle" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Dosya">
              <input name="file" type="file" required className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Kategori">
                <select name="category_id" defaultValue="" className={inputClass}>
                  <option value="">Seçilmedi</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Açıklama">
                <input name="description" type="text" className={inputClass} />
              </Field>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700 disabled:opacity-60"
            >
              {isPending ? "Yükleniyor..." : "Yükle"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
