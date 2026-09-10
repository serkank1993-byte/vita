"use client";

import type { FamilyMember } from "@/lib/family";
import { deleteRecord } from "./actions";

export type HealthRecordType = "checkup" | "vaccination" | "medication" | "allergy" | "other";

export type HealthRecordRow = {
  id: string;
  person_id: string | null;
  title: string;
  record_type: HealthRecordType;
  doctor_or_clinic: string | null;
  record_date: string;
  next_date: string | null;
  note: string | null;
};

const typeLabels: Record<HealthRecordType, string> = {
  checkup: "Kontrol",
  vaccination: "Aşı",
  medication: "İlaç",
  allergy: "Alerji",
  other: "Diğer",
};

function formatDate(value: string) {
  return new Date(value + "T00:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(value: string | null) {
  if (!value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(value + "T00:00:00") < today;
}

export function HealthRecordRow({
  record,
  members,
}: {
  record: HealthRecordRow;
  members: FamilyMember[];
}) {
  const person = members.find((m) => m.id === record.person_id) ?? null;
  const nextOverdue = isOverdue(record.next_date);

  return (
    <li className="rounded-lg border border-vita-100 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-vita-900">{record.title}</span>
        <span className="rounded-full bg-vita-50 px-2 py-0.5 text-xs text-vita-600">
          {typeLabels[record.record_type]}
        </span>
        {person && (
          <span className="rounded-full bg-vita-100 px-2 py-0.5 text-xs text-vita-800">
            {person.full_name || person.email}
          </span>
        )}
        <span className="text-xs text-vita-500">{formatDate(record.record_date)}</span>
        {record.next_date && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              nextOverdue ? "bg-red-50 text-red-600" : "bg-vita-50 text-vita-600"
            }`}
          >
            Sonraki: {formatDate(record.next_date)}
          </span>
        )}
        <button
          onClick={() => deleteRecord(record.id)}
          className="ml-auto text-sm text-vita-400 hover:text-red-500"
          aria-label="Sil"
        >
          Sil
        </button>
      </div>
      {record.doctor_or_clinic && (
        <p className="mt-1 text-xs text-vita-500">🩺 {record.doctor_or_clinic}</p>
      )}
      {record.note && <p className="mt-1 text-sm text-vita-600">{record.note}</p>}
    </li>
  );
}
