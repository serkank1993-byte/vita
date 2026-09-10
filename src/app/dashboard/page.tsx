import { getCurrentFamily } from "@/lib/family";
import { PageHeader } from "@/components/PageHeader";

export default async function DashboardHome() {
  const family = await getCurrentFamily();

  return (
    <div>
      <PageHeader
        title={`Merhaba, ${family?.name} 👋`}
        description="Bu, ailenin dijital yaşam arşivinin merkezi. Sol menüden bir modül seç ve eklemeye başla. Yeni modüller zaman içinde burada listelenecek."
      />

      <div className="rounded-2xl border border-dashed border-vita-200 bg-white p-6">
        <p className="text-sm text-vita-600">
          Aileni davet etmek için menüdeki{" "}
          <span className="font-mono font-medium text-vita-800">davet kodunu</span>{" "}
          paylaş. Kodla katılan herkes sadece bu ailenin verilerini görebilir.
        </p>
      </div>
    </div>
  );
}
