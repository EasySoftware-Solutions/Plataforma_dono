"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// recharts só mede o contêiner no navegador (no servidor renderiza vazio), então
// carregá-lo sem SSR e sob demanda não perde nada e tira ~100 KB do bundle inicial.
// O wrapper de cada gráfico reserva a altura, e o skeleton ocupa o mesmo espaço: sem layout shift.
const loading = () => <Skeleton className="size-full rounded-xl" />;

export const IncomeBarsChart = dynamic(() => import("./recharts-views").then((m) => m.IncomeBarsChart), { ssr: false, loading });
export const IndexLinesChart = dynamic(() => import("./recharts-views").then((m) => m.IndexLinesChart), { ssr: false, loading });
export const AssetBarsChart = dynamic(() => import("./recharts-views").then((m) => m.AssetBarsChart), { ssr: false, loading });
