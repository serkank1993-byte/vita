export const EVENT_CATEGORIES = [
  "general",
  "birthday",
  "appointment",
  "holiday",
  "reminder",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const categoryLabels: Record<EventCategory, string> = {
  general: "Genel",
  birthday: "Doğum günü",
  appointment: "Randevu",
  holiday: "Tatil",
  reminder: "Hatırlatma",
};

export const categoryDot: Record<EventCategory, string> = {
  general: "bg-vita-500",
  birthday: "bg-pink-500",
  appointment: "bg-blue-500",
  holiday: "bg-amber-500",
  reminder: "bg-purple-500",
};

export const categoryPill: Record<EventCategory, string> = {
  general: "bg-vita-100 text-vita-700",
  birthday: "bg-pink-100 text-pink-700",
  appointment: "bg-blue-100 text-blue-700",
  holiday: "bg-amber-100 text-amber-700",
  reminder: "bg-purple-100 text-purple-700",
};

export function isEventCategory(value: string): value is EventCategory {
  return (EVENT_CATEGORIES as readonly string[]).includes(value);
}
