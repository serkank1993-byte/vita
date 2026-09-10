import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { addTodo } from "./actions";
import { TodoItem, type TodoRow } from "./TodoItem";

export default async function TodosPage() {
  const supabase = await createClient();
  const family = await getCurrentFamily();
  const members = family ? await getFamilyMembers(family.id) : [];

  const { data: todos } = await supabase
    .from("todos")
    .select("id, title, description, due_date, is_done, priority, assigned_to")
    .order("is_done", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Yapılacaklar"
        description="Ailece paylaşılan görev listesi — öncelik, tarih ve sorumlu atayabilir, göreve tıklayarak detay ekleyebilirsin."
      />

      <form action={addTodo} className="space-y-3 rounded-xl border border-vita-100 bg-white p-4">
        <Field label="Görev başlığı">
          <input name="title" type="text" required className={inputClass} />
        </Field>
        <Field label="Detay">
          <textarea name="description" rows={2} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label="Son tarih">
            <input name="due_date" type="date" className={inputClass} />
          </Field>
          <Field label="Öncelik">
            <select name="priority" defaultValue="medium" className={inputClass}>
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </Field>
          <Field label="Sorumlu" className="col-span-2 sm:col-span-1">
            <select name="assigned_to" defaultValue="" className={inputClass}>
              <option value="">Atanmadı</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name || m.email}
                </option>
              ))}
            </select>
          </Field>
          <div className="col-span-2 flex items-end sm:col-span-1">
            <button
              type="submit"
              className="w-full rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
            >
              Ekle
            </button>
          </div>
        </div>
      </form>

      <ul className="mt-6 space-y-2">
        {(todos ?? []).map((todo) => (
          <TodoItem key={todo.id} todo={todo as TodoRow} members={members} />
        ))}
        {(todos ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz görev yok. Yukarıdan ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
