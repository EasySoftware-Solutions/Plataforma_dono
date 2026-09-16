import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "DONO — Seus ativos. Seu controle.",
    template: "%s · DONO",
  },
  description:
    "A plataforma dos investidores do Grupo CRP: acompanhe carregadores elétricos, postos, máquinas Capaxero e usinas solares, com relatórios e pagamentos em um só lugar.",
  openGraph: {
    title: "DONO — Seus ativos. Seu controle.",
    description: "Acompanhe os ativos reais que são seus.",
    images: ["/assets/crp-charge.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060b1f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
