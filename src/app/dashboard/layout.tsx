import { redirect } from "next/navigation";
import { getCurrentFamily } from "@/lib/family";
import { Sidebar } from "./Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth zaten middleware'de doğrulanıp yönlendiriliyor; burada tekrar
  // supabase.auth.getUser() çağırmak sayfa geçişi başına gereksiz bir
  // Supabase Auth API round-trip'i eklerdi.
  const family = await getCurrentFamily();

  if (!family) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar familyName={family.name} inviteCode={family.invite_code} />
      <main className="flex-1 px-4 py-6 md:px-10 md:py-8">{children}</main>
    </div>
  );
}
