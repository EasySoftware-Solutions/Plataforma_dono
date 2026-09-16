"use client";

import { HOJE } from "./constants";
import { dataLonga } from "./format";

export type Col = { header: string; align?: "left" | "right"; width?: number };
export type Cell = string | number;

export interface TableDoc {
  titulo: string;
  subtitulo?: string;
  arquivo: string;
  colunas: Col[];
  linhas: Cell[][];
  resumo?: { rotulo: string; valor: string }[];
  totais?: Cell[];
}

const AVISO = "Ambiente de demonstração: rendimentos e posições são fictícios. Rentabilidade passada não garante rentabilidade futura.";

const NAVY_DEEP: [number, number, number] = [13, 16, 55];
const NAVY_INK: [number, number, number] = [16, 22, 49];
const LIGHT_BG: [number, number, number] = [242, 245, 251];
const BLUE: [number, number, number] = [50, 104, 222];
const BLUE_BRIGHT: [number, number, number] = [48, 156, 252];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export interface MonthlyReportData {
  arquivo: string;
  mesLabel: string;
  investidor: string;
  rendimentoMes: number;
  patrimonioInvestido: number;
  ativosComRendimento: number;
  totalAtivos: number;
  ativos: { nome: string; tipo: string; cor: string; rendimento: number }[];
  historicoRendimento: { label: string; valor: number }[];
  historicoPatrimonio: { label: string; valor: number }[];
}

function slug(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportPdf(doc: TableDoc) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: doc.colunas.length > 5 ? "landscape" : "portrait" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 40;

  pdf.setFillColor(13, 16, 55);
  pdf.rect(0, 0, W, 76, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("DONO", M, 46);
  pdf.setFillColor(50, 104, 222);
  pdf.rect(M + pdf.getTextWidth("DONO") + 3, 40, 5, 5, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(184, 184, 184);
  pdf.text(`Emitido em ${dataLonga(HOJE)}`, W - M, 46, { align: "right" });

  pdf.setTextColor(16, 22, 49);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(doc.titulo, M, 116);
  let y = 116;
  if (doc.subtitulo) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(89, 89, 89);
    pdf.text(doc.subtitulo, M, (y += 18));
  }

  if (doc.resumo?.length) {
    y += 22;
    const colW = (W - M * 2) / doc.resumo.length;
    doc.resumo.forEach((r, i) => {
      const x = M + i * colW;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(89, 89, 89);
      pdf.text(r.rotulo, x, y);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(16, 22, 49);
      pdf.text(r.valor, x, y + 18);
    });
    y += 18;
  }

  autoTable(pdf, {
    startY: y + 22,
    margin: { left: M, right: M, bottom: 56 },
    head: [doc.colunas.map((c) => c.header)],
    body: doc.linhas.map((l) => l.map(String)),
    foot: doc.totais ? [doc.totais.map(String)] : undefined,
    theme: "plain",
    styles: { font: "helvetica", fontSize: 9, cellPadding: { top: 6, bottom: 6, left: 6, right: 6 }, textColor: [16, 22, 49] },
    headStyles: { fillColor: [16, 22, 49], textColor: [255, 255, 255], fontStyle: "bold" },
    footStyles: { fillColor: [240, 240, 240], textColor: [16, 22, 49], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [247, 247, 247] },
    columnStyles: Object.fromEntries(doc.colunas.map((c, i) => [i, { halign: c.align ?? "left" }])),
    didParseCell: (d) => {
      if (d.section !== "body") d.cell.styles.halign = doc.colunas[d.column.index]?.align ?? "left";
    },
    didDrawPage: () => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(AVISO, M, H - 28);
      pdf.text(`Página ${pdf.getNumberOfPages()}`, W - M, H - 28, { align: "right" });
    },
  });

  save(pdf.output("blob"), `${slug(doc.arquivo)}.pdf`);
}

// Desenha um conjunto de barras verticais com o valor impresso acima de cada uma
// e o rótulo do período abaixo, no estilo do relatório infográfico de referência.
function desenharBarras(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdf: any,
  x: number,
  y: number,
  w: number,
  h: number,
  dados: { label: string; valor: number }[],
  cor: [number, number, number],
  formatador: (v: number) => string,
) {
  const max = Math.max(...dados.map((d) => d.valor), 1) * 1.2;
  const gap = 8;
  const barW = (w - gap * (dados.length - 1)) / dados.length;
  const baseline = y + h;

  pdf.setDrawColor(225, 225, 232);
  pdf.setLineWidth(0.75);
  pdf.line(x, baseline, x + w, baseline);

  dados.forEach((d, i) => {
    const barH = Math.max((d.valor / max) * (h - 20), d.valor > 0 ? 3 : 0);
    const bx = x + i * (barW + gap);
    const by = baseline - barH;
    if (barH > 0) {
      pdf.setFillColor(...cor);
      pdf.roundedRect(bx, by, barW, barH, 2, 2, "F");
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...NAVY_INK);
    pdf.text(formatador(d.valor), bx + barW / 2, by - 5, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(120, 120, 128);
    pdf.text(d.label, bx + barW / 2, baseline + 13, { align: "center" });
  });
}

export async function exportRelatorioMensal(doc: MonthlyReportData) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 40;

  // Cabeçalho
  pdf.setFillColor(...NAVY_DEEP);
  pdf.rect(0, 0, W, 118, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(255, 255, 255);
  pdf.text("DONO", M, 34);
  pdf.setFillColor(...BLUE);
  pdf.rect(M + pdf.getTextWidth("DONO") + 3, 28, 4, 4, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text("RELATÓRIO MENSAL", W / 2, 62, { align: "center" });
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(160, 168, 202);
  pdf.text(doc.mesLabel.toUpperCase(), W / 2, 82, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(200, 205, 224);
  pdf.text(`Investidor: ${doc.investidor}`, W / 2, 102, { align: "center" });

  // Resumo do mês
  let y = 118;
  const bandoResumoH = 168;
  pdf.setFillColor(...LIGHT_BG);
  pdf.rect(0, y, W, bandoResumoH, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(...NAVY_INK);
  pdf.text("Resumo do mês", M, y + 30);

  const cardY = y + 46;
  const cardH = 84;
  const cardW = (W - M * 2 - 14) / 2;
  const stat = (cx: number, rotulo: string, valor: string, sub: string) => {
    pdf.setFillColor(...NAVY_DEEP);
    pdf.roundedRect(cx, cardY, cardW, cardH, 8, 8, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(180, 187, 216);
    pdf.text(rotulo, cx + 16, cardY + 24);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255);
    pdf.text(valor, cx + 16, cardY + 50);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(150, 158, 196);
    pdf.text(sub, cx + 16, cardY + 68);
  };
  stat(M, "Rendimento do mês", brlFmtSimples(doc.rendimentoMes), `${doc.ativosComRendimento} de ${doc.totalAtivos} ativos renderam`);
  stat(M + cardW + 14, "Patrimônio investido", brlFmtSimples(doc.patrimonioInvestido), "Posição em ativos reais");

  // Por ativo (faixa escura)
  y += bandoResumoH;
  const HEADER_ROW = 30;
  const ROW_H = 28;
  const FOOTER_ROW = 44;
  const n = doc.ativos.length;
  const listaH = HEADER_ROW + n * ROW_H + FOOTER_ROW;
  const bandoAtivosH = 50 + listaH + 20;
  pdf.setFillColor(...NAVY_DEEP);
  pdf.rect(0, y, W, bandoAtivosH, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Rendimento por ativo", M, y + 34);

  const listaY = y + 50;
  const listaW = W - M * 2;
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(M, listaY, listaW, listaH, 8, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(120, 120, 128);
  pdf.text("ATIVO", M + 20, listaY + 20);
  pdf.text("RENDIMENTO", M + listaW - 20, listaY + 20, { align: "right" });
  pdf.setDrawColor(230, 230, 236);
  pdf.setLineWidth(0.75);
  pdf.line(M + 16, listaY + HEADER_ROW, M + listaW - 16, listaY + HEADER_ROW);

  doc.ativos.forEach((a, i) => {
    const rowTop = listaY + HEADER_ROW + i * ROW_H;
    pdf.setFillColor(...hexToRgb(a.cor));
    pdf.circle(M + 24, rowTop + 13, 3, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(...NAVY_INK);
    pdf.text(a.nome, M + 34, rowTop + 16);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 148);
    pdf.text(a.tipo, M + 34, rowTop + 25);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(...NAVY_INK);
    pdf.text(brlFmtSimples(a.rendimento), M + listaW - 20, rowTop + 16, { align: "right" });
    if (i < n - 1) {
      pdf.setDrawColor(240, 240, 244);
      pdf.line(M + 16, rowTop + ROW_H, M + listaW - 16, rowTop + ROW_H);
    }
  });

  const rowsBottom = listaY + HEADER_ROW + n * ROW_H;
  pdf.setDrawColor(...NAVY_INK);
  pdf.setLineWidth(1);
  pdf.line(M + 16, rowsBottom + 10, M + listaW - 16, rowsBottom + 10);
  const totalY = rowsBottom + 28;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...NAVY_INK);
  pdf.text("Total do mês", M + 20, totalY);
  pdf.setTextColor(...BLUE);
  pdf.text(brlFmtSimples(doc.rendimentoMes), M + listaW - 20, totalY, { align: "right" });

  // Histórico
  y += bandoAtivosH;
  pdf.setFillColor(...LIGHT_BG);
  pdf.rect(0, y, W, H - y, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(...NAVY_INK);
  pdf.text("Histórico de rendimento", M, y + 34);
  pdf.text("Evolução do patrimônio", M + (W - M * 2) / 2 + 14, y + 34);

  const chartY = y + 50;
  const chartH = 130;
  const chartW = (W - M * 2 - 28) / 2;
  const compacta = (v: number) => {
    if (v >= 1_000_000) return `R$${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}mi`;
    if (v >= 1000) return `R$${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}mil`;
    return brlFmtSimples(v);
  };
  desenharBarras(pdf, M, chartY, chartW, chartH, doc.historicoRendimento, BLUE, compacta);
  desenharBarras(pdf, M + chartW + 28, chartY, chartW, chartH, doc.historicoPatrimonio, BLUE_BRIGHT, compacta);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);
  pdf.text(AVISO, M, H - 24, { maxWidth: W - M * 2 });

  save(pdf.output("blob"), `${slug(doc.arquivo)}.pdf`);
}

function brlFmtSimples(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export async function exportXlsx(doc: TableDoc) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const header = doc.colunas.map((c) => ({ value: c.header, fontWeight: "bold" as const }));
  const rows = doc.linhas.map((l) => l.map((v) => ({ value: v })));
  const data = [[{ value: doc.titulo, fontWeight: "bold" as const }], doc.subtitulo ? [{ value: doc.subtitulo }] : [], [], header, ...rows];
  if (doc.totais) data.push(doc.totais.map((v) => ({ value: v, fontWeight: "bold" as const })));
  data.push([], [{ value: AVISO }]);
  await writeXlsxFile(data, { sheet: "DONO", columns: doc.colunas.map((c) => ({ width: c.width ?? 18 })) }).toFile(`${slug(doc.arquivo)}.xlsx`);
}

export function exportCsv(doc: TableDoc) {
  const esc = (v: Cell) => {
    const s = typeof v === "number" ? v.toLocaleString("pt-BR", { useGrouping: false, maximumFractionDigits: 2 }) : v;
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [doc.colunas.map((c) => esc(c.header)).join(";"), ...doc.linhas.map((l) => l.map(esc).join(";"))];
  if (doc.totais) lines.push(doc.totais.map(esc).join(";"));
  save(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }), `${slug(doc.arquivo)}.csv`);
}
