/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Dijital Arşiv modülü dosya yüklemede Server Action kullanıyor;
      // varsayılan 1MB limiti fotoğraf/PDF için yetersiz.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
