/**
 * Converte uma string de data no formato DD/MM/YYYY para um objeto Date.
 * @param dateStr String de data no formato DD/MM/YYYY
 * @returns Objeto Date correspondente
 */
export const parseDateBR = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("/").map(Number);
  // O mês no construtor Date do JS é baseado em zero (0 = Janeiro, 11 = Dezembro)
  return new Date(year, month - 1, day);
};
