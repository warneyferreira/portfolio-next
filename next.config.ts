import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // só em dev: deixa quem está na mesma rede abrir o site pelo IP da máquina
  allowedDevOrigins: ["192.168.1.236"],
  images: {
    qualities: [75, 95],
  },
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Três layouts raiz (/, /gravura, /luxuria): o 404 vem de app/global-not-found.tsx.
    globalNotFound: true,
  },
};

export default nextConfig;
