"use client";

import { deleteTransaction } from "./actions";

export type TransactionRow = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string | null;
  note: string | null;
  occurred_on: string;
};

const currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

export function TransactionRow({ tx }: { tx: TransactionRow }) {
  const isIncome = tx.type === "income";

  return (
    <li className="flex items-center gap-3 rounded-lg border border-vita-100 bg-white px-4 py-3">
      <div
        className={`h-2 w-2 shrink-0 rounded-full ${isIncome ? "bg-emerald-500" : "bg-red-500"}`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-vita-900">
          {tx.category || (isIncome ? "Gelir" : "Gider")}
        </p>
        <p className="truncate text-xs text-vita-500">
          {new Date(tx.occurred_on + "T00:00:00").toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
          })}
          {tx.note ? ` · ${tx.note}` : ""}
        </p>
      </div>
      <span className={`shrink-0 font-medium ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
        {isIncome ? "+" : "-"}
        {currency.format(tx.amount)}
      </span>
      <button
        onClick={() => deleteTransaction(tx.id)}
        className="shrink-0 text-sm text-vita-400 hover:text-red-500"
        aria-label="Sil"
      >
        Sil
      </button>
    </li>
  );
}
