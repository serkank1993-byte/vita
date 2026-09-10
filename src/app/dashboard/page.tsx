import { getCurrentFamily } from "@/lib/family";

export default async function DashboardHome() {
  const family = await getCurrentFamily();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-vita-900">
        Merhaba, {family?.name} 👋
      </h1>
      <p className="mt-2 text-vita-600">
        Bu, ailenin dijital yaşam arşivinin merkezi. Sol menüden bir modül seç ve
        eklemeye başla. Yeni modüller zaman içinde burada listelenecek.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-vita-200 bg-white p-6">
        <p className="text-sm text-vita-600">
          Aileni davet etmek için sol menüdeki{" "}
          <span className="font-mono font-medium text-vita-800">davet kodunu</span>{" "}
          paylaş. Kodla katılan herkes sadece bu ailenin verilerini görebilir.
        </p>
      </div>
    </div>
  );
}
