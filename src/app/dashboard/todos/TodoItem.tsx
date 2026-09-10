"use client";

import { toggleTodo, deleteTodo } from "./actions";

export function TodoItem({
  id,
  title,
  isDone,
}: {
  id: string;
  title: string;
  isDone: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-vita-100 bg-white px-4 py-3">
      <label className="flex flex-1 items-center gap-3">
        <input
          type="checkbox"
          defaultChecked={isDone}
          onChange={(e) => toggleTodo(id, e.target.checked)}
          className="h-4 w-4 rounded border-vita-300 text-vita-600"
        />
        <span className={isDone ? "text-vita-400 line-through" : "text-vita-900"}>
          {title}
        </span>
      </label>
      <button
        onClick={() => deleteTodo(id)}
        className="text-sm text-vita-400 hover:text-red-500"
        aria-label="Sil"
      >
        Sil
      </button>
    </li>
  );
}
