"use client";

import { X } from "lucide-react";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-medium text-vita-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-vita-400 hover:text-vita-700"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
