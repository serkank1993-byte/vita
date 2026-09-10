"use client";

import { useState, useTransition } from "react";
import type { FamilyMember } from "@/lib/family";
import { AddButton } from "@/components/AddButton";
import { Modal } from "@/components/Modal";
import { Field, inputClass } from "@/components/Field";
import { addRecord } from "./actions";

export function AddRecordButton({ members }: { members: FamilyMember[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addRecord(formData);
      setOpen(false);
    });
  }

  return (
    <>
      <AddButton label="Kayıt Ekle" onClick={() => setOpen(true)} />
      {open && (
        <Modal title="Yeni sağlık kaydı" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Başlık">
              <input name="title" type="text" placeholder="Diş kontrolü..." required className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Kişi">
                <select name="person_id" defaultValue="" className={inputClass}>
                  <option value="">Kişi seç</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name || m.email}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tür">
                <select name="record_type" defaultValue="checkup" className={inputClass}>
                  <option value="checkup">Kontrol</option>
                  <option value="vaccination">Aşı</option>
                  <option value="medication">İlaç</option>
                  <option value="allergy">Alerji</option>
                  <option value="other">Diğer</option>
                </select>
              </Field>
              <Field label="Tarih">
                <input
                  name="record_date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className={inputClass}
                />
              </Field>
              <Field label="Sonraki hatırlatma">
                <input name="next_date" type="date" className={inputClass} />
              </Field>
              <Field label="Doktor / Klinik" className="col-span-2">
                <input name="doctor_or_clinic" type="text" className={inputClass} />
              </Field>
            </div>
            <Field label="Not">
              <textarea name="note" rows={2} className={inputClass} />
            </Field>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700 disabled:opacity-60"
            >
              Ekle
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
