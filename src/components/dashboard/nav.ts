import { FileText, LayoutDashboard, Scale, Zap } from "lucide-react";

// `short` é o rótulo da barra de abas do celular, onde cada item tem ~70px de largura.
export const NAV = [
  { href: "/dashboard", label: "Visão geral", short: "Início", Icon: LayoutDashboard },
  { href: "/ativos", label: "Meus ativos", short: "Ativos", Icon: Zap },
  { href: "/comparador", label: "Comparador", short: "Comparar", Icon: Scale },
  { href: "/relatorios", label: "Relatórios", short: "Relatórios", Icon: FileText },
];

export const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
