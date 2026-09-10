"use client";

import { Plus } from "lucide-react";

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg bg-vita-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-vita-700"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}
