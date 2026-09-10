"use client";

import { deleteEvent } from "./actions";

export type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
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
        <p className="font-medium text-vita-900">{event.title}</p>
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
