"use client";

import { useState, useTransition } from "react";
import type { PetSpecies } from "@/lib/family";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { addPet } from "./actions";

export function AddPetButton({ species }: { species: PetSpecies[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addPet(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <AddButton label="Evcil Hayvan Ekle" onClick={() => setOpen(true)} />
      {open && (
        <Modal title="Yeni evcil hayvan" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Ad">
                <input name="name" type="text" required className={inputClass} />
              </Field>
              <Field label="Tür">
                <select name="species_id" defaultValue="" className={inputClass}>
                  <option value="">Belirtilmedi</option>
                  {species.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ağırlık (kg)">
                <input name="weight_kg" type="number" step="0.1" className={inputClass} />
              </Field>
              <Field label="Doğum tarihi">
                <input name="birth_date" type="date" className={inputClass} />
              </Field>
              <Field label="Sonraki veteriner" className="col-span-2">
                <input name="next_vet_date" type="date" className={inputClass} />
              </Field>
            </div>
            <Field label="Notlar">
              <textarea
                name="notes"
                placeholder="Mama, alerji, aşı geçmişi..."
                rows={2}
                className={inputClass}
              />
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
