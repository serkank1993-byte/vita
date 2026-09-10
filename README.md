# Vita

All in Life — ailenin dijital yaşam arşivi.

Vita; ev yönetimi, evcil hayvan takibi, alışveriş listesi, yapılacaklar, takvim,
gelir/gider takibi, sağlık takibi, envanter takibi ve dijital arşiv gibi
modülleri tek bir çatı altında toplamayı hedefleyen, aile bazlı bir yaşam
yönetim uygulamasıdır. Her aile kendi verisini görür; RLS (Row Level Security)
ile aileler arası izolasyon veritabanı seviyesinde sağlanır.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4)
- **Supabase** (Postgres, Auth, RLS)
- **Netlify** (hosting — proje adı: `omnivita`)

## Mimari

- `families` — her aile bir kiracı (tenant)
- `family_members` — kullanıcı-aile ilişkisi (bir kullanıcı birden fazla aileye üye olabilir)
- `profiles` — auth kullanıcıları için ek bilgiler (kayıt olunca otomatik oluşur)
- Modül tabloları (örn. `todos`) `family_id` ile aileye bağlanır ve RLS policy'leri
  `is_family_member(family_id)` fonksiyonu üzerinden erişimi sınırlar.

Yeni bir aile, `create_family(name)` RPC'si ile oluşturulur (aynı anda `owner`
üyeliği de eklenir). Mevcut bir aileye katılmak için `join_family(code)` RPC'si
ve ailenin davet kodu kullanılır.

## Şu an çalışan modüller

- ✅ Kayıt / giriş (Supabase Auth)
- ✅ Aile oluşturma / davet koduyla katılma
- ✅ Yapılacaklar — detay, son tarih, sorumlu atama
- ✅ Alışveriş Listesi — ürün/miktar/kategori, alındı işaretleme
- ✅ Evcil Hayvanlar — tür, cins, doğum tarihi, veteriner hatırlatması
- ✅ Takvim — yaklaşan/geçmiş etkinlikler
- ✅ Gelir / Gider — gelir-gider kayıtları ve bakiye özeti
- ✅ Sağlık Takibi — kişi bazlı kontrol/aşı kayıtları ve hatırlatma
- ✅ Envanter — eşya, değer, garanti takibi
- ✅ Dijital Arşiv — Supabase Storage üzerinde aile başına izole dosya arşivi
- ✅ PWA — ana ekrana eklenebilir, manifest + service worker hazır

## Geliştirme

```bash
npm install
cp .env.example .env.local   # Supabase URL + anon key'i doldur
npm run dev
```

Veritabanı şeması `supabase/migrations/` altında tutulur ve Supabase MCP /
CLI ile projeye uygulanır.

## Deploy

Netlify projesi (`omnivita`) bu repo ile bağlanınca `netlify.toml` içindeki
`@netlify/plugin-nextjs` build'i otomatik yapılandırır. Netlify ortam
değişkenlerine `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY`
eklenmesi gerekir.
