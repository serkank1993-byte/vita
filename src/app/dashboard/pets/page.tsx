import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getPetSpecies } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { AddPetButton } from "./AddPetButton";
import { PetCard, type PetRow } from "./PetCard";

export default async function PetsPage() {
  const supabase = await createClient();

  const [family, { data: pets }] = await Promise.all([
    getCurrentFamily(),
    supabase
      .from("pets")
      .select("id, name, species_id, birth_date, next_vet_date, weight_kg, notes")
      .order("created_at", { ascending: false }),
  ]);
  const species = family ? await getPetSpecies(family.id) : [];

  const rows = pets ?? [];

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Evcil Hayvanlar"
        description="Ailenin dostlarının bilgileri, aşı/veteriner tarihleri ve notları."
        action={<AddPetButton species={species} />}
      />

      <ul className="space-y-2">
        {rows.map((pet) => (
          <PetCard key={pet.id} pet={pet as PetRow} species={species} />
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-vita-400">Henüz evcil hayvan eklenmedi. Sağ üstten ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
