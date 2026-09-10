import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";
import { addTodo } from "./actions";
import { TodoItem, type TodoRow } from "./TodoItem";

export default async function TodosPage() {
  const supabase = await createClient();
  const family = await getCurrentFamily();
  const members = family ? await getFamilyMembers(family.id) : [];

  const { data: todos } = await supabase
    .from("todos")
    .select(
      "id, title, description, due_date, is_done, assigned_to, assignee:profiles!assigned_to ( full_name, email )"
    )
    .order("is_done", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-vita-900">Yapılacaklar</h1>
      <p className="mt-1 text-sm text-vita-600">
        Ailece paylaşılan görev listesi — tarih ve sorumlu atayabilir, göreve
        tıklayarak detay ekleyebilirsin.
      </p>

      <form action={addTodo} className="mt-6 space-y-2 rounded-xl border border-vita-100 bg-white p-4">
        <input
          name="title"
          type="text"
          placeholder="Yeni görev başlığı..."
          required
          className="w-full rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
        />
        <textarea
          name="description"
          placeholder="Detay (opsiyonel)..."
          rows={2}
          className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
        />
        <div className="flex flex-wrap items-center gap-2">
          <input
            name="due_date"
            type="date"
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <select
            name="assigned_to"
            defaultValue=""
            className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          >
            <option value="">Atanmadı</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name || m.email}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="ml-auto rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
          >
            Ekle
          </button>
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
