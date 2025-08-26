import { FundDiscounts, TBank } from '../database/interfaces/enums';
import { MANYCHAT_FLOW_NS_0, MANYCHAT_FLOW_NS_1 } from './constants';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculatePrecioVenta(precioInicial: number, fund: TBank): number {
  const discountPercentage = FundDiscounts[fund] ?? 0;
  const discountAmount = precioInicial * (discountPercentage / 100);
  return Math.floor(precioInicial - discountAmount);
}
