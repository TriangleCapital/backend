import { TipoOkupa } from '../../database/interfaces/enums';
import { getTipoOkupaFromSolviaRealty } from './bankParsers';

export function filterOkupaRealtiesFromBank(bankRealties: any[]) {
  const id = bankRealties[0]?.id;

  const checkIsSolvia = () => id.endsWith('-O');
  // Add new banks checks here

  if (checkIsSolvia()) {
    return filterOkupaSolviaRealties(bankRealties);
  } else {
    throw new Error('No se han podido filtrar los activos ya que se desconoce el banco');
  }
}

export function filterOkupaSolviaRealties(solviaRealties: SolviaRealty[]): SolviaRealty[] {
  try {
    return solviaRealties.filter((realty) => getTipoOkupaFromSolviaRealty(realty) !== TipoOkupa.Vacio);
  } catch (error) {
    throw new Error(`No se han podido filtrar los activos OKUPADOS de Solvia. ${error.message}`);
  }
}


