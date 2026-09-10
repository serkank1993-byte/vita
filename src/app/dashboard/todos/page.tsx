import { createClient } from "@/lib/supabase/server";
import { addTodo } from "./actions";
import { TodoItem } from "./TodoItem";

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: todos } = await supabase
    .from("todos")
    .select("id, title, is_done")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-vita-900">Yapılacaklar</h1>
      <p className="mt-1 text-sm text-vita-600">Ailece paylaşılan görev listesi.</p>

      <form action={addTodo} className="mt-6 flex gap-2">
        <input
          name="title"
          type="text"
          placeholder="Yeni görev ekle..."
          required
          className="w-full rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-vita-600 px-4 py-2 font-medium text-white hover:bg-vita-700"
        >
          Ekle
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {(todos ?? []).map((todo) => (
          <TodoItem key={todo.id} id={todo.id} title={todo.title} isDone={todo.is_done} />
        ))}
        {(todos ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz görev yok. Yukarıdan ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
