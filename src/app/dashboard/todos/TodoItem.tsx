"use client";

import type { FamilyMember } from "@/lib/family";
import { toggleTodo, deleteTodo, updateTodo } from "./actions";

type Assignee = { full_name: string | null; email: string | null } | null;

export type TodoRow = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_done: boolean;
  assigned_to: string | null;
  assignee: Assignee | Assignee[] | null;
};

function formatDueDate(dueDate: string | null) {
  if (!dueDate) return null;
  const date = new Date(dueDate + "T00:00:00");
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

function isOverdue(dueDate: string | null, isDone: boolean) {
  if (!dueDate || isDone) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate + "T00:00:00") < today;
}

export function TodoItem({ todo, members }: { todo: TodoRow; members: FamilyMember[] }) {
  const assignee = Array.isArray(todo.assignee) ? todo.assignee[0] : todo.assignee;
  const assigneeLabel = assignee?.full_name || assignee?.email || null;
  const dueLabel = formatDueDate(todo.due_date);
  const overdue = isOverdue(todo.due_date, todo.is_done);
  const updateWithId = updateTodo.bind(null, todo.id);

  return (
    <li className="rounded-lg border border-vita-100 bg-white">
      <details>
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
          <input
            type="checkbox"
            defaultChecked={todo.is_done}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => toggleTodo(todo.id, e.target.checked)}
            className="h-4 w-4 shrink-0 rounded border-vita-300 text-vita-600"
          />
          <span
            className={`flex-1 truncate ${
              todo.is_done ? "text-vita-400 line-through" : "text-vita-900"
            }`}
          >
            {todo.title}
          </span>
          {dueLabel && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                overdue ? "bg-red-50 text-red-600" : "bg-vita-50 text-vita-600"
              }`}
            >
              {dueLabel}
            </span>
          )}
          {assigneeLabel && (
            <span className="shrink-0 rounded-full bg-vita-100 px-2 py-0.5 text-xs text-vita-800">
              {assigneeLabel}
            </span>
          )}
        </summary>

        <form
          action={updateWithId}
          className="space-y-2 border-t border-vita-100 px-4 py-3"
        >
          <input type="hidden" name="title" value={todo.title} />
          <textarea
            name="description"
            defaultValue={todo.description ?? ""}
            placeholder="Detay ekle..."
            rows={2}
            className="w-full rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              name="due_date"
              type="date"
              defaultValue={todo.due_date ?? ""}
              className="rounded-lg border border-vita-200 px-3 py-2 text-sm outline-none focus:border-vita-500"
            />
            <select
              name="assigned_to"
              defaultValue={todo.assigned_to ?? ""}
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
              className="rounded-lg bg-vita-600 px-3 py-2 text-sm font-medium text-white hover:bg-vita-700"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              className="ml-auto text-sm text-vita-400 hover:text-red-500"
            >
              Görevi sil
            </button>
          </div>
        </form>
      </details>
    </li>
  );
}
