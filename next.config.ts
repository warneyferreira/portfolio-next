import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // só em dev: deixa quem está na mesma rede abrir o site pelo IP da máquina
  allowedDevOrigins: ["192.168.1.236"],
  images: {
    qualities: [75, 95],
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
