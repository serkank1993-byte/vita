"use client";

import { deleteEvent } from "./actions";

export type EventCategory = "general" | "birthday" | "appointment" | "holiday" | "reminder";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: EventCategory;
  event_date: string;
  event_time: string | null;
};

const categoryLabels: Record<EventCategory, string> = {
  general: "Genel",
  birthday: "Doğum günü",
  appointment: "Randevu",
  holiday: "Tatil",
  reminder: "Hatırlatma",
};

const categoryClass: Record<EventCategory, string> = {
  general: "bg-vita-50 text-vita-600",
  birthday: "bg-pink-50 text-pink-600",
  appointment: "bg-blue-50 text-blue-600",
  holiday: "bg-amber-50 text-amber-600",
  reminder: "bg-purple-50 text-purple-600",
};

export function formatEventDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("tr-TR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function EventItem({ event }: { event: EventRow }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-vita-100 bg-white px-4 py-3">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-vita-50 py-1 text-vita-700">
        <span className="text-xs font-medium uppercase">{formatEventDate(event.event_date)}</span>
        {event.event_time && <span className="text-xs text-vita-500">{event.event_time.slice(0, 5)}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-vita-900">{event.title}</p>
          <span className={`rounded-full px-2 py-0.5 text-xs ${categoryClass[event.category]}`}>
            {categoryLabels[event.category]}
          </span>
        </div>
        {event.location && <p className="mt-0.5 text-xs text-vita-500">📍 {event.location}</p>}
        {event.description && <p className="mt-0.5 text-sm text-vita-600">{event.description}</p>}
      </div>
      <button
        onClick={() => deleteEvent(event.id)}
        className="shrink-0 text-sm text-vita-400 hover:text-red-500"
        aria-label="Sil"
      >
        Sil
      </button>
    </li>
  );
}
