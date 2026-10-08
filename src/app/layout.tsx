import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { MotionProvider } from "@/components/motion/provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
// Archivo com eixo de largura: a versão larga é a alternativa livre mais próxima da Downey do logotipo.
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "DONO. Seus ativos. Seu controle.",
    template: "%s | DONO",
  },
  description:
    "A plataforma dos investidores do Grupo CRP: acompanhe carregadores elétricos, postos, máquinas Capaxero e usinas solares, com rendimento e relatórios em um só lugar.",
  openGraph: {
    title: "DONO. Seus ativos. Seu controle.",
    description: "Acompanhe os ativos reais que são seus.",
    images: ["/assets/crp-charge.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#11131b",
};

// Decide, antes da primeira pintura, se a intro de marca toca: só na home, uma vez
// por sessão e sem preferência de movimento reduzido. O atributo no <html> é o que
// o CSS usa para exibir a intro e segurar a entrada do hero. Sem isso, nada pisca.
const INTRO_GATE = `(function(){try{var d=document.documentElement;if(location.pathname!=="/")return;if(sessionStorage.getItem("dono:intro"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.setAttribute("data-intro","play")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${geist.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
