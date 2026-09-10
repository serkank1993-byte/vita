import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import { logout } from "./actions";

const modules = [
  { href: "/dashboard", label: "Genel Bakış", icon: "🏠" },
  { href: "/dashboard/todos", label: "Yapılacaklar", icon: "✅" },
  { href: "/dashboard/shopping", label: "Alışveriş Listesi", icon: "🛒" },
  { href: "/dashboard/pets", label: "Evcil Hayvanlar", icon: "🐾" },
  { href: "/dashboard/calendar", label: "Takvim", icon: "📅" },
  { href: "/dashboard/finance", label: "Gelir / Gider", icon: "💰" },
  { href: "/dashboard/health", label: "Sağlık Takibi", icon: "🩺" },
  { href: "/dashboard/inventory", label: "Envanter", icon: "📦" },
  { href: "/dashboard/archive", label: "Dijital Arşiv", icon: "🗂️" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const family = await getCurrentFamily();

  if (!family) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col border-r border-vita-100 bg-white px-4 py-6">
        <div>
          <p className="text-lg font-semibold text-vita-900">Vita</p>
          <p className="mt-1 truncate text-sm text-vita-600">{family.name}</p>
          <p className="mt-1 text-xs text-vita-400">Davet kodu: {family.invite_code}</p>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-vita-800 hover:bg-vita-50"
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </Link>
          ))}
        </nav>

        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-vita-500 hover:bg-vita-50"
          >
            Çıkış yap
          </button>
        </form>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
