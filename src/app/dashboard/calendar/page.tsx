import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { addEvent } from "./actions";
import { EventItem, type EventRow } from "./EventItem";

export default async function CalendarPage() {
  const supabase = await createClient();
  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, event_date, event_time")
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

      <form action={addEvent} className="space-y-2 rounded-xl border border-vita-100 bg-white p-4">
        <input
          name="title"
          type="text"
          placeholder="Etkinlik başlığı *"
          required
          className="w-full rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
        />
        <div className="flex flex-wrap gap-2">
          <input
            name="event_date"
            type="date"
            required
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <input
            name="event_time"
            type="time"
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <button
            type="submit"
            className="ml-auto rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
          >
            Ekle
          </button>
        </div>
        <textarea
          name="description"
          placeholder="Not (opsiyonel)"
          rows={2}
          className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
        />
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
