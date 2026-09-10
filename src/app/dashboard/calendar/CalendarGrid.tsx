"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Field, inputClass } from "@/components/Field";
import { addEvent, updateEvent, deleteEvent } from "./actions";
import {
  EVENT_CATEGORIES,
  categoryLabels,
  categoryDot,
  categoryPill,
  type EventCategory,
} from "./categories";

export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: EventCategory;
  event_date: string;
  event_time: string | null;
};

const WEEKDAYS = ["PZT", "SAL", "ÇAR", "PER", "CUM", "CMT", "PZR"];

function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildMonthCells(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const jsWeekday = new Date(year, month, 1).getDay();
  const leadingOffset = jsWeekday === 0 ? 6 : jsWeekday - 1;
  const totalCells = leadingOffset + daysInMonth;
  const rows = Math.ceil(totalCells / 7);

  const cells: { date: Date | null; iso: string | null }[] = [];
  for (let i = 0; i < rows * 7; i++) {
    const dayNumber = i - leadingOffset + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push({ date: null, iso: null });
    } else {
      const date = new Date(year, month, dayNumber);
      cells.push({ date, iso: toIso(date) });
    }
  }
  return cells;
}

type ModalState = { mode: "create"; date: string } | { mode: "edit"; event: CalendarEvent } | null;

export function CalendarGrid({
  year,
  month,
  events,
  prevHref,
  nextHref,
  todayHref,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
  prevHref: string;
  nextHref: string;
  todayHref: string;
}) {
  const [modalState, setModalState] = useState<ModalState>(null);
  const [isPending, startTransition] = useTransition();

  const cells = buildMonthCells(year, month);
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = eventsByDate.get(e.event_date) ?? [];
    list.push(e);
    eventsByDate.set(e.event_date, list);
  }

  const todayIso = toIso(new Date());
  const monthLabel = new Date(year, month, 1).toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  function closeModal() {
    setModalState(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (modalState?.mode === "edit") {
        await updateEvent(modalState.event.id, formData);
      } else {
        await addEvent(formData);
      }
      closeModal();
    });
  }

  function handleDelete() {
    if (modalState?.mode !== "edit") return;
    const id = modalState.event.id;
    startTransition(async () => {
      await deleteEvent(id);
      closeModal();
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={prevHref}
            className="rounded-lg border border-vita-200 p-1.5 text-vita-600 hover:bg-vita-50"
            aria-label="Önceki ay"
          >
            <ChevronLeft size={18} />
          </Link>
          <h2 className="min-w-[10rem] text-center text-lg font-semibold capitalize text-vita-900">
            {monthLabel}
          </h2>
          <Link
            href={nextHref}
            className="rounded-lg border border-vita-200 p-1.5 text-vita-600 hover:bg-vita-50"
            aria-label="Sonraki ay"
          >
            <ChevronRight size={18} />
          </Link>
          <Link
            href={todayHref}
            className="rounded-lg border border-vita-200 px-3 py-1.5 text-sm text-vita-700 hover:bg-vita-50"
          >
            Bugün
          </Link>
        </div>
        <button
          onClick={() => setModalState({ mode: "create", date: todayIso })}
          className="flex items-center gap-1.5 rounded-lg bg-vita-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-vita-700"
        >
          <Plus size={16} /> Yeni Etkinlik
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
        {EVENT_CATEGORIES.map((cat) => (
          <span key={cat} className="flex items-center gap-1.5 text-xs text-vita-600">
            <span className={`h-2 w-2 rounded-full ${categoryDot[cat]}`} />
            {categoryLabels[cat]}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-vita-100 bg-white">
        <div className="grid min-w-[640px] grid-cols-7 border-b border-vita-100 text-center text-xs font-medium text-vita-500">
          {WEEKDAYS.map((d) => (
            <div key={d} className="border-r border-vita-100 py-2 [&:nth-child(7n)]:border-r-0">
              {d}
            </div>
          ))}
        </div>
        <div className="grid min-w-[640px] grid-cols-7">
          {cells.map((cell, i) => {
            const dayEvents = cell.iso ? eventsByDate.get(cell.iso) ?? [] : [];
            const isToday = cell.iso === todayIso;
            return (
              <div
                key={i}
                onClick={() => cell.iso && setModalState({ mode: "create", date: cell.iso })}
                className={`min-h-[6.5rem] border-b border-r border-vita-100 p-1.5 [&:nth-child(7n)]:border-r-0 ${
                  cell.iso ? "cursor-pointer hover:bg-vita-50/60" : "bg-vita-50/30"
                }`}
              >
                {cell.date && (
                  <>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        isToday ? "bg-vita-600 font-medium text-white" : "text-vita-700"
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <button
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalState({ mode: "edit", event: ev });
                          }}
                          className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] ${categoryPill[ev.category]}`}
                        >
                          {ev.event_time ? `${ev.event_time.slice(0, 5)} ` : ""}
                          {ev.title}
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="px-1.5 text-[11px] text-vita-400">+{dayEvents.length - 3} daha</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {modalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium text-vita-900">
                {modalState.mode === "edit" ? "Etkinliği düzenle" : "Yeni etkinlik"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-vita-400 hover:text-vita-700"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Başlık">
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={modalState.mode === "edit" ? modalState.event.title : ""}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Tarih">
                  <input
                    name="event_date"
                    type="date"
                    required
                    defaultValue={modalState.mode === "edit" ? modalState.event.event_date : modalState.date}
                    className={inputClass}
                  />
                </Field>
                <Field label="Saat">
                  <input
                    name="event_time"
                    type="time"
                    defaultValue={modalState.mode === "edit" ? modalState.event.event_time ?? "" : ""}
                    className={inputClass}
                  />
                </Field>
                <Field label="Tür">
                  <select
                    name="category"
                    defaultValue={modalState.mode === "edit" ? modalState.event.category : "general"}
                    className={inputClass}
                  >
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Konum">
                  <input
                    name="location"
                    type="text"
                    defaultValue={modalState.mode === "edit" ? modalState.event.location ?? "" : ""}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Not">
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={modalState.mode === "edit" ? modalState.event.description ?? "" : ""}
                  className={inputClass}
                />
              </Field>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700 disabled:opacity-60"
                >
                  Kaydet
                </button>
                {modalState.mode === "edit" && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="ml-auto text-sm text-red-500 hover:text-red-700"
                  >
                    Sil
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
