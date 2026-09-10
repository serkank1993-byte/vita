import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { addRecord } from "./actions";
import { HealthRecordRow, type HealthRecordRow as HealthRecordRowType } from "./HealthRecordRow";

export default async function HealthPage() {
  const supabase = await createClient();
  const family = await getCurrentFamily();
  const members = family ? await getFamilyMembers(family.id) : [];

  const { data: records } = await supabase
    .from("health_records")
    .select("id, person_id, title, record_type, doctor_or_clinic, record_date, next_date, note")
    .order("record_date", { ascending: false });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Sağlık Takibi"
        description="Aile bireylerinin kontrol, aşı ve ilaç kayıtları."
      />

      <form action={addRecord} className="space-y-3 rounded-xl border border-vita-100 bg-white p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label="Başlık" className="col-span-2">
            <input name="title" type="text" placeholder="Diş kontrolü..." required className={inputClass} />
          </Field>
          <Field label="Kişi">
            <select name="person_id" defaultValue="" className={inputClass}>
              <option value="">Kişi seç</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name || m.email}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tür">
            <select name="record_type" defaultValue="checkup" className={inputClass}>
              <option value="checkup">Kontrol</option>
              <option value="vaccination">Aşı</option>
              <option value="medication">İlaç</option>
              <option value="allergy">Alerji</option>
              <option value="other">Diğer</option>
            </select>
          </Field>
          <Field label="Tarih">
            <input
              name="record_date"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={inputClass}
            />
          </Field>
          <Field label="Sonraki hatırlatma">
            <input name="next_date" type="date" className={inputClass} />
          </Field>
          <Field label="Doktor / Klinik" className="col-span-2">
            <input name="doctor_or_clinic" type="text" className={inputClass} />
          </Field>
        </div>
        <Field label="Not">
          <textarea name="note" rows={2} className={inputClass} />
        </Field>
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
