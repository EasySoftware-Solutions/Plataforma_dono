import { FileText, LayoutDashboard, Scale, Wallet, Zap } from "lucide-react";

export const NAV = [
  { href: "/dashboard", label: "Visão geral", Icon: LayoutDashboard },
  { href: "/ativos", label: "Meus ativos", Icon: Zap },
  { href: "/comparador", label: "Comparador", Icon: Scale },
  { href: "/relatorios", label: "Relatórios", Icon: FileText },
  { href: "/pagamentos", label: "Pagamentos", Icon: Wallet },
];
