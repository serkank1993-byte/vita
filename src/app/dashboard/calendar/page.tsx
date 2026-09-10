import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CalendarGrid, type CalendarEvent } from "./CalendarGrid";

function parseMonthParam(value?: string) {
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    const [y, m] = value.split("-").map(Number);
    return { year: y, month: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

function monthParam(year: number, month: number) {
  const d = new Date(year, month, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParamValue } = await searchParams;
  const { year, month } = parseMonthParam(monthParamValue);

  const monthStr = String(month + 1).padStart(2, "0");
  const rangeStart = `${year}-${monthStr}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const rangeEnd = `${year}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, location, category, event_date, event_time")
    .gte("event_date", rangeStart)
    .lte("event_date", rangeEnd)
    .order("event_time", { ascending: true, nullsFirst: true });

  const prevDate = new Date(year, month - 1, 1);
  const nextDate = new Date(year, month + 1, 1);
  const now = new Date();

  return (
    <div>
      <PageHeader
        title="Takvim"
        description="Ailenin ortak etkinlikleri, randevuları ve hatırlatmaları."
      />
      <CalendarGrid
        year={year}
        month={month}
        events={(events ?? []) as CalendarEvent[]}
        prevHref={`/dashboard/calendar?month=${monthParam(prevDate.getFullYear(), prevDate.getMonth())}`}
        nextHref={`/dashboard/calendar?month=${monthParam(nextDate.getFullYear(), nextDate.getMonth())}`}
        todayHref={`/dashboard/calendar?month=${monthParam(now.getFullYear(), now.getMonth())}`}
      />
    </div>
  );
}
