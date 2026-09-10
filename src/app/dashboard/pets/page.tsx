import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { addPet } from "./actions";
import { PetCard, type PetRow } from "./PetCard";

export default async function PetsPage() {
  const supabase = await createClient();
  const { data: pets } = await supabase
    .from("pets")
    .select("id, name, species, breed, birth_date, next_vet_date, notes")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Evcil Hayvanlar"
        description="Ailenin dostlarının bilgileri, aşı/veteriner tarihleri ve notları."
      />

      <form action={addPet} className="space-y-2 rounded-xl border border-vita-100 bg-white p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            name="name"
            type="text"
            placeholder="Ad *"
            required
            className="rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
          />
          <input
            name="species"
            type="text"
            placeholder="Tür (kedi, köpek...)"
            className="rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
          />
          <input
            name="breed"
            type="text"
            placeholder="Cins (opsiyonel)"
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <div className="flex items-center gap-2 text-xs text-vita-500">
            <label className="w-20 shrink-0">Doğum:</label>
            <input
              name="birth_date"
              type="date"
              className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-vita-500">
          <label className="w-28 shrink-0">Sonraki veteriner:</label>
          <input
            name="next_vet_date"
            type="date"
            className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
        </div>
        <textarea
          name="notes"
          placeholder="Notlar (opsiyonel)"
          rows={2}
          className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
        />
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
