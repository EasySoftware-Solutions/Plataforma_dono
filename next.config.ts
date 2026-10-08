import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Esconde o indicador "N" do Next.js que aparece no canto da tela em desenvolvimento.
  devIndicators: false,
  experimental: {
    // Mantém as páginas do dashboard no cache do roteador por 30s: alternar entre
    // abas já visitadas é instantâneo, sem ida ao servidor. Login/logout alteram
    // cookies em Server Actions, o que invalida esse cache automaticamente.
    staleTimes: { dynamic: 30 },
  },
};

export default nextConfig;

// O emulador local OpenNext Cloudflare (workerd) pode apresentar falhas de acesso no Windows.
// Descomente caso utilize bindings do Cloudflare (D1/KV) em desenvolvimento local:
// if (process.env.NODE_ENV === "development") {
//   import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
// }
