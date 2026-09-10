import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { addPet } from "./actions";
import { PetCard, type PetRow } from "./PetCard";

export default async function PetsPage() {
  const supabase = await createClient();
  const { data: pets } = await supabase
    .from("pets")
    .select("id, name, species, breed, birth_date, next_vet_date, weight_kg, microchip_number, notes")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Evcil Hayvanlar"
        description="Ailenin dostlarının bilgileri, aşı/veteriner tarihleri ve notları."
      />

      <form action={addPet} className="space-y-3 rounded-xl border border-vita-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Field label="Ad">
            <input name="name" type="text" required className={inputClass} />
          </Field>
          <Field label="Tür">
            <input name="species" type="text" placeholder="Kedi, köpek..." className={inputClass} />
          </Field>
          <Field label="Cins">
            <input name="breed" type="text" className={inputClass} />
          </Field>
          <Field label="Ağırlık (kg)">
            <input name="weight_kg" type="number" step="0.1" className={inputClass} />
          </Field>
          <Field label="Doğum tarihi">
            <input name="birth_date" type="date" className={inputClass} />
          </Field>
          <Field label="Sonraki veteriner">
            <input name="next_vet_date" type="date" className={inputClass} />
          </Field>
          <Field label="Mikroçip numarası" className="sm:col-span-2">
            <input name="microchip_number" type="text" className={inputClass} />
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
          className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
        >
          Ekle
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {(pets ?? []).map((pet) => (
          <PetCard key={pet.id} pet={pet as PetRow} />
        ))}
        {(pets ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz evcil hayvan eklenmedi.</p>
        )}
      </ul>
    </div>
  );
}
