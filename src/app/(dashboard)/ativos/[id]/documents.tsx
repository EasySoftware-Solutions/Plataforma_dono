"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import type { Asset } from "@/types";
import { TIPOS } from "@/lib/constants";
import { brl, data } from "@/lib/format";
import { exportPdf } from "@/lib/exports";

export function Documents({ asset }: { asset: Asset }) {
  const [busy, setBusy] = useState<string | null>(null);

  async function baixar(doc: Asset["documentos"][number]) {
    setBusy(doc.id);
    try {
      await exportPdf({
        titulo: doc.titulo,
        subtitulo: `${asset.nome} · ${TIPOS[asset.tipo].nome} · ${asset.cidade}/${asset.uf}`,
        arquivo: `${asset.id}-${doc.tipo}`,
        colunas: [{ header: "Campo" }, { header: "Informação" }],
        linhas: [
          ["Ativo", asset.nome],
          ["Tipo", `${TIPOS[asset.tipo].nome} (${TIPOS[asset.tipo].categoria})`],
          ["Localização", `${asset.cidade}/${asset.uf}`],
          ["Data de aquisição", data(asset.dataAquisicao)],
          ["Valor investido", brl(asset.valorInvestido)],
          ...asset.especificacoes.map((e) => [e.rotulo, e.valor]),
          ["Documento", `${doc.tipo}: modelo de demonstração, sem valor jurídico`],
        ],
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <ul className="divide-y divide-white/[0.06]">
      {asset.documentos.map((d) => (
        <li key={d.id} className="flex items-center gap-3 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
            <FileText aria-hidden className="size-[18px] text-ink-muted" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">{d.titulo}</span>
            <span className="block text-sm text-ink-subtle">PDF · {data(d.data)}</span>
          </span>
          <button
            type="button"
            onClick={() => baixar(d)}
            disabled={busy === d.id}
            aria-label={`Baixar ${d.titulo}`}
            className="flex size-10 items-center justify-center rounded-full text-ink-muted hover:bg-white/[0.08] hover:text-ink disabled:opacity-60"
          >
            {busy === d.id ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Download aria-hidden className="size-4" />}
          </button>
        </li>
      ))}
    </ul>
  );
}
