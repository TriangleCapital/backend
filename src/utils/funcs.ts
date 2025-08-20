import { FundDiscounts, TBank } from '../database/interfaces/enums';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculatePrecioVenta(precioInicial: number, fund: TBank): number {
  const discountPercentage = FundDiscounts[fund] ?? 0;
  const discountAmount = precioInicial * (discountPercentage / 100);
  return Math.floor(precioInicial - discountAmount);
}
