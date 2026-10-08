// Aritmética de competências no formato "AAAA-MM". Sem dependências de dados,
// pode ser importado tanto por Server quanto por Client Components.

export const addMonths = (mes: string, n: number) => {
  const [y, m] = mes.split("-").map(Number);
  const t = y * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
};

export const monthsBetween = (a: string, b: string) => {
  const [ya, ma] = a.split("-").map(Number);
  const [yb, mb] = b.split("-").map(Number);
  return yb * 12 + mb - (ya * 12 + ma);
};

/** Os `n` meses que terminam em `fim` (inclusive), em ordem cronológica. */
export const mesesAte = (fim: string, n: number) => Array.from({ length: n }, (_, i) => addMonths(fim, i - n + 1));
