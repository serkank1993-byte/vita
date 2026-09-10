import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { AddTransactionButton } from "./AddTransactionButton";
import { TransactionRow, type TransactionRow as TransactionRowType } from "./TransactionRow";

const currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

export default async function FinancePage() {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, type, amount, category, note, occurred_on, payment_method, is_recurring")
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });

  const rows = transactions ?? [];
  const totalIncome = rows.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = rows.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Gelir / Gider"
        description="Aile bütçesinin gelir ve gider takibi."
        action={<AddTransactionButton />}
      />

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-vita-100 bg-white p-3 text-center">
          <p className="text-xs text-vita-500">Gelir</p>
          <p className="mt-1 font-semibold text-emerald-600">{currency.format(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-vita-100 bg-white p-3 text-center">
          <p className="text-xs text-vita-500">Gider</p>
          <p className="mt-1 font-semibold text-red-600">{currency.format(totalExpense)}</p>
        </div>
        <div className="rounded-xl border border-vita-100 bg-white p-3 text-center">
          <p className="text-xs text-vita-500">Bakiye</p>
          <p className={`mt-1 font-semibold ${balance >= 0 ? "text-vita-800" : "text-red-600"}`}>
            {currency.format(balance)}
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-2">
        {rows.map((tx) => (
          <TransactionRow key={tx.id} tx={tx as TransactionRowType} />
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-vita-400">Henüz kayıt yok. Sağ üstten ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
