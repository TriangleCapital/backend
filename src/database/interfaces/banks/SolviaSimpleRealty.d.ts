interface SolviaSimpleRealty {
  id: string;
  score: number;
  novedad: boolean;
  porDescuento: number;
  reformar: boolean;
  destacado: boolean;
  reservado: boolean;
  situacionEspecial: boolean;
  banyos: number;
  dormitorios: number;
  totalM2: number;
  idSegmento: number;
  idVivienda: number;
  tipoTransaccion: string;
  campanya: string | null;
  categoriaTipoVivienda: {
    id: number;
    nombre: string;
  };
  tipoVivienda: {
    id: number;
    nombre: string;
  };
  provincia: {
    id: string;
    nombre: string;
  };
  poblacion: {
    id: number;
    nombre: string;
  };
  direccion: string;
  m2: number;
  mostrarPrecio: boolean;
  mostrarPrecioAlquiler: boolean;
  publicarOportunidades: boolean;
  publicarAlquiler: boolean;
  cuotaAlquiler: number;
  precio: number;
  primerPrecioPublicacion: number;
  superdescuento: boolean;
  idOrigenProducto: number;
  precioAntes: number;
  precioAOC: number;
  promocion: {
    id: number;
    titulo: string;
  };
  referenciaComercial: string | null;
  totalBanyos: number;
  totalDormitorios: number;
  usoWeb: number;
  listaImagenesInmueble_vPC: string[];
  listaImagenesInmueble_vORIGINAL: string[];
  tituloFicha: string;
  barrio: string | null;
  enCosta: boolean;
  porcAvanceObra: number;
  multiplesComponentes: boolean;
  esOrigenProducto: string;
  enSubasta: boolean;
  fechaFinSubasta: string | null;
  precioAlquilerNegociable: boolean;
  precioVentaNegociable: boolean;
  sinPosesion: boolean;
  enPeriodoTransparencia: boolean;
  fechaFinTransparencia: string | null;
  enPeriodoTransparenciaAlquiler: boolean;
  fechaFinTransparenciaAlquiler: string | null;
  alquiler_enRentabilidad: boolean;
}
