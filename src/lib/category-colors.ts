export const CATEGORY_COLORS = [
  "vita",
  "pink",
  "blue",
  "amber",
  "purple",
  "emerald",
  "red",
  "gray",
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const colorLabels: Record<CategoryColor, string> = {
  vita: "Yeşil",
  pink: "Pembe",
  blue: "Mavi",
  amber: "Turuncu",
  purple: "Mor",
  emerald: "Zümrüt",
  red: "Kırmızı",
  gray: "Gri",
};

export const colorDot: Record<CategoryColor, string> = {
  vita: "bg-vita-500",
  pink: "bg-pink-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  gray: "bg-gray-500",
};

export const colorPill: Record<CategoryColor, string> = {
  vita: "bg-vita-100 text-vita-700",
  pink: "bg-pink-100 text-pink-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  purple: "bg-purple-100 text-purple-700",
  emerald: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-gray-100 text-gray-700",
};

export function isCategoryColor(value: string): value is CategoryColor {
  return (CATEGORY_COLORS as readonly string[]).includes(value);
}

export function dotClassFor(color: string) {
  return isCategoryColor(color) ? colorDot[color] : colorDot.gray;
}

export function pillClassFor(color: string) {
  return isCategoryColor(color) ? colorPill[color] : colorPill.gray;
}
