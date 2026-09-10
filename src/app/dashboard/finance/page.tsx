import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Field, inputClass } from "@/components/Field";
import { addTransaction } from "./actions";
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
      <PageHeader title="Gelir / Gider" description="Aile bütçesinin gelir ve gider takibi." />

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

      <form
        action={addTransaction}
        className="mt-6 space-y-3 rounded-xl border border-vita-100 bg-white p-4"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label="Tür">
            <select name="type" defaultValue="expense" className={inputClass}>
              <option value="expense">Gider</option>
              <option value="income">Gelir</option>
            </select>
          </Field>
          <Field label="Tutar (TL)">
            <input name="amount" type="number" step="0.01" min="0.01" required className={inputClass} />
          </Field>
          <Field label="Kategori">
            <input name="category" type="text" placeholder="Market, fatura..." className={inputClass} />
          </Field>
          <Field label="Tarih">
            <input
              name="occurred_on"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={inputClass}
            />
          </Field>
          <Field label="Ödeme yöntemi">
            <input name="payment_method" type="text" placeholder="Nakit, kart..." className={inputClass} />
          </Field>
          <Field label="Not" className="col-span-2 sm:col-span-2">
            <input name="note" type="text" className={inputClass} />
          </Field>
          <label className="col-span-2 flex items-center gap-2 self-end pb-2 text-sm text-vita-600 sm:col-span-1">
            <input name="is_recurring" type="checkbox" className="h-4 w-4 rounded border-vita-300 text-vita-600" />
            Düzenli/sabit ödeme
          </label>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-vita-600 px-4 py-2 text-sm font-medium text-white hover:bg-vita-700"
        >
          Ekle
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {rows.map((tx) => (
          <TransactionRow key={tx.id} tx={tx as TransactionRowType} />
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-vita-400">Henüz kayıt yok. Yukarıdan ekleyebilirsin.</p>
        )}
      </ul>
    </div>
  );
}
