import {
  Supplier,
  ResourceMaterial,
  ResourceLabor,
  ResourceEquipment,
  APUItem,
  BudgetItem,
  ProjectInfo,
  EconomicParameters
} from '../types/apu';

export const INITIAL_SUPPLIERS: Supplier[] = [
  // CEMENTERAS CRUCEÑAS
  {
    id: 'sup-soboce',
    name: 'SOBOCE S.A. (Cemento Warnes / Viacha)',
    nit: '1020491820',
    phone: '+591 3 344-9000 / 800-107626',
    city: 'Santa Cruz de la Sierra',
    address: 'Parque Industrial Manzana 14 / Planta Warnes',
    email: 'ventas.scz@soboce.com.bo',
    category: 'Cementera',
    notes: 'Cemento Portland IP-30 e IP-40 Warnes de alta resistencia inicial.'
  },
  {
    id: 'sup-fancesa',
    name: 'FANCESA Cemento (Distribuidora Santa Cruz)',
    nit: '1015682019',
    phone: '+591 3 346-2244 / 710-33441',
    city: 'Santa Cruz de la Sierra',
    address: 'Av. Banzer entre 4to y 5to Anillo',
    email: 'ventas.santacruz@fancesa.com',
    category: 'Cementera',
    notes: 'Cemento Superior IP-30 y Líder, despacho directo a obra desde almacenes centrales.'
  },
  {
    id: 'sup-itacamba',
    name: 'ITACAMBA / ITAMBA Cemento S.A.',
    nit: '1028374029',
    phone: '+591 3 314-8800 / 770-44112',
    city: 'Santa Cruz de la Sierra',
    address: 'Torre Dúo Piso 14 / Planta Yacuses',
    email: 'comercial@itacamba.com',
    category: 'Cementera',
    notes: 'Cemento Cemento IP-30 de alta trabajabilidad y fraguado optimizado para el clima cruceño (Planta Yacuses).'
  },

  // ACEROS Y METALES EN SANTA CRUZ
  {
    id: 'sup-laslomas',
    name: 'Aceros Las Lomas S.A. (Belgo Bekaert)',
    nit: '1004839029',
    phone: '+591 3 315-8000 / 710-98765',
    city: 'Santa Cruz de la Sierra',
    address: 'Parque Industrial PI-22 / Carr. al Norte',
    email: 'cotizaciones@laslomas.com.bo',
    category: 'Aceros y Metales',
    notes: 'Fierro corrugado norma ASTM A706 / CBH-87 Grado 500 soldable con certificación de calidad.'
  },
  {
    id: 'sup-monterrey',
    name: 'Monterrey S.R.L. (Aceros Estructurales)',
    nit: '1029384756',
    phone: '+591 3 342-6000 / 773-99120',
    city: 'Santa Cruz de la Sierra',
    address: 'Av. Cristo Redentor entre 4to y 5to Anillo N° 4500',
    email: 'ventas@monterrey.com.bo',
    category: 'Aceros y Metales',
    notes: 'Distribuidor mayorista de fierro corrugado B500, mallas electrosoldadas y perfiles costanera.'
  },
  {
    id: 'sup-arequipa',
    name: 'Aceros Arequipa Bolivia',
    nit: '1039485721',
    phone: '+591 3 348-1199 / 766-55440',
    city: 'Santa Cruz de la Sierra',
    address: 'Carretera al Norte Km 8.5 / Parque Industrial',
    email: 'bolivia@acerosarequipa.com',
    category: 'Aceros y Metales',
    notes: 'Acero corrugado ASTM A615 Grado 60 de alta ductilidad y resistencia sísmica.'
  },
  {
    id: 'sup-casadelfierro',
    name: 'Casa del Fierro Santa Cruz',
    nit: '1031948201',
    phone: '+591 3 345-2121 / 780-99881',
    city: 'Santa Cruz de la Sierra',
    address: 'Av. Virgen de Cotoca entre 2do y 3er Anillo',
    email: 'ventas@casadelfierro.com.bo',
    category: 'Aceros y Metales',
    notes: 'Distribuidor mayorista de fierro corrugado, alambre recocido de amarre N° 16, clavos y perfiles.'
  },

  // CERÁMICAS Y LADRILLERAS
  {
    id: 'sup-incerpaz',
    name: 'Cerámica INCERPAZ S.A. Santa Cruz',
    nit: '1018392019',
    phone: '+591 3 388-1122 / 800-104040',
    city: 'Santa Cruz de la Sierra',
    address: 'Doble Vía a La Guardia Km 6',
    email: 'atencion.scz@incerpaz.com',
    category: 'Cerámica y Ladrillos',
    notes: 'Ladrillos cerámicos 6 huecos 18x25x12 cm, tejas coloniales y cumbreras esmaltadas.'
  },
  {
    id: 'sup-ceranorte',
    name: 'Cerámica Norte S.R.L.',
    nit: '1023849102',
    phone: '+591 3 344-7766 / 780-11223',
    city: 'Santa Cruz de la Sierra',
    address: 'Carretera al Norte Km 9',
    email: 'ventas@ceramicanorte.com.bo',
    category: 'Cerámica y Ladrillos',
    notes: 'Ladrillos 6H estructurales de alta cocción, bovedillas para losa y pisos rústicos.'
  },
  {
    id: 'sup-ceraitaugua',
    name: 'Cerámica Itauguá Santa Cruz',
    nit: '1048291039',
    phone: '+591 3 355-6677 / 773-11200',
    city: 'Santa Cruz de la Sierra',
    address: 'Carretera a Cotoca Km 7',
    email: 'contacto@ceramicaitaugua.com.bo',
    category: 'Cerámica y Ladrillos',
    notes: 'Industria cerámica de ladrillo 6 huecos, teja colonial roja y ladrillo adobito visto.'
  },

  // FERRETERÍAS Y DISTRIBUIDORAS
  {
    id: 'sup-constructor',
    name: 'Ferretería El Constructor S.R.L.',
    nit: '1029384021',
    phone: '+591 3 344-5500 / 770-12345',
    city: 'Santa Cruz de la Sierra',
    address: 'Av. Cristo Redentor entre 4to y 5to Anillo',
    email: 'ventas@elconstructor.com.bo',
    category: 'Ferretería General & Agregados',
    notes: 'Entrega en obra programada. Viguetas pretensadas, calaminas y químicos de construcción.'
  },
  {
    id: 'sup-comercial-scz',
    name: 'Comercial Santa Cruz Materiales',
    nit: '1038472910',
    phone: '+591 3 352-8800 / 760-33211',
    city: 'Santa Cruz de la Sierra',
    address: 'Av. Santos Dumont 3er Anillo Interno',
    email: 'pedidos@comercialsantacruz.bo',
    category: 'Materiales Pesados y Cemento',
    notes: 'Distribuidor directo de cemento, áridos de río y mezclas de mortero.'
  },
  {
    id: 'sup-industrial-oriente',
    name: 'Ferretería Industrial del Oriente',
    nit: '1049283741',
    phone: '+591 3 346-7788 / 785-44221',
    city: 'Santa Cruz de la Sierra',
    address: 'Av. Banzer Km 6.5',
    email: 'ventas@industrialoriente.com.bo',
    category: 'Quincallería y Acabados',
    notes: 'Distribuidor oficial artefactos Deca, placas Tramontina Liz, porcelanatos y grifería.'
  },
  {
    id: 'sup-aridos-pirai',
    name: 'Áridos y Cantera Río Piraí',
    nit: '2938471023',
    phone: '+591 760-44990',
    city: 'Santa Cruz de la Sierra',
    address: 'Zona Urubó / Ribera Río Piraí',
    email: 'aridos.pirai@gmail.com',
    category: 'Áridos y Cantera',
    notes: 'Arena lavada de río Piraí seleccionada y ripio triturado 3/4" clasificado por m3.'
  },
  {
    id: 'sup-maderera-oriente',
    name: 'Maderera El Oriente & Carpintería',
    nit: '3829104812',
    phone: '+591 716-55443',
    city: 'Santa Cruz de la Sierra',
    address: 'Barrio El Bajío, Av. Santos Dumont 6to Anillo',
    email: 'maderas.eloriente@cotas.com.bo',
    category: 'Maderas de Construcción y Puertas',
    notes: 'Madera de ochoó para encofrados, tajibo macizo para puertas, vigas y tijerales.'
  },
  {
    id: 'sup-tigre',
    name: 'Plásticos Tigre / TuboCentro Santa Cruz',
    nit: '1009283746',
    phone: '+591 3 348-7700',
    city: 'Santa Cruz de la Sierra',
    address: 'Av. Banzer Km 8.5',
    email: 'contacto@tubocentro.com.bo',
    category: 'Plomería y Tuberías',
    notes: 'Tuberías PVC de desagüe serie métrica, agua fría termofusión y cámaras sifonadas.'
  }
];

export const INITIAL_MATERIALS: ResourceMaterial[] = [
  // CEMENTO CON MÚLTIPLES OPCIONES SOBOCE / FANCESA / ITACAMBA Y REFERENCIAL CADECOCRUZ
  {
    id: 'mat-cemento',
    name: 'Cemento IP-30 (Bolsa 50 kg)',
    unit: 'bolsa',
    category: 'Aglomerantes',
    defaultUnitPrice: 46.00, // Por defecto Itacamba (más competitivo)
    defaultSupplierId: 'sup-itacamba',
    specification: 'Cemento estándar para estructuras y albañilería en Santa Cruz',
    cadecocruzPrice: 47.00, // Precio de referencia CADECOCRUZ
    quotes: [
      { supplierId: 'sup-itacamba', supplierName: 'ITACAMBA / ITAMBA Cemento S.A.', price: 46.00, brandOrNote: 'Itacamba / Itamba Cemento IP-30' },
      { supplierId: 'sup-fancesa', supplierName: 'FANCESA Cemento', price: 47.50, brandOrNote: 'Fancesa Superior IP-30' },
      { supplierId: 'sup-soboce', supplierName: 'SOBOCE S.A.', price: 48.50, brandOrNote: 'Warnes / Viacha IP-30 Especial' }
    ]
  },
  // ACERO CON MÚLTIPLES OPCIONES LAS LOMAS / MONTERREY / ACEROS AREQUIPA / CASA DEL FIERRO Y CADECOCRUZ
  {
    id: 'mat-fierro',
    name: 'Fierro Corrugado 5000 kg/cm2 (Acero estructural)',
    unit: 'kg',
    category: 'Aceros',
    defaultUnitPrice: 8.10, // Por defecto Monterrey / Las Lomas
    defaultSupplierId: 'sup-monterrey',
    specification: 'Barras corrugadas CBH-87 Grado 500 soldables',
    cadecocruzPrice: 8.25,
    quotes: [
      { supplierId: 'sup-monterrey', supplierName: 'Monterrey S.R.L.', price: 8.10, brandOrNote: 'Acero Corrugado B500 Monterrey' },
      { supplierId: 'sup-laslomas', supplierName: 'Aceros Las Lomas S.A.', price: 8.20, brandOrNote: 'Belgo Bekaert Grado 500 (Las Lomas)' },
      { supplierId: 'sup-casadelfierro', supplierName: 'Casa del Fierro Santa Cruz', price: 8.15, brandOrNote: 'Casa del Fierro Grado 500' },
      { supplierId: 'sup-arequipa', supplierName: 'Aceros Arequipa Bolivia', price: 8.35, brandOrNote: 'Acero Arequipa ASTM A615 Grado 60' }
    ]
  },
  // LADRILLO 6H CON OPCIONES INCERPAZ / CERAMICA NORTE / CERAMICA ITAUGUA Y CADECOCRUZ
  {
    id: 'mat-ladrillo-6h',
    name: 'Ladrillo Cerámico 6 Huecos 18x25x12 cm',
    unit: 'pza',
    category: 'Mampostería',
    defaultUnitPrice: 1.25,
    defaultSupplierId: 'sup-ceranorte',
    specification: 'Ladrillo cerámico cocido para muros medianeros e interiores',
    cadecocruzPrice: 1.28,
    quotes: [
      { supplierId: 'sup-ceranorte', supplierName: 'Cerámica Norte S.R.L.', price: 1.25, brandOrNote: 'Ladrillo 6H Cerámica Norte' },
      { supplierId: 'sup-ceraitaugua', supplierName: 'Cerámica Itauguá Santa Cruz', price: 1.26, brandOrNote: 'Ladrillo 6H Cerámica Itauguá' },
      { supplierId: 'sup-incerpaz', supplierName: 'Cerámica INCERPAZ S.A.', price: 1.30, brandOrNote: 'Ladrillo 6H Incerpaz Primera' }
    ]
  },
  // ÁRIDOS DE RÍO PIRAÍ CON REFERENCIA CADECOCRUZ
  {
    id: 'mat-arena',
    name: 'Arena común lavada de río Piraí',
    unit: 'm3',
    category: 'Áridos',
    defaultUnitPrice: 75.00,
    defaultSupplierId: 'sup-aridos-pirai',
    specification: 'Libre de arcillas y materias orgánicas de la cuenca del Río Piraí',
    cadecocruzPrice: 78.00,
    quotes: [
      { supplierId: 'sup-aridos-pirai', supplierName: 'Áridos y Cantera Río Piraí', price: 75.00, brandOrNote: 'Río Piraí Lavada en Cantera' }
    ]
  },
  {
    id: 'mat-arena-fina',
    name: 'Arena fina cernida para revoques',
    unit: 'm3',
    category: 'Áridos',
    defaultUnitPrice: 85.00,
    defaultSupplierId: 'sup-aridos-pirai',
    specification: 'Tamizado fino para revoque liso',
    cadecocruzPrice: 88.00,
    quotes: [
      { supplierId: 'sup-aridos-pirai', supplierName: 'Áridos y Cantera Río Piraí', price: 85.00, brandOrNote: 'Arena Fina Cantera Urubó' }
    ]
  },
  {
    id: 'mat-grava',
    name: 'Grava común triturada 3/4"',
    unit: 'm3',
    category: 'Áridos',
    defaultUnitPrice: 95.00,
    defaultSupplierId: 'sup-aridos-pirai',
    specification: 'Canto rodado triturado tamaño máx 19mm',
    cadecocruzPrice: 98.00,
    quotes: [
      { supplierId: 'sup-aridos-pirai', supplierName: 'Áridos y Cantera Río Piraí', price: 95.00, brandOrNote: 'Ripio 3/4" Clasificado' }
    ]
  },
  {
    id: 'mat-alambre',
    name: 'Alambre de amarre N° 16',
    unit: 'kg',
    category: 'Aceros',
    defaultUnitPrice: 11.50,
    defaultSupplierId: 'sup-laslomas',
    specification: 'Alambre negro recocido para amarre de armaduras',
    cadecocruzPrice: 12.00,
    quotes: [
      { supplierId: 'sup-laslomas', supplierName: 'Aceros Las Lomas S.A.', price: 11.50, brandOrNote: 'Belgo Bekaert N° 16' },
      { supplierId: 'sup-monterrey', supplierName: 'Monterrey S.R.L.', price: 11.40, brandOrNote: 'Monterrey Alambre N° 16' },
      { supplierId: 'sup-casadelfierro', supplierName: 'Casa del Fierro Santa Cruz', price: 11.45, brandOrNote: 'Casa del Fierro N° 16' }
    ]
  },
  {
    id: 'mat-clavos',
    name: 'Clavos con cabeza 2" a 4"',
    unit: 'kg',
    category: 'Ferretería',
    defaultUnitPrice: 12.00,
    defaultSupplierId: 'sup-constructor',
    specification: 'Punta diamante para encofrados',
    cadecocruzPrice: 12.50
  },
  {
    id: 'mat-madera',
    name: 'Madera de ochoó para encofrado',
    unit: 'pie2',
    category: 'Maderas',
    defaultUnitPrice: 7.50,
    defaultSupplierId: 'sup-maderera-oriente',
    specification: 'Tablas cepilladas y listones para encofrado',
    cadecocruzPrice: 7.80,
    quotes: [
      { supplierId: 'sup-maderera-oriente', supplierName: 'Maderera El Oriente & Carpintería', price: 7.50, brandOrNote: 'Madera Ochoó de Monte' }
    ]
  },
  {
    id: 'mat-teja',
    name: 'Teja colonial cerámica',
    unit: 'pza',
    category: 'Cubiertas',
    defaultUnitPrice: 2.80,
    defaultSupplierId: 'sup-incerpaz',
    specification: 'Teja colonial cocida impermeable',
    cadecocruzPrice: 2.90,
    quotes: [
      { supplierId: 'sup-incerpaz', supplierName: 'Cerámica INCERPAZ S.A.', price: 2.80, brandOrNote: 'Teja Colonial Incerpaz' },
      { supplierId: 'sup-ceranorte', supplierName: 'Cerámica Norte S.R.L.', price: 2.70, brandOrNote: 'Teja Colonial Cerámica Norte' }
    ]
  },
  {
    id: 'mat-cumbrera',
    name: 'Cumbrera colonial cerámica',
    unit: 'pza',
    category: 'Cubiertas',
    defaultUnitPrice: 6.50,
    defaultSupplierId: 'sup-incerpaz',
    specification: 'Cumbrera articulada para teja',
    cadecocruzPrice: 6.80
  },
  {
    id: 'mat-vigueta',
    name: 'Vigueta pretensada y plastoformo h=12/16cm',
    unit: 'm2',
    category: 'Estructuras',
    defaultUnitPrice: 78.00,
    defaultSupplierId: 'sup-constructor',
    specification: 'Kit viguetas pretensadas homologadas',
    cadecocruzPrice: 80.00
  },
  {
    id: 'mat-pintura',
    name: 'Pintura látex lavable blanca Monopol/Coral',
    unit: 'galon',
    category: 'Acabados',
    defaultUnitPrice: 85.00,
    defaultSupplierId: 'sup-constructor',
    specification: 'Acabado mate alta lavabilidad',
    cadecocruzPrice: 88.00
  },
  {
    id: 'mat-porcelanato',
    name: 'Piso Porcelanato 60x60 cm rectificado',
    unit: 'm2',
    category: 'Pisos',
    defaultUnitPrice: 85.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Porcelanato pulido rectificado tránsito alto',
    cadecocruzPrice: 87.00,
    quotes: [
      { supplierId: 'sup-industrial-oriente', supplierName: 'Ferretería Industrial del Oriente', price: 85.00, brandOrNote: 'Porcelanato 60x60 Pulido' },
      { supplierId: 'sup-comercial-scz', supplierName: 'Comercial Santa Cruz Materiales', price: 82.00, brandOrNote: 'Porcelanato Tránsito Residencial' }
    ]
  },
  {
    id: 'mat-ceramica',
    name: 'Piso Cerámica esmaltada primera calidad',
    unit: 'm2',
    category: 'Pisos',
    defaultUnitPrice: 48.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Piso cerámico lavable',
    cadecocruzPrice: 50.00,
    quotes: [
      { supplierId: 'sup-industrial-oriente', supplierName: 'Ferretería Industrial del Oriente', price: 48.00, brandOrNote: 'Cerámica Esmaltada 45x45' },
      { supplierId: 'sup-ceranorte', supplierName: 'Cerámica Norte S.R.L.', price: 45.00, brandOrNote: 'Cerámica Ceranorte' }
    ]
  },
  {
    id: 'mat-pegamento',
    name: 'Cemento cola para pisos y revestimientos',
    unit: 'bolsa',
    category: 'Pegamentos',
    defaultUnitPrice: 26.00,
    defaultSupplierId: 'sup-constructor',
    specification: 'Adhesivo en polvo base cementicia',
    cadecocruzPrice: 27.00
  },
  {
    id: 'mat-granito',
    name: 'Mesón de granito negro San Gabriel e=2cm',
    unit: 'ml',
    category: 'Acabados',
    defaultUnitPrice: 380.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Granito natural pulido y abrillantado',
    cadecocruzPrice: 390.00
  },
  {
    id: 'mat-puerta-prin',
    name: 'Puerta principal de madera tajibo maciza',
    unit: 'pza',
    category: 'Carpintería',
    defaultUnitPrice: 1800.00,
    defaultSupplierId: 'sup-maderera-oriente',
    specification: 'Madera tajibo seca cepillada con marco cajón',
    cadecocruzPrice: 1850.00
  },
  {
    id: 'mat-puerta-int',
    name: 'Puerta interior de madera placa c/ marco',
    unit: 'pza',
    category: 'Carpintería',
    defaultUnitPrice: 450.00,
    defaultSupplierId: 'sup-maderera-oriente',
    specification: 'Puerta placa enchapada con marco',
    cadecocruzPrice: 470.00
  },
  {
    id: 'mat-inodoro-deca',
    name: 'Inodoro con tanque bajo Deca blanco',
    unit: 'pza',
    category: 'Sanitarios',
    defaultUnitPrice: 580.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Loza vitrificada blanca Deca',
    cadecocruzPrice: 590.00,
    quotes: [
      { supplierId: 'sup-industrial-oriente', supplierName: 'Ferretería Industrial del Oriente', price: 580.00, brandOrNote: 'Deca Blanco Original' },
      { supplierId: 'sup-constructor', supplierName: 'Ferretería El Constructor S.R.L.', price: 570.00, brandOrNote: 'Inodoro Dual Flush Deca' }
    ]
  },
  {
    id: 'mat-lavamano-deca',
    name: 'Lavamanos con pedestal Deca blanco',
    unit: 'pza',
    category: 'Sanitarios',
    defaultUnitPrice: 320.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Lavamanos con grifería monomando',
    cadecocruzPrice: 330.00
  },
  {
    id: 'mat-ducha-deca',
    name: 'Kit Ducha cromada Deca con mezcladora',
    unit: 'pza',
    category: 'Sanitarios',
    defaultUnitPrice: 260.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Mezcladora monocomando y brazo Deca',
    cadecocruzPrice: 270.00
  },
  {
    id: 'mat-placa-tramontina',
    name: 'Placa tomacorriente/interruptor Tramontina Liz',
    unit: 'pza',
    category: 'Electricidad',
    defaultUnitPrice: 22.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Placa modular blanca Tramontina',
    cadecocruzPrice: 22.50,
    quotes: [
      { supplierId: 'sup-industrial-oriente', supplierName: 'Ferretería Industrial del Oriente', price: 22.00, brandOrNote: 'Tramontina Liz Blanca' },
      { supplierId: 'sup-constructor', supplierName: 'Ferretería El Constructor S.R.L.', price: 21.50, brandOrNote: 'Placa Tramontina Original' }
    ]
  },
  {
    id: 'mat-cable-electrico',
    name: 'Cable de cobre THHN 2.5 mm2 / 4 mm2',
    unit: 'ml',
    category: 'Electricidad',
    defaultUnitPrice: 4.50,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Cable antiflama 750V',
    cadecocruzPrice: 4.60
  },
  {
    id: 'mat-tubo-pvc',
    name: 'Tubería PVC desagüe 4" y 2" Tigre',
    unit: 'ml',
    category: 'Sanitarios',
    defaultUnitPrice: 16.00,
    defaultSupplierId: 'sup-tigre',
    specification: 'Tigre serie métrica con virola',
    cadecocruzPrice: 16.50
  },
  {
    id: 'mat-calamina',
    name: 'Canaleta y bajante de calamina galvanizada N° 28',
    unit: 'ml',
    category: 'Hojalatería',
    defaultUnitPrice: 45.00,
    defaultSupplierId: 'sup-constructor',
    specification: 'Chapa de zinc doblada',
    cadecocruzPrice: 46.00
  },
  {
    id: 'mat-vidrio',
    name: 'Vidrio templado incoloro 8mm c/ perfiles aluminio',
    unit: 'm2',
    category: 'Vidrios',
    defaultUnitPrice: 280.00,
    defaultSupplierId: 'sup-industrial-oriente',
    specification: 'Templado incoloro con herrajes línea 25',
    cadecocruzPrice: 285.00
  },
  {
    id: 'mat-impermeab',
    name: 'Pintura asfáltica impermeabilizante Igol',
    unit: 'galon',
    category: 'Químicos',
    defaultUnitPrice: 95.00,
    defaultSupplierId: 'sup-constructor',
    specification: 'Emulsión asfáltica Sika Igol Denso',
    cadecocruzPrice: 98.00
  }
];

export const INITIAL_LABOR: ResourceLabor[] = [
  { id: 'lab-capataz', specialty: 'Capataz general de obra', unit: 'hh', hourlyRate: 28.00, category: 'Especialista' },
  { id: 'lab-maestro', specialty: 'Maestro Albañil calificado', unit: 'hh', hourlyRate: 24.00, category: 'Mano de Obra Calificada' },
  { id: 'lab-encofrador', specialty: 'Encofrador especialista', unit: 'hh', hourlyRate: 23.00, category: 'Mano de Obra Calificada' },
  { id: 'lab-armador', specialty: 'Fierrista / Armador de acero', unit: 'hh', hourlyRate: 23.00, category: 'Mano de Obra Calificada' },
  { id: 'lab-electricista', specialty: 'Electricista instalador', unit: 'hh', hourlyRate: 25.00, category: 'Mano de Obra Calificada' },
  { id: 'lab-plomero', specialty: 'Plomero / Sanitarista', unit: 'hh', hourlyRate: 24.00, category: 'Mano de Obra Calificada' },
  { id: 'lab-pintor', specialty: 'Pintor calificado', unit: 'hh', hourlyRate: 22.00, category: 'Mano de Obra Calificada' },
  { id: 'lab-ayudante', specialty: 'Peón / Ayudante general de obra', unit: 'hh', hourlyRate: 15.00, category: 'Ayudante' }
];

export const INITIAL_EQUIPMENT: ResourceEquipment[] = [
  { id: 'eq-mezcladora', name: 'Mezcladora de hormigón tipo trompo 320L', unit: 'hora', hourlyRate: 25.00, capacity: 'Motor a gasolina' },
  { id: 'eq-vibradora', name: 'Vibradora de inmersión 4HP (aguja 38mm)', unit: 'hora', hourlyRate: 18.00, capacity: 'Gasolina 4 tiempos' },
  { id: 'eq-guinche', name: 'Guinche o elevador de carga 500kg', unit: 'hora', hourlyRate: 22.00, capacity: 'Torre hasta 15m' },
  { id: 'eq-volqueta', name: 'Volqueta de 6m3 / 12m3 retiro escombros', unit: 'hora', hourlyRate: 120.00, capacity: 'Carga pesada' },
  { id: 'eq-andamios', name: 'Andamios metálicos tubulares modulares', unit: 'dia', hourlyRate: 10.00, capacity: 'Cuerpo modular' }
];

export const INITIAL_ECONOMIC_PARAMETERS: EconomicParameters = {
  socialChargesPercent: 55.0, // Cargas Sociales estándar Bolivia
  vatLaborPercent: 0.0,
  minorToolsPercent: 5.0,     // 5% sobre Mano de Obra
  generalExpensesPercent: 10.0, // 10% Gastos Generales
  utilityPercent: 10.0,       // 10% Utilidad
  itTaxPercent: 3.09          // IT según pliegos SABS
};

// Generador de las 56 actividades exactas con análisis de precios unitarios y proveedores cruceños
export const INITIAL_APU_ITEMS: APUItem[] = [
  {
    id: 'act-1',
    code: 'ACT-01',
    name: 'INSTALACION DE FAENAS',
    unit: 'GBL',
    category: 'Trabajos Preliminares',
    specification: 'Caseta de guardia, depósito de materiales, letrina y conexión provisoria de agua y luz en Santa Cruz.',
    components: [
      { id: 'c-1-1', type: 'material', resourceId: 'mat-madera', description: 'Madera de ochoó y listones', unit: 'pie2', quantity: 180, unitPrice: 7.50, supplierId: 'sup-maderera-oriente', quoteBrand: 'Maderera El Oriente' },
      { id: 'c-1-2', type: 'material', resourceId: 'mat-calamina', description: 'Calamina ondulada para cerco y techo', unit: 'ml', quantity: 25, unitPrice: 45.00, supplierId: 'sup-constructor', quoteBrand: 'El Constructor' },
      { id: 'c-1-3', type: 'material', resourceId: 'mat-clavos', description: 'Clavos con cabeza surtidos', unit: 'kg', quantity: 15, unitPrice: 12.00, supplierId: 'sup-constructor' },
      { id: 'c-1-4', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil calificado', unit: 'hh', quantity: 24, unitPrice: 24.00 },
      { id: 'c-1-5', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón / Ayudante general', unit: 'hh', quantity: 36, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-2',
    code: 'ACT-02',
    name: 'REPLANTEO Y TRAZADO',
    unit: 'GBL',
    category: 'Trabajos Preliminares',
    specification: 'Trazado con caballetes de madera, niveles y lienzas de ejes según plano arquitectónico.',
    components: [
      { id: 'c-2-1', type: 'material', resourceId: 'mat-madera', description: 'Madera para estacas y caballetes', unit: 'pie2', quantity: 60, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-2-2', type: 'material', resourceId: 'mat-clavos', description: 'Clavos y lienzas de trazado', unit: 'kg', quantity: 5, unitPrice: 12.00, supplierId: 'sup-constructor' },
      { id: 'c-2-3', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil calificado', unit: 'hh', quantity: 16, unitPrice: 24.00 },
      { id: 'c-2-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón / Ayudante general', unit: 'hh', quantity: 20, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-3',
    code: 'ACT-03',
    name: 'EXCAVACIONES',
    unit: 'M3',
    category: 'Movimiento de Tierras',
    specification: 'Excavación manual a pala y picota para zapatas y vigas de fundación en Santa Cruz.',
    components: [
      { id: 'c-3-1', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón / Ayudante general de excavación', unit: 'hh', quantity: 3.5, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-4',
    code: 'ACT-04',
    name: 'ZAPATAS',
    unit: 'M3',
    category: 'Fundaciones',
    specification: 'Hormigón armado fck=210 kg/cm2 con parrilla de acero corrugado CBH-87 para zapatas aisladas.',
    components: [
      { id: 'c-4-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 6.8, unitPrice: 46.00, supplierId: 'sup-itacamba', quoteBrand: 'Itacamba Yacuses' },
      { id: 'c-4-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 65, unitPrice: 8.10, supplierId: 'sup-monterrey', quoteBrand: 'Monterrey B500' },
      { id: 'c-4-3', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.48, unitPrice: 75.00, supplierId: 'sup-aridos-pirai', quoteBrand: 'Río Piraí' },
      { id: 'c-4-4', type: 'material', resourceId: 'mat-grava', description: 'Grava triturada 3/4"', unit: 'm3', quantity: 0.78, unitPrice: 95.00, supplierId: 'sup-aridos-pirai', quoteBrand: 'Río Piraí' },
      { id: 'c-4-5', type: 'material', resourceId: 'mat-alambre', description: 'Alambre de amarre N° 16', unit: 'kg', quantity: 1.2, unitPrice: 11.50, supplierId: 'sup-laslomas' },
      { id: 'c-4-6', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 7, unitPrice: 24.00 },
      { id: 'c-4-7', type: 'labor', resourceId: 'lab-armador', description: 'Armador de fierro', unit: 'hh', quantity: 6, unitPrice: 23.00 },
      { id: 'c-4-8', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón de vaciado', unit: 'hh', quantity: 16, unitPrice: 15.00 },
      { id: 'c-4-9', type: 'equipment', resourceId: 'eq-mezcladora', description: 'Mezcladora de hormigón 320L', unit: 'hora', quantity: 1.8, unitPrice: 25.00 },
      { id: 'c-4-10', type: 'equipment', resourceId: 'eq-vibradora', description: 'Vibradora de hormigón 4HP', unit: 'hora', quantity: 1.5, unitPrice: 18.00 }
    ]
  },
  {
    id: 'act-5',
    code: 'ACT-05',
    name: 'COLUMNAS DE HORMIGON ARMADO',
    unit: 'M3',
    category: 'Estructuras',
    specification: 'Columnas estructurales en planta baja, fck=210 kg/cm2, encofrado y acero estructural.',
    components: [
      { id: 'c-5-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 7.5, unitPrice: 46.00, supplierId: 'sup-itacamba', quoteBrand: 'Itacamba Yacuses' },
      { id: 'c-5-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 95, unitPrice: 8.20, supplierId: 'sup-laslomas', quoteBrand: 'Las Lomas Belgo Bekaert' },
      { id: 'c-5-3', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.45, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-5-4', type: 'material', resourceId: 'mat-grava', description: 'Grava triturada 3/4"', unit: 'm3', quantity: 0.75, unitPrice: 95.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-5-5', type: 'material', resourceId: 'mat-madera', description: 'Madera de ochoó para encofrado', unit: 'pie2', quantity: 28, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-5-6', type: 'material', resourceId: 'mat-clavos', description: 'Clavos con cabeza', unit: 'kg', quantity: 1.4, unitPrice: 12.00, supplierId: 'sup-constructor' },
      { id: 'c-5-7', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 11, unitPrice: 24.00 },
      { id: 'c-5-8', type: 'labor', resourceId: 'lab-encofrador', description: 'Encofrador especialista', unit: 'hh', quantity: 13, unitPrice: 23.00 },
      { id: 'c-5-9', type: 'labor', resourceId: 'lab-armador', description: 'Fierrista / Armador', unit: 'hh', quantity: 9, unitPrice: 23.00 },
      { id: 'c-5-10', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón de apoyo', unit: 'hh', quantity: 22, unitPrice: 15.00 },
      { id: 'c-5-11', type: 'equipment', resourceId: 'eq-mezcladora', description: 'Mezcladora de hormigón', unit: 'hora', quantity: 2.2, unitPrice: 25.00 },
      { id: 'c-5-12', type: 'equipment', resourceId: 'eq-vibradora', description: 'Vibradora de inmersión', unit: 'hora', quantity: 1.8, unitPrice: 18.00 }
    ]
  },
  {
    id: 'act-6',
    code: 'ACT-06',
    name: 'VIGAS DE FUNDACION',
    unit: 'M3',
    category: 'Fundaciones',
    specification: 'Vigas de encadenado inferior sobre terreno nivelado, impermeabilizadas y hormigón fck=210 kg/cm2.',
    components: [
      { id: 'c-6-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 7.0, unitPrice: 46.00, supplierId: 'sup-itacamba', quoteBrand: 'Itacamba Yacuses' },
      { id: 'c-6-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 80, unitPrice: 8.10, supplierId: 'sup-monterrey', quoteBrand: 'Monterrey B500' },
      { id: 'c-6-3', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.46, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-6-4', type: 'material', resourceId: 'mat-grava', description: 'Grava triturada 3/4"', unit: 'm3', quantity: 0.76, unitPrice: 95.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-6-5', type: 'material', resourceId: 'mat-madera', description: 'Madera de encofrado', unit: 'pie2', quantity: 18, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-6-6', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 9, unitPrice: 24.00 },
      { id: 'c-6-7', type: 'labor', resourceId: 'lab-armador', description: 'Fierrista', unit: 'hh', quantity: 8, unitPrice: 23.00 },
      { id: 'c-6-8', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 18, unitPrice: 15.00 },
      { id: 'c-6-9', type: 'equipment', resourceId: 'eq-mezcladora', description: 'Mezcladora de hormigón', unit: 'hora', quantity: 2.0, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-7',
    code: 'ACT-07',
    name: 'IMPERMEABILIZACION DE VIGAS DE FUNDACION',
    unit: 'ML',
    category: 'Aislaciones',
    specification: 'Pintura asfáltica de doble capa más polietileno sobre corona de vigas para evitar ascenso por capilaridad.',
    components: [
      { id: 'c-7-1', type: 'material', resourceId: 'mat-impermeab', description: 'Pintura asfáltica Igol Denso', unit: 'galon', quantity: 0.08, unitPrice: 95.00, supplierId: 'sup-constructor' },
      { id: 'c-7-2', type: 'labor', resourceId: 'lab-maestro', description: 'Albañil aplicador', unit: 'hh', quantity: 0.25, unitPrice: 24.00 },
      { id: 'c-7-3', type: 'labor', resourceId: 'lab-ayudante', description: 'Ayudante', unit: 'hh', quantity: 0.20, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-8',
    code: 'ACT-08',
    name: 'COLUMNAS DE HORMIGON ARMADO',
    unit: 'M3',
    category: 'Estructuras',
    specification: 'Columnas estructurales en planta alta / sobre viga, fck=210 kg/cm2 con izaje de materiales.',
    components: [
      { id: 'c-8-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 7.5, unitPrice: 47.50, supplierId: 'sup-fancesa', quoteBrand: 'Fancesa Superior' },
      { id: 'c-8-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 95, unitPrice: 8.20, supplierId: 'sup-laslomas', quoteBrand: 'Las Lomas Belgo Bekaert' },
      { id: 'c-8-3', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.45, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-8-4', type: 'material', resourceId: 'mat-grava', description: 'Grava triturada 3/4"', unit: 'm3', quantity: 0.75, unitPrice: 95.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-8-5', type: 'material', resourceId: 'mat-madera', description: 'Madera de encofrado', unit: 'pie2', quantity: 28, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-8-6', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 12, unitPrice: 24.00 },
      { id: 'c-8-7', type: 'labor', resourceId: 'lab-encofrador', description: 'Encofrador', unit: 'hh', quantity: 14, unitPrice: 23.00 },
      { id: 'c-8-8', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 24, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-9',
    code: 'ACT-09',
    name: 'RELLENO Y COMPACTADO DE TIERRA',
    unit: 'M3',
    category: 'Movimiento de Tierras',
    specification: 'Relleno por capas de 20cm con tierra seleccionada, humedad óptima y compactador manual.',
    components: [
      { id: 'c-9-1', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón de paleo y apisonado', unit: 'hh', quantity: 2.2, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-10',
    code: 'ACT-10',
    name: 'VIGAS DE HORMIGON ARMADO',
    unit: 'M3',
    category: 'Estructuras',
    specification: 'Vigas aéreas de soporte de losa con estribos cerrados y perchas, fck=210 kg/cm2.',
    components: [
      { id: 'c-10-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 7.3, unitPrice: 46.00, supplierId: 'sup-itacamba', quoteBrand: 'Itacamba Yacuses' },
      { id: 'c-10-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 90, unitPrice: 8.20, supplierId: 'sup-laslomas', quoteBrand: 'Las Lomas Belgo Bekaert' },
      { id: 'c-10-3', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.45, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-10-4', type: 'material', resourceId: 'mat-grava', description: 'Grava triturada 3/4"', unit: 'm3', quantity: 0.75, unitPrice: 95.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-10-5', type: 'material', resourceId: 'mat-madera', description: 'Madera para fondos y laterales', unit: 'pie2', quantity: 25, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-10-6', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 10, unitPrice: 24.00 },
      { id: 'c-10-7', type: 'labor', resourceId: 'lab-encofrador', description: 'Encofrador', unit: 'hh', quantity: 12, unitPrice: 23.00 },
      { id: 'c-10-8', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 20, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-11',
    code: 'ACT-11',
    name: 'VIGAS METALICAS',
    unit: 'ML',
    category: 'Estructuras Metálicas',
    specification: 'Perfiles estructurales metálicos tipo IPE / Costaneras dobles con pintura anticorrosiva.',
    components: [
      { id: 'c-11-1', type: 'material', resourceId: 'mat-fierro', description: 'Perfil metálico estructural electro-soldado', unit: 'kg', quantity: 18, unitPrice: 9.50, supplierId: 'sup-monterrey', quoteBrand: 'Monterrey Perfiles' },
      { id: 'c-11-2', type: 'material', resourceId: 'mat-pintura', description: 'Pintura anticorrosiva sintética', unit: 'galon', quantity: 0.05, unitPrice: 90.00, supplierId: 'sup-constructor' },
      { id: 'c-11-3', type: 'labor', resourceId: 'lab-armador', description: 'Soldador / Montador calificado', unit: 'hh', quantity: 1.5, unitPrice: 25.00 },
      { id: 'c-11-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Ayudante', unit: 'hh', quantity: 1.5, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-12',
    code: 'ACT-12',
    name: 'LOSA ALIVIANADA CON VIGUETA PRETENSADA',
    unit: 'M2',
    category: 'Estructuras',
    specification: 'Losa unidireccional con viguetas pretensadas, complementos plastoformo h=12/16cm y capa de compresión e=5cm.',
    components: [
      { id: 'c-12-1', type: 'material', resourceId: 'mat-vigueta', description: 'Kit Viguetas pretensadas + plastoformo', unit: 'm2', quantity: 1.0, unitPrice: 78.00, supplierId: 'sup-constructor', quoteBrand: 'El Constructor' },
      { id: 'c-12-2', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.65, unitPrice: 46.00, supplierId: 'sup-itacamba', quoteBrand: 'Itacamba Yacuses' },
      { id: 'c-12-3', type: 'material', resourceId: 'mat-fierro', description: 'Malla electrosoldada / fierro 6mm', unit: 'kg', quantity: 3.5, unitPrice: 8.10, supplierId: 'sup-monterrey', quoteBrand: 'Monterrey B500' },
      { id: 'c-12-4', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.045, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-12-5', type: 'material', resourceId: 'mat-grava', description: 'Grava triturada 3/4"', unit: 'm3', quantity: 0.055, unitPrice: 95.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-12-6', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 1.2, unitPrice: 24.00 },
      { id: 'c-12-7', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón de vaciado y apuntalado', unit: 'hh', quantity: 2.2, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-13',
    code: 'ACT-13',
    name: 'COLUMNAS DE HORMIGON ARMADO',
    unit: 'M3',
    category: 'Estructuras',
    specification: 'Columnas estructurales perimetrales y de remate en planta de cubierta.',
    components: [
      { id: 'c-13-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 7.2, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-13-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 90, unitPrice: 8.20, supplierId: 'sup-laslomas' },
      { id: 'c-13-3', type: 'material', resourceId: 'mat-madera', description: 'Madera de encofrado', unit: 'pie2', quantity: 26, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-13-4', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 11, unitPrice: 24.00 },
      { id: 'c-13-5', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 20, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-14',
    code: 'ACT-14',
    name: 'VIGAS DE ENCADENADO',
    unit: 'M3',
    category: 'Estructuras',
    specification: 'Vigas de amarre superior de muros previo a la estructura de cubierta.',
    components: [
      { id: 'c-14-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 6.8, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-14-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 70, unitPrice: 8.10, supplierId: 'sup-monterrey' },
      { id: 'c-14-3', type: 'material', resourceId: 'mat-madera', description: 'Madera de encofrado', unit: 'pie2', quantity: 18, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-14-4', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 9, unitPrice: 24.00 },
      { id: 'c-14-5', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 16, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-15',
    code: 'ACT-15',
    name: 'GRADAS DE HORMIGON ARMADO',
    unit: 'M3',
    category: 'Estructuras',
    specification: 'Escalera de hormigón armado autoportante, incluye encofrado escalonado y vaciado monolítico.',
    components: [
      { id: 'c-15-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 7.5, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-15-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 85, unitPrice: 8.20, supplierId: 'sup-laslomas' },
      { id: 'c-15-3', type: 'material', resourceId: 'mat-madera', description: 'Madera de encofrado para gradas', unit: 'pie2', quantity: 32, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-15-4', type: 'labor', resourceId: 'lab-encofrador', description: 'Encofrador especialista en gradas', unit: 'hh', quantity: 18, unitPrice: 23.00 },
      { id: 'c-15-5', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 24, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-16',
    code: 'ACT-16',
    name: 'CONTRAPISO SOBRE LOSA Y GRADAS',
    unit: 'M2',
    category: 'Albañilería',
    specification: 'Capa niveladora de mortero 1:4 espesor 4cm para posterior colocación de revestimientos.',
    components: [
      { id: 'c-16-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.18, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-16-2', type: 'material', resourceId: 'mat-arena', description: 'Arena común lavada de río Piraí', unit: 'm3', quantity: 0.035, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-16-3', type: 'labor', resourceId: 'lab-maestro', description: 'Albañil', unit: 'hh', quantity: 0.6, unitPrice: 24.00 },
      { id: 'c-16-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 0.8, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-17',
    code: 'ACT-17',
    name: 'ESTRUCTURA PARA CUBIERTA',
    unit: 'GBL',
    category: 'Cubiertas',
    specification: 'Tijerales, vigas y correas de madera de tajibo o perfil metálico galvanizado para soporte de techo.',
    components: [
      { id: 'c-17-1', type: 'material', resourceId: 'mat-madera', description: 'Madera de tajibo/cuchi aserrada para tijerales', unit: 'pie2', quantity: 450, unitPrice: 9.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-17-2', type: 'material', resourceId: 'mat-clavos', description: 'Pernos, pletinas y clavos lanceros', unit: 'kg', quantity: 35, unitPrice: 14.00, supplierId: 'sup-constructor' },
      { id: 'c-17-3', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro techero / carpintero', unit: 'hh', quantity: 40, unitPrice: 25.00 },
      { id: 'c-17-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Ayudantes de montaje', unit: 'hh', quantity: 60, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-18',
    code: 'ACT-18',
    name: 'CUMBRERA DE TEJA COLONIAL',
    unit: 'ML',
    category: 'Cubiertas',
    specification: 'Colocación de cumbreras cerámicas Incerpaz asentadas con mortero cemento y colorante rojo.',
    components: [
      { id: 'c-18-1', type: 'material', resourceId: 'mat-cumbrera', description: 'Cumbrera colonial Incerpaz', unit: 'pza', quantity: 3.2, unitPrice: 6.50, supplierId: 'sup-incerpaz', quoteBrand: 'Incerpaz Cumbrera' },
      { id: 'c-18-2', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.10, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-18-3', type: 'labor', resourceId: 'lab-maestro', description: 'Techero albañil', unit: 'hh', quantity: 0.5, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-19',
    code: 'ACT-19',
    name: 'CUBIERTA DE TEJA COLONIAL',
    unit: 'M2',
    category: 'Cubiertas',
    specification: 'Colocación de tejas cerámicas coloniales Incerpaz sobre listonería, incluye traslape y fijación.',
    components: [
      { id: 'c-19-1', type: 'material', resourceId: 'mat-teja', description: 'Teja colonial cerámica Incerpaz', unit: 'pza', quantity: 28, unitPrice: 2.80, supplierId: 'sup-incerpaz', quoteBrand: 'Incerpaz Colonial' },
      { id: 'c-19-2', type: 'material', resourceId: 'mat-madera', description: 'Listones de madera 2x1"', unit: 'pie2', quantity: 3.5, unitPrice: 7.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-19-3', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro techero', unit: 'hh', quantity: 1.1, unitPrice: 24.00 },
      { id: 'c-19-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón pasador', unit: 'hh', quantity: 1.4, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-20',
    code: 'ACT-20',
    name: 'MURO DE LADRILLO 6H',
    unit: 'M2',
    category: 'Albañilería',
    specification: 'Mampostería de ladrillo cerámico 6 huecos (18x25x12 cm) asentado con mortero de cemento 1:4 en Santa Cruz.',
    components: [
      { id: 'c-20-1', type: 'material', resourceId: 'mat-ladrillo-6h', description: 'Ladrillo Cerámico 6 Huecos 18x25x12 cm', unit: 'pza', quantity: 28, unitPrice: 1.25, supplierId: 'sup-ceranorte', quoteBrand: 'Cerámica Norte 6H' },
      { id: 'c-20-2', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.22, unitPrice: 46.00, supplierId: 'sup-itacamba', quoteBrand: 'Itacamba Yacuses' },
      { id: 'c-20-3', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.04, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-20-4', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil calificado', unit: 'hh', quantity: 1.4, unitPrice: 24.00 },
      { id: 'c-20-5', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón ayudante', unit: 'hh', quantity: 1.6, unitPrice: 15.00 },
      { id: 'c-20-6', type: 'equipment', resourceId: 'eq-andamios', description: 'Andamios tubulares', unit: 'dia', quantity: 0.15, unitPrice: 10.00 }
    ]
  },
  {
    id: 'act-21',
    code: 'ACT-21',
    name: 'INSTALACION SANITARIA (ENTUBADO)',
    unit: 'GBL',
    category: 'Instalaciones Sanitarias',
    specification: 'Red de distribución de agua fría termofusión / PVC y ramales de desagüe empotrados.',
    components: [
      { id: 'c-21-1', type: 'material', resourceId: 'mat-tubo-pvc', description: 'Tuberías PVC Tigre y accesorios', unit: 'ml', quantity: 85, unitPrice: 16.00, supplierId: 'sup-tigre', quoteBrand: 'Tigre Bolivia' },
      { id: 'c-21-2', type: 'labor', resourceId: 'lab-plomero', description: 'Plomero sanitarista', unit: 'hh', quantity: 30, unitPrice: 24.00 },
      { id: 'c-21-3', type: 'labor', resourceId: 'lab-ayudante', description: 'Ayudante', unit: 'hh', quantity: 30, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-22',
    code: 'ACT-22',
    name: 'INSTALACION ELECTRICA (ENDUCTADO)',
    unit: 'GBL',
    category: 'Instalaciones Eléctricas',
    specification: 'Colocación de corrugado de 3/4" y 1", cajas rectangulares y octogonales en losas y muros.',
    components: [
      { id: 'c-22-1', type: 'material', resourceId: 'mat-cable-electrico', description: 'Ductos corrugados y cajas de paso', unit: 'ml', quantity: 160, unitPrice: 3.50, supplierId: 'sup-industrial-oriente' },
      { id: 'c-22-2', type: 'labor', resourceId: 'lab-electricista', description: 'Electricista calificado', unit: 'hh', quantity: 28, unitPrice: 25.00 },
      { id: 'c-22-3', type: 'labor', resourceId: 'lab-ayudante', description: 'Ayudante', unit: 'hh', quantity: 28, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-23',
    code: 'ACT-23',
    name: 'REVOQUE INTERIOR DE CEMENTO',
    unit: 'M2',
    category: 'Revoques',
    specification: 'Revoque fratasado sobre muro de ladrillo con mortero de cemento y arena fina cernida 1:4.',
    components: [
      { id: 'c-23-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.19, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-23-2', type: 'material', resourceId: 'mat-arena-fina', description: 'Arena fina cernida de río Piraí', unit: 'm3', quantity: 0.035, unitPrice: 85.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-23-3', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 1.1, unitPrice: 24.00 },
      { id: 'c-23-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 1.1, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-24',
    code: 'ACT-24',
    name: 'PUERTA PRINCIPAL',
    unit: 'PZA',
    category: 'Carpintería de Madera',
    specification: 'Puerta pivotante o batiente de madera maciza de tajibo 1.00x2.40m, marco cajón y barnizada.',
    components: [
      { id: 'c-24-1', type: 'material', resourceId: 'mat-puerta-prin', description: 'Hoja y marco macizo de tajibo', unit: 'pza', quantity: 1.0, unitPrice: 1800.00, supplierId: 'sup-maderera-oriente' },
      { id: 'c-24-2', type: 'material', resourceId: 'mat-clavos', description: 'Tornillos y anclajes tirafondos', unit: 'kg', quantity: 1.0, unitPrice: 25.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-24-3', type: 'labor', resourceId: 'lab-maestro', description: 'Carpintero instalador', unit: 'hh', quantity: 6.0, unitPrice: 26.00 }
    ]
  },
  {
    id: 'act-25',
    code: 'ACT-25',
    name: 'PUERTAS DE MADERA',
    unit: 'PZA',
    category: 'Carpintería de Madera',
    specification: 'Puertas placa enchapadas para dormitorios y baños con marcos de madera de ochoó/tajibo.',
    components: [
      { id: 'c-25-1', type: 'material', resourceId: 'mat-puerta-int', description: 'Puerta placa con marco', unit: 'pza', quantity: 1.0, unitPrice: 450.00, supplierId: 'sup-maderera-oriente' },
      { id: 'c-25-2', type: 'labor', resourceId: 'lab-maestro', description: 'Carpintero instalador', unit: 'hh', quantity: 3.5, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-26',
    code: 'ACT-26',
    name: 'PUERTA METALICA',
    unit: 'PZA',
    category: 'Carpintería Metálica',
    specification: 'Puerta de servicio o acceso a patio en tubo estructural y plancha plegada con pintura.',
    components: [
      { id: 'c-26-1', type: 'material', resourceId: 'mat-fierro', description: 'Estructura metálica y chapa', unit: 'kg', quantity: 45, unitPrice: 9.50, supplierId: 'sup-monterrey' },
      { id: 'c-26-2', type: 'labor', resourceId: 'lab-armador', description: 'Cerrajero / Soldador', unit: 'hh', quantity: 6.0, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-27',
    code: 'ACT-27',
    name: 'CARPINTERIA DE VIDRIO TEMPLADO',
    unit: 'M2',
    category: 'Vidriería y Aluminio',
    specification: 'Mamparas y ventanales en vidrio templado incoloro 8mm con perfiles de aluminio línea 25.',
    components: [
      { id: 'c-27-1', type: 'material', resourceId: 'mat-vidrio', description: 'Vidrio templado 8mm con herrajes', unit: 'm2', quantity: 1.0, unitPrice: 280.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-27-2', type: 'labor', resourceId: 'lab-maestro', description: 'Vidriero especialista', unit: 'hh', quantity: 1.5, unitPrice: 26.00 }
    ]
  },
  {
    id: 'act-28',
    code: 'ACT-28',
    name: 'BOX DE BANO',
    unit: 'M2',
    category: 'Vidriería y Sanitarios',
    specification: 'Box de ducha en vidrio templado 8mm corredizo con riel superior de aluminio anodizado.',
    components: [
      { id: 'c-28-1', type: 'material', resourceId: 'mat-vidrio', description: 'Vidrio templado y kit box ducha', unit: 'm2', quantity: 1.0, unitPrice: 320.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-28-2', type: 'labor', resourceId: 'lab-maestro', description: 'Instalador', unit: 'hh', quantity: 2.0, unitPrice: 26.00 }
    ]
  },
  {
    id: 'act-29',
    code: 'ACT-29',
    name: 'EMPEDRADO Y CONTRAPISOS',
    unit: 'M2',
    category: 'Pisos y Exteriores',
    specification: 'Base de piedra bola acomodada y hormigón pobre nivelador e=8cm para veredas y parqueos.',
    components: [
      { id: 'c-29-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.35, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-29-2', type: 'material', resourceId: 'mat-arena', description: 'Arena común de río Piraí', unit: 'm3', quantity: 0.05, unitPrice: 75.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-29-3', type: 'material', resourceId: 'mat-grava', description: 'Grava triturada', unit: 'm3', quantity: 0.06, unitPrice: 95.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-29-4', type: 'labor', resourceId: 'lab-maestro', description: 'Albañil', unit: 'hh', quantity: 0.9, unitPrice: 24.00 },
      { id: 'c-29-5', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 1.3, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-30',
    code: 'ACT-30',
    name: 'DINTEL DE HORMIGON ARMADO',
    unit: 'ML',
    category: 'Estructuras',
    specification: 'Dinteles sobre puertas y ventanas fck=210 kg/cm2 sección 15x15cm con 4 fierros de 8mm.',
    components: [
      { id: 'c-30-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.16, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-30-2', type: 'material', resourceId: 'mat-fierro', description: 'Fierro Corrugado 5000 kg/cm2', unit: 'kg', quantity: 2.2, unitPrice: 8.10, supplierId: 'sup-monterrey' },
      { id: 'c-30-3', type: 'labor', resourceId: 'lab-maestro', description: 'Albañil', unit: 'hh', quantity: 0.6, unitPrice: 24.00 },
      { id: 'c-30-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 0.6, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-31',
    code: 'ACT-31',
    name: 'CIELO FALSO',
    unit: 'M2',
    category: 'Cielos Falsos',
    specification: 'Cielo falso de placas de yeso-cartón (Durlock/Knauf) con perfiles omega galvanizados.',
    components: [
      { id: 'c-31-1', type: 'material', resourceId: 'mat-pegamento', description: 'Placa yeso 9.5mm + perfiles', unit: 'm2', quantity: 1.05, unitPrice: 45.00, supplierId: 'sup-constructor' },
      { id: 'c-31-2', type: 'labor', resourceId: 'lab-maestro', description: 'Especialista durlockero', unit: 'hh', quantity: 0.8, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-32',
    code: 'ACT-32',
    name: 'ALEROS',
    unit: 'M2',
    category: 'Cubiertas',
    specification: 'Forrado de aleros exteriores con machihembre de madera o fibrocemento.',
    components: [
      { id: 'c-32-1', type: 'material', resourceId: 'mat-madera', description: 'Madera machihembrada', unit: 'pie2', quantity: 4.0, unitPrice: 8.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-32-2', type: 'labor', resourceId: 'lab-maestro', description: 'Carpintero', unit: 'hh', quantity: 0.9, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-33',
    code: 'ACT-33',
    name: 'REVOQUE EXTERIOR DE CEMENTO',
    unit: 'M2',
    category: 'Revoques',
    specification: 'Revoque impermeable en fachadas exteriores con aditivo hidrófugo Sika 1 y frotachado fino.',
    components: [
      { id: 'c-33-1', type: 'material', resourceId: 'mat-cemento', description: 'Cemento IP-30 (Bolsa 50 kg)', unit: 'bolsa', quantity: 0.22, unitPrice: 46.00, supplierId: 'sup-itacamba' },
      { id: 'c-33-2', type: 'material', resourceId: 'mat-arena-fina', description: 'Arena fina de río Piraí', unit: 'm3', quantity: 0.04, unitPrice: 85.00, supplierId: 'sup-aridos-pirai' },
      { id: 'c-33-3', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro Albañil', unit: 'hh', quantity: 1.3, unitPrice: 24.00 },
      { id: 'c-33-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón', unit: 'hh', quantity: 1.3, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-34',
    code: 'ACT-34',
    name: 'MESONES DE GRANITO NEGRO 60 cm',
    unit: 'ML',
    category: 'Acabados y Cocina',
    specification: 'Provisión e instalación de granito negro San Gabriel e=2cm con zócalo y perforaciones para bacha.',
    components: [
      { id: 'c-34-1', type: 'material', resourceId: 'mat-granito', description: 'Placa granito negro 60cm pulido', unit: 'ml', quantity: 1.0, unitPrice: 380.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-34-2', type: 'material', resourceId: 'mat-pegamento', description: 'Pegamento epóxico y silicona', unit: 'bolsa', quantity: 0.2, unitPrice: 65.00, supplierId: 'sup-constructor' },
      { id: 'c-34-3', type: 'labor', resourceId: 'lab-maestro', description: 'Instalador marmolero', unit: 'hh', quantity: 2.0, unitPrice: 26.00 }
    ]
  },
  {
    id: 'act-35',
    code: 'ACT-35',
    name: 'ISLA DE COCINA',
    unit: 'M2',
    category: 'Acabados y Cocina',
    specification: 'Mesón tipo isla en granito con faldones ingletados a 45° y estructura de apoyo.',
    components: [
      { id: 'c-35-1', type: 'material', resourceId: 'mat-granito', description: 'Granito negro pulido por m2', unit: 'ml', quantity: 1.6, unitPrice: 380.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-35-2', type: 'labor', resourceId: 'lab-maestro', description: 'Marmolero instalador', unit: 'hh', quantity: 3.5, unitPrice: 26.00 }
    ]
  },
  {
    id: 'act-36',
    code: 'ACT-36',
    name: 'CANALETAS Y BAJANTES DE CALAMINA',
    unit: 'ML',
    category: 'Cubiertas y Desagües',
    specification: 'Canaleta de zinc galvanizado calibre 28 desarrollo 40cm con ganchos de platina y bajantes.',
    components: [
      { id: 'c-36-1', type: 'material', resourceId: 'mat-calamina', description: 'Canaleta plegada N° 28', unit: 'ml', quantity: 1.05, unitPrice: 45.00, supplierId: 'sup-constructor' },
      { id: 'c-36-2', type: 'labor', resourceId: 'lab-maestro', description: 'Hojalatero calificado', unit: 'hh', quantity: 0.8, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-37',
    code: 'ACT-37',
    name: 'PROV. E INSTALACION DUCHA (DECA)',
    unit: 'PZA',
    category: 'Artefactos Sanitarios',
    specification: 'Kit mezcladora monocomando y brazo de ducha Deca cromado con accesorios de fijación.',
    components: [
      { id: 'c-37-1', type: 'material', resourceId: 'mat-ducha-deca', description: 'Kit Ducha Deca cromada', unit: 'pza', quantity: 1.0, unitPrice: 260.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Deca Original' },
      { id: 'c-37-2', type: 'labor', resourceId: 'lab-plomero', description: 'Plomero instalador', unit: 'hh', quantity: 2.0, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-38',
    code: 'ACT-38',
    name: 'PISOS DE PORCELANATO',
    unit: 'M2',
    category: 'Pisos y Revestimientos',
    specification: 'Provisión y colocación de porcelanato 60x60cm rectificado con cemento cola y crucetas 2mm.',
    components: [
      { id: 'c-38-1', type: 'material', resourceId: 'mat-porcelanato', description: 'Piso Porcelanato 60x60 cm rectificado', unit: 'm2', quantity: 1.08, unitPrice: 85.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Porcelanato Pulido Rectificado' },
      { id: 'c-38-2', type: 'material', resourceId: 'mat-pegamento', description: 'Cemento cola especial porcelanato', unit: 'bolsa', quantity: 0.35, unitPrice: 28.00, supplierId: 'sup-constructor' },
      { id: 'c-38-3', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro colocador de piso', unit: 'hh', quantity: 1.2, unitPrice: 25.00 },
      { id: 'c-38-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peón ayudante', unit: 'hh', quantity: 1.0, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-39',
    code: 'ACT-39',
    name: 'REVESTIMIENTO DE PORCELANATO',
    unit: 'M2',
    category: 'Pisos y Revestimientos',
    specification: 'Revestimiento en muros de baño y cocina hasta altura de dintel.',
    components: [
      { id: 'c-39-1', type: 'material', resourceId: 'mat-porcelanato', description: 'Porcelanato para muro', unit: 'm2', quantity: 1.08, unitPrice: 85.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-39-2', type: 'material', resourceId: 'mat-pegamento', description: 'Cemento cola', unit: 'bolsa', quantity: 0.35, unitPrice: 28.00, supplierId: 'sup-constructor' },
      { id: 'c-39-3', type: 'labor', resourceId: 'lab-maestro', description: 'Maestro colocador', unit: 'hh', quantity: 1.4, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-40',
    code: 'ACT-40',
    name: 'PISOS DE CERAMICA',
    unit: 'M2',
    category: 'Pisos y Revestimientos',
    specification: 'Cerámica esmaltada de alto tránsito para lavandería y áreas de servicio.',
    components: [
      { id: 'c-40-1', type: 'material', resourceId: 'mat-ceramica', description: 'Piso Cerámica esmaltada primera calidad', unit: 'm2', quantity: 1.08, unitPrice: 48.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Cerámica Esmaltada 45x45' },
      { id: 'c-40-2', type: 'material', resourceId: 'mat-pegamento', description: 'Cemento cola estándar', unit: 'bolsa', quantity: 0.30, unitPrice: 25.00, supplierId: 'sup-constructor' },
      { id: 'c-40-3', type: 'labor', resourceId: 'lab-maestro', description: 'Albañil colocador', unit: 'hh', quantity: 1.0, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-41',
    code: 'ACT-41',
    name: 'INSTALACION ELECTRICA GENERAL',
    unit: 'GBL',
    category: 'Instalaciones Eléctricas',
    specification: 'Cableado integral con alambre de cobre THHN, tablero general, térmicos Schneider y puesta a tierra con jabalina.',
    components: [
      { id: 'c-41-1', type: 'material', resourceId: 'mat-cable-electrico', description: 'Cables THHN varios calibres y térmicos', unit: 'ml', quantity: 320, unitPrice: 4.80, supplierId: 'sup-industrial-oriente' },
      { id: 'c-41-2', type: 'labor', resourceId: 'lab-electricista', description: 'Electricista instalador', unit: 'hh', quantity: 45, unitPrice: 25.00 },
      { id: 'c-41-3', type: 'labor', resourceId: 'lab-ayudante', description: 'Ayudante', unit: 'hh', quantity: 40, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-42',
    code: 'ACT-42',
    name: 'PINTURA',
    unit: 'M2',
    category: 'Pinturas',
    specification: 'Lijado, sellador acrílico y dos manos de látex lavable mate Monopol o Coral en muros y cielos.',
    components: [
      { id: 'c-42-1', type: 'material', resourceId: 'mat-pintura', description: 'Pintura látex lavable Monopol/Coral', unit: 'galon', quantity: 0.08, unitPrice: 85.00, supplierId: 'sup-constructor' },
      { id: 'c-42-2', type: 'labor', resourceId: 'lab-pintor', description: 'Pintor calificado', unit: 'hh', quantity: 0.6, unitPrice: 22.00 }
    ]
  },
  {
    id: 'act-43',
    code: 'ACT-43',
    name: 'BARANDADO DE MADERA',
    unit: 'ML',
    category: 'Carpintería de Madera',
    specification: 'Pasamanos y barandillas de madera tajibo torneada/cepillada para escalera y mezanine.',
    components: [
      { id: 'c-43-1', type: 'material', resourceId: 'mat-madera', description: 'Madera de tajibo torneada', unit: 'pie2', quantity: 8.0, unitPrice: 12.00, supplierId: 'sup-maderera-oriente' },
      { id: 'c-43-2', type: 'labor', resourceId: 'lab-maestro', description: 'Carpintero especialista', unit: 'hh', quantity: 2.2, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-44',
    code: 'ACT-44',
    name: 'CHAPAS Y QUINCALLERIA',
    unit: 'PZA',
    category: 'Quincallería',
    specification: 'Cerraduras para puertas principales de seguridad y cerraduras de pomo/manija para interiores.',
    components: [
      { id: 'c-44-1', type: 'material', resourceId: 'mat-clavos', description: 'Cerradura Papaiz/Yale completa', unit: 'kg', quantity: 1.0, unitPrice: 140.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-44-2', type: 'labor', resourceId: 'lab-maestro', description: 'Instalador carpintero', unit: 'hh', quantity: 1.2, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-45',
    code: 'ACT-45',
    name: 'INSTALACION ACCESORIOS SANITARIOS',
    unit: 'GBL',
    category: 'Sanitarios',
    specification: 'Portarrollos, toalleros, jaboneras y desagües sifonados para todos los baños.',
    components: [
      { id: 'c-45-1', type: 'material', resourceId: 'mat-ducha-deca', description: 'Juegos de accesorios cromados Deca', unit: 'pza', quantity: 3.0, unitPrice: 120.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-45-2', type: 'labor', resourceId: 'lab-plomero', description: 'Plomero instalador', unit: 'hh', quantity: 8.0, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-46',
    code: 'ACT-46',
    name: 'PROVE INSTALACION PLACAS ELECTRICAS',
    unit: 'PZA',
    category: 'Instalaciones Eléctricas',
    specification: 'Placas modulares blancas Tramontina Liz (interruptores simples, dobles y tomacorrientes con tierra).',
    components: [
      { id: 'c-46-1', type: 'material', resourceId: 'mat-placa-tramontina', description: 'Placa Tramontina Liz blanca', unit: 'pza', quantity: 1.0, unitPrice: 22.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Tramontina Liz' },
      { id: 'c-46-2', type: 'labor', resourceId: 'lab-electricista', description: 'Electricista', unit: 'hh', quantity: 0.35, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-47',
    code: 'ACT-47',
    name: 'ESPEJOS',
    unit: 'M2',
    category: 'Vidriería',
    specification: 'Espejo biselado de cristal flotado e=4mm montado sobre muro con perfiles ocultos.',
    components: [
      { id: 'c-47-1', type: 'material', resourceId: 'mat-vidrio', description: 'Cristal espejo 4mm biselado', unit: 'm2', quantity: 1.0, unitPrice: 190.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-47-2', type: 'labor', resourceId: 'lab-maestro', description: 'Instalador', unit: 'hh', quantity: 1.2, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-48',
    code: 'ACT-48',
    name: 'ZOCALO DE CERAMICA',
    unit: 'ML',
    category: 'Pisos y Revestimientos',
    specification: 'Zócalo de cerámica cortado a 7cm con borde boleado y empaste superior.',
    components: [
      { id: 'c-48-1', type: 'material', resourceId: 'mat-ceramica', description: 'Tiras de zócalo cerámico', unit: 'm2', quantity: 0.10, unitPrice: 48.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-48-2', type: 'labor', resourceId: 'lab-maestro', description: 'Albañil', unit: 'hh', quantity: 0.35, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-49',
    code: 'ACT-49',
    name: 'ZOCALO DE PORCELANATO',
    unit: 'ML',
    category: 'Pisos y Revestimientos',
    specification: 'Zócalo de porcelanato rectificado h=8cm empotrado a plomo con el muro.',
    components: [
      { id: 'c-49-1', type: 'material', resourceId: 'mat-porcelanato', description: 'Zócalo porcelanato cortado', unit: 'm2', quantity: 0.12, unitPrice: 85.00, supplierId: 'sup-industrial-oriente' },
      { id: 'c-49-2', type: 'labor', resourceId: 'lab-maestro', description: 'Albañil colocador', unit: 'hh', quantity: 0.40, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-50',
    code: 'ACT-50',
    name: 'JAMBAS DE MADERA',
    unit: 'ML',
    category: 'Carpintería de Madera',
    specification: 'Jambas molduradas de madera tajibo o cedro para tapar juntas entre marco y revoque.',
    components: [
      { id: 'c-50-1', type: 'material', resourceId: 'mat-madera', description: 'Jambas cepilladas de madera', unit: 'pie2', quantity: 1.2, unitPrice: 8.50, supplierId: 'sup-maderera-oriente' },
      { id: 'c-50-2', type: 'labor', resourceId: 'lab-maestro', description: 'Carpintero instalador', unit: 'hh', quantity: 0.35, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-51',
    code: 'ACT-51',
    name: 'PROV E INSTALACION LAVAMANOS (DECA)',
    unit: 'PZA',
    category: 'Artefactos Sanitarios',
    specification: 'Lavamanos con pedestal blanco línea Deca, grifería monomando y sifón cromado.',
    components: [
      { id: 'c-51-1', type: 'material', resourceId: 'mat-lavamano-deca', description: 'Lavamanos con pedestal Deca blanco', unit: 'pza', quantity: 1.0, unitPrice: 320.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Deca Original' },
      { id: 'c-51-2', type: 'material', resourceId: 'mat-tubo-pvc', description: 'Sifón y flexocople cromado', unit: 'ml', quantity: 1.0, unitPrice: 65.00, supplierId: 'sup-tigre' },
      { id: 'c-51-3', type: 'labor', resourceId: 'lab-plomero', description: 'Plomero instalador', unit: 'hh', quantity: 2.2, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-52',
    code: 'ACT-52',
    name: 'PROV. E INSTALACION INODORO (DECA)',
    unit: 'PZA',
    category: 'Artefactos Sanitarios',
    specification: 'Inodoro de bajo consumo Deca con anillo de cera, pernos y asiento plástico.',
    components: [
      { id: 'c-52-1', type: 'material', resourceId: 'mat-inodoro-deca', description: 'Inodoro con tanque bajo Deca blanco', unit: 'pza', quantity: 1.0, unitPrice: 580.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Deca Original' },
      { id: 'c-52-2', type: 'material', resourceId: 'mat-tubo-pvc', description: 'Anillo de cera y flexocople', unit: 'ml', quantity: 1.0, unitPrice: 45.00, supplierId: 'sup-tigre' },
      { id: 'c-52-3', type: 'labor', resourceId: 'lab-plomero', description: 'Plomero instalador', unit: 'hh', quantity: 2.5, unitPrice: 24.00 }
    ]
  },
  {
    id: 'act-53',
    code: 'ACT-53',
    name: 'ALCANTARILALDO SANITARIO Y PLUVIAL',
    unit: 'GBL',
    category: 'Instalaciones Sanitarias',
    specification: 'Cámaras de inspección de ladrillo revocadas, red colectora de 4" y conexión a red de Saguapac.',
    components: [
      { id: 'c-53-1', type: 'material', resourceId: 'mat-tubo-pvc', description: 'Tuberías PVC 4" y 6" Tigre', unit: 'ml', quantity: 45, unitPrice: 22.00, supplierId: 'sup-tigre', quoteBrand: 'Tigre' },
      { id: 'c-53-2', type: 'material', resourceId: 'mat-ladrillo-6h', description: 'Ladrillos y cemento p/ cámaras', unit: 'pza', quantity: 350, unitPrice: 1.25, supplierId: 'sup-ceranorte' },
      { id: 'c-53-3', type: 'labor', resourceId: 'lab-plomero', description: 'Plomero y albañil', unit: 'hh', quantity: 32, unitPrice: 24.00 },
      { id: 'c-53-4', type: 'labor', resourceId: 'lab-ayudante', description: 'Peones de excavación y zanjado', unit: 'hh', quantity: 40, unitPrice: 15.00 }
    ]
  },
  {
    id: 'act-54',
    code: 'ACT-54',
    name: 'PUNTO DE TV (TRAMONTINA)',
    unit: 'PTO',
    category: 'Instalaciones Eléctricas',
    specification: 'Punto coaxial RG6 con placa y conector Tramontina para televisión por cable.',
    components: [
      { id: 'c-54-1', type: 'material', resourceId: 'mat-placa-tramontina', description: 'Placa con conector coaxial Tramontina', unit: 'pza', quantity: 1.0, unitPrice: 26.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Tramontina Liz' },
      { id: 'c-54-2', type: 'labor', resourceId: 'lab-electricista', description: 'Electricista', unit: 'hh', quantity: 0.8, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-55',
    code: 'ACT-55',
    name: 'PUNTO DE INTERNET (TRAMONTINA)',
    unit: 'PTO',
    category: 'Instalaciones Eléctricas',
    specification: 'Punto de red con cable UTP Categoría 6, conector RJ45 y placa Tramontina Liz.',
    components: [
      { id: 'c-55-1', type: 'material', resourceId: 'mat-placa-tramontina', description: 'Placa RJ45 Cat6 Tramontina', unit: 'pza', quantity: 1.0, unitPrice: 32.00, supplierId: 'sup-industrial-oriente', quoteBrand: 'Tramontina Liz' },
      { id: 'c-55-2', type: 'labor', resourceId: 'lab-electricista', description: 'Electricista instalador de redes', unit: 'hh', quantity: 1.0, unitPrice: 25.00 }
    ]
  },
  {
    id: 'act-56',
    code: 'ACT-56',
    name: 'LIMPIEZA GENERAL CON VOLQUETA',
    unit: 'GBL',
    category: 'Limpieza y Entrega',
    specification: 'Retiro y desalojo de escombros de obra con cuadrilla de peones y volqueta al vertedero municipal de Normandía.',
    components: [
      { id: 'c-56-1', type: 'equipment', resourceId: 'eq-volqueta', description: 'Alquiler volqueta para desalojo (4 viajes)', unit: 'hora', quantity: 12, unitPrice: 120.00 },
      { id: 'c-56-2', type: 'labor', resourceId: 'lab-ayudante', description: 'Peones de carguío y barrido', unit: 'hh', quantity: 32, unitPrice: 15.00 }
    ]
  }
];

// Metrados típicos de referencia para una vivienda unifamiliar de 2 plantas (aprox 280 m2) en Santa Cruz
export const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
  { id: 'b-1', apuItemId: 'act-1', itemNumber: 1, quantity: 1.0, notes: 'Caseta y perímetro provisorio' },
  { id: 'b-2', apuItemId: 'act-2', itemNumber: 2, quantity: 1.0, notes: 'Replanteo general de ejes' },
  { id: 'b-3', apuItemId: 'act-3', itemNumber: 3, quantity: 48.5, notes: 'Zapatas y zanjas de cimiento' },
  { id: 'b-4', apuItemId: 'act-4', itemNumber: 4, quantity: 16.2, notes: '14 zapatas aisladas fck=210' },
  { id: 'b-5', apuItemId: 'act-5', itemNumber: 5, quantity: 12.8, notes: 'Columnas planta baja' },
  { id: 'b-6', apuItemId: 'act-6', itemNumber: 6, quantity: 14.5, notes: 'Vigas de fundación en suelo' },
  { id: 'b-7', apuItemId: 'act-7', itemNumber: 7, quantity: 95.0, notes: 'Corona de vigas contra humedad' },
  { id: 'b-8', apuItemId: 'act-8', itemNumber: 8, quantity: 11.2, notes: 'Columnas planta alta' },
  { id: 'b-9', apuItemId: 'act-9', itemNumber: 9, quantity: 42.0, notes: 'Relleno compactado bajo piso' },
  { id: 'b-10', apuItemId: 'act-10', itemNumber: 10, quantity: 18.4, notes: 'Vigas de entrepiso y cubierta' },
  { id: 'b-11', apuItemId: 'act-11', itemNumber: 11, quantity: 18.0, notes: 'Viga metálica en galería y garaje' },
  { id: 'b-12', apuItemId: 'act-12', itemNumber: 12, quantity: 155.0, notes: 'Losa entrepiso vigueta pretensada' },
  { id: 'b-13', apuItemId: 'act-13', itemNumber: 13, quantity: 4.5, notes: 'Columnas de remate superior' },
  { id: 'b-14', apuItemId: 'act-14', itemNumber: 14, quantity: 6.8, notes: 'Encadenado superior bajo techo' },
  { id: 'b-15', apuItemId: 'act-15', itemNumber: 15, quantity: 4.8, notes: 'Gradas principales H°A°' },
  { id: 'b-16', apuItemId: 'act-16', itemNumber: 16, quantity: 165.0, notes: 'Contrapiso nivelador sobre losa' },
  { id: 'b-17', apuItemId: 'act-17', itemNumber: 17, quantity: 1.0, notes: 'Tijerales de madera tajibo' },
  { id: 'b-18', apuItemId: 'act-18', itemNumber: 18, quantity: 32.0, notes: 'Cumbreras cerámicas' },
  { id: 'b-19', apuItemId: 'act-19', itemNumber: 19, quantity: 185.0, notes: 'Techo teja colonial Incerpaz' },
  { id: 'b-20', apuItemId: 'act-20', itemNumber: 20, quantity: 380.0, notes: 'Muros perimetrales e interiores' },
  { id: 'b-21', apuItemId: 'act-21', itemNumber: 21, quantity: 1.0, notes: 'Entubado sanitario agua y desagüe' },
  { id: 'b-22', apuItemId: 'act-22', itemNumber: 22, quantity: 1.0, notes: 'Enductado eléctrico losa y muros' },
  { id: 'b-23', apuItemId: 'act-23', itemNumber: 23, quantity: 620.0, notes: 'Revoque interior frotachado' },
  { id: 'b-24', apuItemId: 'act-24', itemNumber: 24, quantity: 1.0, notes: 'Puerta principal tajibo' },
  { id: 'b-25', apuItemId: 'act-25', itemNumber: 25, quantity: 8.0, notes: 'Puertas interiores dormitorios/baños' },
  { id: 'b-26', apuItemId: 'act-26', itemNumber: 26, quantity: 2.0, notes: 'Puertas metálicas de servicio' },
  { id: 'b-27', apuItemId: 'act-27', itemNumber: 27, quantity: 42.0, notes: 'Ventanales y mamparas de vidrio' },
  { id: 'b-28', apuItemId: 'act-28', itemNumber: 28, quantity: 3.0, notes: 'Box de ducha templado' },
  { id: 'b-29', apuItemId: 'act-29', itemNumber: 29, quantity: 95.0, notes: 'Empedrado y contrapiso garaje' },
  { id: 'b-30', apuItemId: 'act-30', itemNumber: 30, quantity: 26.0, notes: 'Dinteles de aberturas' },
  { id: 'b-31', apuItemId: 'act-31', itemNumber: 31, quantity: 180.0, notes: 'Cielo falso placa Durlock' },
  { id: 'b-32', apuItemId: 'act-32', itemNumber: 32, quantity: 35.0, notes: 'Aleros perimetrales' },
  { id: 'b-33', apuItemId: 'act-33', itemNumber: 33, quantity: 280.0, notes: 'Revoque exterior impermeable' },
  { id: 'b-34', apuItemId: 'act-34', itemNumber: 34, quantity: 7.5, notes: 'Mesones granito cocina y baños' },
  { id: 'b-35', apuItemId: 'act-35', itemNumber: 35, quantity: 3.2, notes: 'Isla desayunador granito negro' },
  { id: 'b-36', apuItemId: 'act-36', itemNumber: 36, quantity: 38.0, notes: 'Canaletas y bajantes pluviales' },
  { id: 'b-37', apuItemId: 'act-37', itemNumber: 37, quantity: 3.0, notes: 'Duchas Deca cromadas' },
  { id: 'b-38', apuItemId: 'act-38', itemNumber: 38, quantity: 195.0, notes: 'Pisos porcelanato 60x60' },
  { id: 'b-39', apuItemId: 'act-39', itemNumber: 39, quantity: 75.0, notes: 'Revestimiento paredes de baño' },
  { id: 'b-40', apuItemId: 'act-40', itemNumber: 40, quantity: 35.0, notes: 'Cerámica lavandería y servicio' },
  { id: 'b-41', apuItemId: 'act-41', itemNumber: 41, quantity: 1.0, notes: 'Cableado y tablero general' },
  { id: 'b-42', apuItemId: 'act-42', itemNumber: 42, quantity: 850.0, notes: 'Pintura látex interior y exterior' },
  { id: 'b-43', apuItemId: 'act-43', itemNumber: 43, quantity: 12.0, notes: 'Barandado de madera escalera' },
  { id: 'b-44', apuItemId: 'act-44', itemNumber: 44, quantity: 11.0, notes: 'Chapas y quincallería completa' },
  { id: 'b-45', apuItemId: 'act-45', itemNumber: 45, quantity: 1.0, notes: 'Accesorios y griferías de baño' },
  { id: 'b-46', apuItemId: 'act-46', itemNumber: 46, quantity: 45.0, notes: 'Placas y tomas Tramontina Liz' },
  { id: 'b-47', apuItemId: 'act-47', itemNumber: 47, quantity: 6.5, notes: 'Espejos biselados para baños' },
  { id: 'b-48', apuItemId: 'act-48', itemNumber: 48, quantity: 32.0, notes: 'Zócalo de cerámica' },
  { id: 'b-49', apuItemId: 'act-49', itemNumber: 49, quantity: 110.0, notes: 'Zócalo de porcelanato' },
  { id: 'b-50', apuItemId: 'act-50', itemNumber: 50, quantity: 72.0, notes: 'Jambas molduradas de madera' },
  { id: 'b-51', apuItemId: 'act-51', itemNumber: 51, quantity: 4.0, notes: 'Lavamanos Deca con grifería' },
  { id: 'b-52', apuItemId: 'act-52', itemNumber: 52, quantity: 4.0, notes: 'Inodoros Deca ecológicos' },
  { id: 'b-53', apuItemId: 'act-53', itemNumber: 53, quantity: 1.0, notes: 'Cámaras sépticas y alcantarillado' },
  { id: 'b-54', apuItemId: 'act-54', itemNumber: 54, quantity: 6.0, notes: 'Puntos de TV Tramontina' },
  { id: 'b-55', apuItemId: 'act-55', itemNumber: 55, quantity: 6.0, notes: 'Puntos de red RJ45 Tramontina' },
  { id: 'b-56', apuItemId: 'act-56', itemNumber: 56, quantity: 1.0, notes: 'Desalojo de escombros final' }
];

export const INITIAL_PROJECT_INFO: ProjectInfo = {
  id: 'proj-scz-01',
  name: 'Vivienda Unifamiliar Las Palmas - Santa Cruz',
  client: 'Familia Suárez Roca',
  location: 'Condominio La Hacienda del Urubó / Las Palmas',
  city: 'Santa Cruz de la Sierra, Bolivia',
  date: 'Octubre 2026',
  supervisor: 'Ing. Civil Residente (SIB Santa Cruz)',
  currency: 'Bs.',
  economicParameters: INITIAL_ECONOMIC_PARAMETERS
};
