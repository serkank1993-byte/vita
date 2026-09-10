"use client";

import { Field, inputClass } from "@/components/Field";
import { updatePet, deletePet } from "./actions";

export type PetRow = {
  id: string;
  name: string;
  species: string | null;
  breed: string | null;
  birth_date: string | null;
  next_vet_date: string | null;
  weight_kg: number | null;
  microchip_number: string | null;
  notes: string | null;
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value + "T00:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(value: string | null) {
  if (!value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(value + "T00:00:00") < today;
}

export function PetCard({ pet }: { pet: PetRow }) {
  const updateWithId = updatePet.bind(null, pet.id);
  const vetOverdue = isOverdue(pet.next_vet_date);

  return (
    <li className="rounded-xl border border-vita-100 bg-white">
      <details>
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
          <span className="text-2xl">🐾</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-vita-900">{pet.name}</p>
            <p className="truncate text-xs text-vita-500">
              {[pet.species, pet.breed, pet.weight_kg ? `${pet.weight_kg} kg` : null]
                .filter(Boolean)
                .join(" · ") || "Detay belirtilmedi"}
            </p>
          </div>
          {pet.next_vet_date && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                vetOverdue ? "bg-red-50 text-red-600" : "bg-vita-50 text-vita-600"
              }`}
            >
              Veteriner: {formatDate(pet.next_vet_date)}
            </span>
          )}
        </summary>

        <form action={updateWithId} className="space-y-2 border-t border-vita-100 px-4 py-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="Ad">
              <input name="name" type="text" defaultValue={pet.name} required className={inputClass} />
            </Field>
            <Field label="Tür">
              <input name="species" type="text" defaultValue={pet.species ?? ""} className={inputClass} />
            </Field>
            <Field label="Cins">
              <input name="breed" type="text" defaultValue={pet.breed ?? ""} className={inputClass} />
            </Field>
            <Field label="Ağırlık (kg)">
              <input
                name="weight_kg"
                type="number"
                step="0.1"
                defaultValue={pet.weight_kg ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Doğum tarihi">
              <input
                name="birth_date"
                type="date"
                defaultValue={pet.birth_date ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Sonraki veteriner">
              <input
                name="next_vet_date"
                type="date"
                defaultValue={pet.next_vet_date ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Mikroçip numarası" className="sm:col-span-2">
              <input
                name="microchip_number"
                type="text"
                defaultValue={pet.microchip_number ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Notlar">
            <textarea name="notes" defaultValue={pet.notes ?? ""} rows={2} className={inputClass} />
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
              onClick={() => deletePet(pet.id)}
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
