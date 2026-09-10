import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createFamily, joinFamily } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("family_members")
    .select("family_id")
    .limit(1)
    .maybeSingle();

  if (membership) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-vita-900">Ailene hoş geldin</h1>
          <p className="mt-1 text-sm text-vita-600">
            Yeni bir aile oluştur ya da elindeki davet koduyla mevcut bir aileye katıl.
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-medium text-vita-900">Yeni aile oluştur</h2>
          <form action={createFamily} className="mt-3 flex gap-2">
            <input
              name="name"
              type="text"
              placeholder="Örn. Yılmaz Ailesi"
              required
              className="w-full rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-vita-600 px-4 py-2 font-medium text-white hover:bg-vita-700"
            >
              Oluştur
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-medium text-vita-900">Davet koduyla katıl</h2>
          <form action={joinFamily} className="mt-3 flex gap-2">
            <input
              name="code"
              type="text"
              placeholder="Örn. A1B2C3"
              required
              className="w-full rounded-lg border border-vita-200 px-3 py-2 uppercase outline-none focus:border-vita-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-vita-100 px-4 py-2 font-medium text-vita-800 hover:bg-vita-200"
            >
              Katıl
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
