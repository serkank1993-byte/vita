import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { addEvent } from "./actions";
import { EventItem, type EventRow } from "./EventItem";

export default async function CalendarPage() {
  const supabase = await createClient();
  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, location, category, event_date, event_time")
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true, nullsFirst: true });

  const upcoming = (events ?? []).filter((e) => e.event_date >= todayStr);
  const past = (events ?? []).filter((e) => e.event_date < todayStr).reverse();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Takvim"
        description="Ailenin ortak etkinlikleri, randevuları ve hatırlatmaları."
      />

      <form action={addEvent} className="space-y-3 rounded-xl border border-vita-100 bg-white p-4">
        <Field label="Etkinlik başlığı">
          <input name="title" type="text" required className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label="Tarih">
            <input name="event_date" type="date" required className={inputClass} />
          </Field>
          <Field label="Saat">
            <input name="event_time" type="time" className={inputClass} />
          </Field>
          <Field label="Tür">
            <select name="category" defaultValue="general" className={inputClass}>
              <option value="general">Genel</option>
              <option value="birthday">Doğum günü</option>
              <option value="appointment">Randevu</option>
              <option value="holiday">Tatil</option>
              <option value="reminder">Hatırlatma</option>
            </select>
          </Field>
          <Field label="Konum">
            <input name="location" type="text" className={inputClass} />
          </Field>
        </div>
        <Field label="Not">
          <textarea name="description" rows={2} className={inputClass} />
        </Field>
        <button
          type="submit"
          className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
        >
          Ekle
        </button>
      </form>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-medium text-vita-700">Yaklaşan</h2>
        <ul className="space-y-2">
          {upcoming.map((event) => (
            <EventItem key={event.id} event={event as EventRow} />
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-vita-400">Yaklaşan etkinlik yok.</p>
          )}
        </ul>
      </div>

      {past.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-sm font-medium text-vita-700">Geçmiş</h2>
          <ul className="space-y-2 opacity-60">
            {past.map((event) => (
              <EventItem key={event.id} event={event as EventRow} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
