"use client";

import { useState, useTransition } from "react";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { CATEGORY_COLORS, colorLabels, dotClassFor } from "@/lib/category-colors";
import type { CalendarCategory } from "@/lib/family";
import { addCategory, updateCategory, deleteCategory } from "./actions";

type ModalState = { mode: "create" } | { mode: "edit"; category: CalendarCategory } | null;

export function CategoryManager({ categories }: { categories: CalendarCategory[] }) {
  const [modalState, setModalState] = useState<ModalState>(null);
  const [isPending, startTransition] = useTransition();

  function closeModal() {
    setModalState(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (modalState?.mode === "edit") {
        await updateCategory(modalState.category.id, formData);
      } else {
        await addCategory(formData);
      }
      closeModal();
    });
  }

  function handleDelete() {
    if (modalState?.mode !== "edit") return;
    const id = modalState.category.id;
    startTransition(async () => {
      await deleteCategory(id);
      closeModal();
    });
  }

  return (
    <div className="mt-3">
      <ul className="space-y-1.5">
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => setModalState({ mode: "edit", category: cat })}
              className="flex w-full items-center gap-2 rounded-lg border border-vita-100 px-3 py-2 text-left text-sm hover:bg-vita-50"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClassFor(cat.color)}`} />
              <span className="text-vita-800">{cat.name}</span>
            </button>
          </li>
        ))}
        {categories.length === 0 && <p className="text-sm text-vita-400">Henüz kategori yok.</p>}
      </ul>

      <div className="mt-3">
        <AddButton label="Kategori Ekle" onClick={() => setModalState({ mode: "create" })} />
      </div>

      {modalState && (
        <Modal
          title={modalState.mode === "edit" ? "Kategoriyi düzenle" : "Yeni kategori"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Ad">
              <input
                name="name"
                type="text"
                required
                defaultValue={modalState.mode === "edit" ? modalState.category.name : ""}
                className={inputClass}
              />
            </Field>
            <Field label="Renk">
              <select
                name="color"
                defaultValue={modalState.mode === "edit" ? modalState.category.color : "vita"}
                className={inputClass}
              >
                {CATEGORY_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {colorLabels[c]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700 disabled:opacity-60"
              >
                Kaydet
              </button>
              {modalState.mode === "edit" && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="ml-auto text-sm text-red-500 hover:text-red-700"
                >
                  Sil
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
