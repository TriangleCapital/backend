interface SolviaRealty {
  id: string;
  idVivienda: string;
  idPromocion: string;
  tipoTransaccion: string;
  datosBasicos: SRDatosBasicos;
  caracteristicasDinamicas: SRCaracteristicaDinamica[];
  documentos: any[];
  imagenesObraEnCurso: any | null;
  planosInmueble: any[];
  videosPromocion: any[];
  tiposDisponibles: SRTipoDisponible[];
  acabados: any[];
  textoDescripcion: string;
  estadoObraEnCurso: number;
  html: string | null;
  url360: string | null;
  fechaPrevistaFinalizacion: string | null;
  fechaPrevistaEntrega: string | null;
  urlPdfFicha: string;
  segmento: string;
  idSegmento: number;
  tituloFicha: string;
  enSituacionEspecial: string;
  alquiler_enRentabilidad: string;
  tipoSituacionEspecial: string;
  internacional: string | null;
  diaDisponible: boolean;
  diaPdf: boolean;
  tipoInmueble: string;
  store: SRStore;
  usosComp: any | null;
  reformas: any[];
  reservado: string;
  reformar: string;
  avalBancario: boolean;
  fianza: boolean;
  honorariosAgencia: number | null;
  gastosSuministro: any | null;
  lote: SRLote;
  esOrigenProducto: string;
}

interface SRDatosBasicos {
  id: string;
  idVivienda: string;
  idPromocion: string;
  tipoTransaccion: string;
  area: SRArea;
  campanya: SRCampanya;
  caracteristicas: SRCaracteristicas;
  categoriaTipoVivienda: SRCategoria;
  cp: string;
  cuotaAlquiler: number;
  destacado: string;
  direccion: string;
  fechaaccion: string | null;
  geo: SRGeo;
  imagenBuscador: string;
  m2: number;
  mostrarPrecio: string;
  mostrarPrecioAlquiler: string;
  nComponentesModelo: number;
  nModelosPromocion: number;
  poblacion: SRCategoria;
  precio: number;
  superdescuento: boolean;
  primerPrecioPublicacion: number;
  idOrigenProducto: number;
  precioAntes: number;
  precioAOC: number | null;
  promocion: SRCategoria;
  provincia: SRCategoria;
  ableCriteo: boolean;
  referenciaComercial: string;
  subasta: any | null;
  tipoVivienda: SRCategoria;
  totalBanyos: number;
  totalDormitorios: number;
  usoWeb: number;
  listaImagenesInmueble: SRImagen[];
  listaImagenesInmueble_vPC: SRImagen[];
  listaImagenesInmueble_vMOV: SRImagen[];
  listaImagenesInmueble_vOTROS: SRImagen[];
  listaImagenesInmueble_vORIGINAL: SRImagen[];
  imagenesInmueble: any | null;
  enPeriodoTransparencia: boolean;
  enPeriodoTransparenciaAlquiler: boolean;
  estadoObra: number;
  idFavorito: number;
  urlVirtual: string | null;
  imagenesRedimensionadas: any | null;
  etiquetaProducto: SREtiquetaProducto;
  certificacionEnergetica: string;
  urlCertificacionEnergetica: string;
  fichaEmpresa: string;
  fichaFechaActualizacionProducto: string;
  fichaFechaPrimeraPub: string;
  fichaFechaPubComponente: string;
  fichaFechaUltActualizacionPrecio: string;
  fichaIdEmpresa: string | null;
  fichaMacro: string;
  fichaOrigenProducto: string;
  fichaTerritorial: string;
  fichaRangoPrecio: string;
  tituloFicha: string;
  enSituacionEspecial: string;
  publicarOportunidades: string;
  publicarAlquiler: string;
  telefonoActivoObraNueva: string | null;
  direccionOfuscada: string;
  placesActivo: any | null;
  backgroundContainer: any | null;
  data_TipoVivienda: any | null;
  data_CategoriaTipoVivienda: any | null;
  internacional: any | null;
  codigoEnigma: string;
  idAgencia: string | null;
  nombreAgencia: string | null;
  urlVideo: string | null;
  urlTour: string | null;
  enSubasta: boolean;
  fechaFinSubasta: string | null;
  precioAlquilerNegociable: boolean;
  precioVentaNegociable: boolean;
  descColectivoPrecioAlquiler: any | null;
  descColectivoPrecioVenta: any | null;
  sinPosesion: boolean;
  fechaFinTransparencia: string | null;
  fechaFinTransparenciaAlquiler: string | null;
  ce_ConsumoEnergia: string;
  ce_ConsumoEnergiaValor: string | null;
  ce_Emisiones: string;
  ce_EmisionesValor: string | null;
}

interface SRArea {
  id: string | null;
  name: string | null;
  amigable: string | null;
}

interface SRCampanya {
  id: number;
  name: string | null;
  iconoListado: string | null;
  iconoFicha: string | null;
  disclaimer: string | null;
  bases: string | null;
  venta: boolean;
  alquiler: boolean;
  textoLeyendaPrecio: string | null;
  basesOportunidades: string | null;
  idNuxeoBasesOportunidades: string | null;
}

interface SRCaracteristicas {
  piscina: boolean;
  padel: boolean;
  garaje: boolean;
  trastero: boolean;
  urbanizacion: boolean;
  playa: boolean;
  golf: boolean;
  usoPrincipal: string | null;
  usoSecundario: string | null;
  supConstruida: number | null;
  supEdificabilidad: number | null;
  m2Parcela: number | null;
  estadoObra: string | null;
  reformar: boolean;
  reservado: boolean;
  climatizacion: string;
  amueblado: boolean;
  alturaLibre: number;
  supOtrosUsosm2: number | null;
  puestos: number | null;
  supOficinasm2: number | null;
  carpinteria: string | null;
  supEdificableResidencial: number | null;
  supEdificableOtros: number | null;
  udsEdificables: number | null;
  ambito: string | null;
  cuotaAmbito: number | null;
  licenciaObras: boolean;
  disponibilidadLocal: boolean;
  metrosLinFachada: number | null;
  porcOcupacion: number | null;
  percObraEjecutada: number | null;
  altura: number;
  importeGastosComunidad: number | null;
  importeIbi: number | null;
  nPlantas: number;
  numeroFinca: string | null;
  rentabilidad: number | null;
  observacionesGenerales: string | null;
  nViviendas: number;
  clasificacionUrb: string | null;
  edificabilidad: number | null;
  regimenProteccionVPO: string | null;
  refCatastral: string;
  maxUdsViviendas: number | null;
  ambitoSector: string | null;
  cuotaParticipaticonAmbito: string | null;
  viviendasEdificables: number;
  importeAvalBancario: number;
  importeFianza: number;
  importeHonorariosAgencia: number;
  estado: string;
  superficieCatastral: number | null;
  superficieRegistral: number | null;
  superficieComprobada: number | null;
  vpo: boolean;
}

interface SRCategoria {
  id: string;
  name: string;
  amigable: string;
}

interface SRGeo {
  latitud: number;
  longitud: number;
  direccionGoogle: string;
}

interface SRImagen {
  idModeloVivienda: number;
  idImagen: number;
  url: string;
  categoriaImagen: number;
  orden: number;
  categoria: string;
  ordenCategoria: number | null;
}

interface SREtiquetaProducto {
  textoEtiqueta: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  fontWeight: string | null;
}

interface SRCaracteristicaDinamica {
  categoriaId: number;
  categoria: string;
  orden: number;
  atributo: {
    atributo: string;
    valor: string;
  };
  idAtributo: number;
}

interface SRTipoDisponible {
  idVivienda: number;
  referenciaComercial: string;
  idTipoVivienda: number;
  tipoVivienda: string;
  totalDormitorios: number;
  totalBanyos: number;
  minPrecio: number;
  cuotaAlquiler: number;
  indicadorPrecio: boolean;
  indicadorPrecioAlquiler: boolean;
  planos: any[];
  disponibles: SRDisponible[];
  codigoEnigma: string;
  idAgencia: string | null;
  nombreAgencia: string | null;
  urlPdfPlano: string | null;
  recuentoDisponibles: number;
}

interface SRDisponible {
  num: number | null;
  alt: number | null;
  m2: number;
  totalDormitorios: number;
  banyos: number;
  tieneGaraje: boolean;
  tieneTrastero: boolean;
  descuento: number;
  minPrecio: number;
  estado: string | null;
  idVivienda: number;
  idPromocion: number;
  idComponente: number;
  codigoEnigma: string;
  idAgencia: string | null;
  nombreAgencia: string | null;
  indicadorPrecio: boolean;
  indicadorPrecioAlquiler: boolean;
  disclaimers: any[];
  reservado: boolean;
  lotes: any | null;
  cuotaAlquiler: number;
}

interface SRStore {
  id: number;
  store: string | null;
  direccion: string | null;
  urlImagen: string | null;
}

interface SRLote {
  idLote: number;
  descripcion: string;
  precioTotal: number;
  superficieTotal: number | null;
  precioUnitario: number | null;
  precioAnterior: number;
  diferenciaPrecio: number;
  variacionPrecio: number;
  precioAlquiler: number;
  primerPrecioPublicacion: number;
  superdescuento: boolean;
  cuotaParticipacionAmbito: number;
  edificabilidad: number;
  viviendasEdificables: number;
  nMaxVivienda: number;
}
