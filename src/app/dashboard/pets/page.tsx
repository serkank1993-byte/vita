import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { AddPetButton } from "./AddPetButton";
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
        action={<AddPetButton />}
      />

      <ul className="space-y-2">
        {(pets ?? []).map((pet) => (
          <PetCard key={pet.id} pet={pet as PetRow} />
        ))}
        {(pets ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz evcil hayvan eklenmedi. Sağ üstten ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
