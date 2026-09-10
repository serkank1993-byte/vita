import { ListChecks, ShoppingCart, PawPrint, Calendar, Wallet, HeartPulse, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";
import { WidgetCard } from "@/components/WidgetCard";

const currency = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

function shortDate(value: string) {
  return new Date(value + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default async function DashboardHome() {
  const supabase = await createClient();

  const todayStr = new Date().toISOString().slice(0, 10);
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const in30Str = in30.toISOString().slice(0, 10);

  const [
    family,
    { data: openTodos },
    { data: openShoppingItems },
    { data: upcomingEvents },
    { data: transactions },
    { data: dueVetPets },
    { data: dueHealthRecords },
    { data: expiringInventory },
  ] = await Promise.all([
    getCurrentFamily(),
    supabase
      .from("todos")
      .select("id, title, due_date")
      .eq("is_done", false)
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5),
    supabase.from("shopping_items").select("id").eq("is_bought", false),
    supabase
      .from("events")
      .select("id, title, event_date")
      .gte("event_date", todayStr)
      .order("event_date", { ascending: true })
      .limit(5),
    supabase.from("transactions").select("type, amount"),
    supabase
      .from("pets")
      .select("id, name, next_vet_date")
      .not("next_vet_date", "is", null)
      .lte("next_vet_date", in30Str)
      .order("next_vet_date", { ascending: true }),
    supabase
      .from("health_records")
      .select("id, title, next_date")
      .not("next_date", "is", null)
      .lte("next_date", in30Str)
      .order("next_date", { ascending: true }),
    supabase
      .from("inventory_items")
      .select("id, name, warranty_until")
      .not("warranty_until", "is", null)
      .lte("warranty_until", in30Str)
      .order("warranty_until", { ascending: true }),
  ]);

  const totalIncome = (transactions ?? [])
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = (transactions ?? [])
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;
  const overdueTodoCount = (openTodos ?? []).filter((t) => t.due_date && t.due_date < todayStr).length;

  return (
    <div>
      <PageHeader
        title={`Merhaba, ${family?.name} 👋`}
        description="Ailenin tüm modüllerinden özet — bir karta dokunarak ilgili sayfaya geç."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <WidgetCard title="Yapılacaklar" icon={ListChecks} href="/dashboard/todos">
          {(openTodos ?? []).length === 0 ? (
            <p className="text-sm text-vita-400">Açık görev yok 🎉</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {(openTodos ?? []).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-vita-800">{t.title}</span>
                  {t.due_date && (
                    <span
                      className={`shrink-0 text-xs ${
                        t.due_date < todayStr ? "font-medium text-red-600" : "text-vita-400"
                      }`}
                    >
                      {shortDate(t.due_date)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {overdueTodoCount > 0 && (
            <p className="mt-2 text-xs font-medium text-red-600">{overdueTodoCount} görevin süresi geçti</p>
          )}
        </WidgetCard>

        <WidgetCard title="Alışveriş Listesi" icon={ShoppingCart} href="/dashboard/shopping">
          <p className="text-2xl font-semibold text-vita-900">{(openShoppingItems ?? []).length}</p>
          <p className="text-xs text-vita-500">alınacak ürün</p>
        </WidgetCard>

        <WidgetCard title="Takvim" icon={Calendar} href="/dashboard/calendar">
          {(upcomingEvents ?? []).length === 0 ? (
            <p className="text-sm text-vita-400">Yaklaşan etkinlik yok</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {(upcomingEvents ?? []).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-vita-800">{e.title}</span>
                  <span className="shrink-0 text-xs text-vita-400">{shortDate(e.event_date)}</span>
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>

        <WidgetCard title="Gelir / Gider" icon={Wallet} href="/dashboard/finance">
          <p className={`text-2xl font-semibold ${balance >= 0 ? "text-vita-900" : "text-red-600"}`}>
            {currency.format(balance)}
          </p>
          <p className="text-xs text-vita-500">güncel bakiye</p>
        </WidgetCard>

        <WidgetCard title="Evcil Hayvanlar" icon={PawPrint} href="/dashboard/pets">
          {(dueVetPets ?? []).length === 0 ? (
            <p className="text-sm text-vita-400">Yaklaşan veteriner randevusu yok</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {(dueVetPets ?? []).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-vita-800">{p.name}</span>
                  <span
                    className={`shrink-0 text-xs ${
                      p.next_vet_date! < todayStr ? "font-medium text-red-600" : "text-vita-400"
                    }`}
                  >
                    {shortDate(p.next_vet_date!)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>

        <WidgetCard title="Sağlık Takibi" icon={HeartPulse} href="/dashboard/health">
          {(dueHealthRecords ?? []).length === 0 ? (
            <p className="text-sm text-vita-400">Yaklaşan hatırlatma yok</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {(dueHealthRecords ?? []).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-vita-800">{r.title}</span>
                  <span
                    className={`shrink-0 text-xs ${
                      r.next_date! < todayStr ? "font-medium text-red-600" : "text-vita-400"
                    }`}
                  >
                    {shortDate(r.next_date!)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>

        <WidgetCard title="Envanter" icon={Package} href="/dashboard/inventory">
          {(expiringInventory ?? []).length === 0 ? (
            <p className="text-sm text-vita-400">Yaklaşan garanti bitişi yok</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {(expiringInventory ?? []).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-vita-800">{i.name}</span>
                  <span
                    className={`shrink-0 text-xs ${
                      i.warranty_until! < todayStr ? "font-medium text-red-600" : "text-vita-400"
                    }`}
                  >
                    {shortDate(i.warranty_until!)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </WidgetCard>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-vita-200 bg-white p-4">
        <p className="text-sm text-vita-600">
          Aileni davet etmek için menüdeki{" "}
          <span className="font-mono font-medium text-vita-800">davet kodunu</span> paylaş. Kodla
          katılan herkes sadece bu ailenin verilerini görebilir.
        </p>
      </div>
    </div>
  );
}
