import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-vita-900">Vita&apos;yı oluştur</h1>
        <p className="mt-1 text-sm text-vita-600">Ailen için hesabını oluştur</p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form action={signup} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-vita-800" htmlFor="fullName">
              Ad Soyad
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vita-800" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vita-800" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-vita-200 px-3 py-2 outline-none focus:border-vita-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-vita-600 py-2 font-medium text-white transition hover:bg-vita-700"
          >
            Kayıt ol
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-vita-600">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="font-medium text-vita-700 underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </main>
  );
}
