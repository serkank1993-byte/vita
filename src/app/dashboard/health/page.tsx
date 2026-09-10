import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { addRecord } from "./actions";
import { HealthRecordRow, type HealthRecordRow as HealthRecordRowType } from "./HealthRecordRow";

export default async function HealthPage() {
  const supabase = await createClient();
  const family = await getCurrentFamily();
  const members = family ? await getFamilyMembers(family.id) : [];

  const { data: records } = await supabase
    .from("health_records")
    .select("id, person_id, title, record_date, next_date, note")
    .order("record_date", { ascending: false });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Sağlık Takibi"
        description="Aile bireylerinin kontrol, aşı ve ilaç kayıtları."
      />

      <form action={addRecord} className="space-y-2 rounded-xl border border-vita-100 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <input
            name="title"
            type="text"
            placeholder="Başlık (örn. Diş kontrolü) *"
            required
            className="min-w-[10rem] flex-1 rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <select
            name="person_id"
            defaultValue=""
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          >
            <option value="">Kişi seç</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name || m.email}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-vita-500">Tarih:</label>
          <input
            name="record_date"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <label className="text-xs text-vita-500">Sonraki hatırlatma:</label>
          <input
            name="next_date"
            type="date"
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
        </div>
        <textarea
          name="note"
          placeholder="Not (opsiyonel)"
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
        {(records ?? []).map((record) => (
          <HealthRecordRow key={record.id} record={record as HealthRecordRowType} members={members} />
        ))}
        {(records ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz kayıt yok.</p>
        )}
      </ul>
    </div>
  );
}
