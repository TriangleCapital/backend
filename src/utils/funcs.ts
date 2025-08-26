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

export function getManychatFlowByFlowNumber(flowNumber: number): string {
  switch (flowNumber) {
    case 0:
      return MANYCHAT_FLOW_NS_0;
    case 1:
      return MANYCHAT_FLOW_NS_1;
    default:
      return MANYCHAT_FLOW_NS_0;
  }
}
