import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily, getFamilyMembers } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { AddTodoButton } from "./AddTodoButton";
import { TodoItem, type TodoRow } from "./TodoItem";

export default async function TodosPage() {
  const supabase = await createClient();

  const [family, { data: todos }] = await Promise.all([
    getCurrentFamily(),
    supabase
      .from("todos")
      .select("id, title, description, due_date, is_done, priority, assigned_to")
      .order("is_done", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false }),
  ]);
  const members = family ? await getFamilyMembers(family.id) : [];

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Yapılacaklar"
        description="Ailece paylaşılan görev listesi — öncelik, tarih ve sorumlu atayabilir, göreve tıklayarak detay ekleyebilirsin."
        action={<AddTodoButton members={members} />}
      />

      <ul className="space-y-2">
        {(todos ?? []).map((todo) => (
          <TodoItem key={todo.id} todo={todo as TodoRow} members={members} />
        ))}
        {(todos ?? []).length === 0 && (
          <p className="text-sm text-vita-400">Henüz görev yok. Sağ üstten ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
