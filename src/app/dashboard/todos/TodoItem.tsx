"use client";

import type { FamilyMember } from "@/lib/family";
import { Field, inputClass } from "@/components/Field";
import { toggleTodo, deleteTodo, updateTodo } from "./actions";

export type TodoRow = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_done: boolean;
  priority: "low" | "medium" | "high";
  assigned_to: string | null;
};

const priorityLabels: Record<TodoRow["priority"], string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

const priorityDotClass: Record<TodoRow["priority"], string> = {
  low: "bg-vita-300",
  medium: "bg-amber-400",
  high: "bg-red-500",
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
  const assignee = members.find((m) => m.id === todo.assigned_to) ?? null;
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
            className={`h-2 w-2 shrink-0 rounded-full ${priorityDotClass[todo.priority]}`}
            title={`Öncelik: ${priorityLabels[todo.priority]}`}
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

        <form action={updateWithId} className="space-y-2 border-t border-vita-100 px-4 py-3">
          <input type="hidden" name="title" value={todo.title} />
          <Field label="Detay">
            <textarea
              name="description"
              defaultValue={todo.description ?? ""}
              rows={2}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Field label="Son tarih">
              <input
                name="due_date"
                type="date"
                defaultValue={todo.due_date ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Öncelik">
              <select name="priority" defaultValue={todo.priority} className={inputClass}>
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </Field>
            <Field label="Sorumlu" className="col-span-2 sm:col-span-1">
              <select name="assigned_to" defaultValue={todo.assigned_to ?? ""} className={inputClass}>
                <option value="">Atanmadı</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name || m.email}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex items-center gap-2">
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
