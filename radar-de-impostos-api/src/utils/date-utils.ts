/**
 * Converte uma string de data no formato DD/MM/YYYY para um objeto Date.
 * @param dateStr String de data no formato DD/MM/YYYY
 * @returns Objeto Date correspondente
 */
export const parseDateBR = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};