import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { AddRecordButton } from "./AddRecordButton";
import { HealthRecordRow, type HealthRecordRow as HealthRecordRowType } from "./HealthRecordRow";

export default async function HealthPage() {
  const supabase = await createClient();

  const [family, { data: records }] = await Promise.all([
    getCurrentFamily(),
    supabase
      .from("health_records")
      .select("id, person_id, title, record_type, doctor_or_clinic, record_date, next_date, note")
      .order("record_date", { ascending: false }),
  ]);
  const members = family ? await getFamilyMembers(family.id) : [];

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Sağlık Takibi"
        description="Aile bireylerinin kontrol, aşı ve ilaç kayıtları."
        action={<AddRecordButton members={members} />}
      />

      <ul className="space-y-2">
        {(records ?? []).map((record) => (
          <HealthRecordRow key={record.id} record={record as HealthRecordRowType} members={members} />
        ))}
        {(records ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz kayıt yok. Sağ üstten ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
