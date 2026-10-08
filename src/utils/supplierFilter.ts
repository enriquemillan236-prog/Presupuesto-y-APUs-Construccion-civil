import { Supplier, SupplierQuote } from '../types/apu';

export type MaterialDomainCategory =
  | 'cemento'
  | 'acero'
  | 'ladrillos_obra_gruesa'
  | 'pisos_porcelanatos_banos'
  | 'impermeabilizantes_piedras'
  | 'aridos'
  | 'maderas'
  | 'plomeria'
  | 'electricidad'
  | 'ferreteria_general';

/**
 * Determina el dominio estricto de un insumo/material en el mercado de Santa Cruz de la Sierra.
 */
export function getMaterialDomain(
  material: { id?: string; name: string; category?: string } | string
): MaterialDomainCategory {
  const name = (typeof material === 'string' ? material : material.name).toLowerCase();
  const cat = (typeof material === 'object' && material.category ? material.category : '').toLowerCase();
  const id = (typeof material === 'object' && material.id ? material.id : '').toLowerCase();

  // Distinguir adhesivo "cemento cola" de "cemento Portland"
  const isCementoCola =
    name.includes('cemento cola') ||
    name.includes('pegamento') ||
    cat.includes('pegamentos') ||
    id.includes('pegamento');

  // 1. Cemento y Aglomerantes (Exclusivo Soboce / Fancesa / Itacamba / Comercial SCZ)
  if (
    !isCementoCola &&
    (id.includes('cemento') ||
      id.includes('yeso') ||
      id.includes('cal') ||
      cat.includes('aglomerante') ||
      name.includes('cemento ip') ||
      name.includes('cemento portland') ||
      name.includes('yeso') ||
      name.includes('cal viva') ||
      name.includes('cal hidratada') ||
      (name.includes('cemento') && !name.includes('cola')))
  ) {
    return 'cemento';
  }

  // 2. Pisos, Porcelanatos, Revestimientos y Baños (Exclusivo GLADYMAR, ROHO, IMPORTACRUZ, CERABOL)
  if (
    id.includes('porcelanato') ||
    id.includes('ceramica') ||
    id.includes('inodoro') ||
    id.includes('lavamano') ||
    id.includes('ducha') ||
    cat.includes('pisos, porcelanatos, revestimientos y baños') ||
    cat.includes('artefactos sanitarios') ||
    cat.includes('vidriería y sanitarios') ||
    name.includes('porcelanato') ||
    name.includes('piso porcelanato') ||
    name.includes('revestimiento de porcelanato') ||
    name.includes('cerámica esmaltada') ||
    name.includes('ceramica esmaltada') ||
    name.includes('piso cerámica') ||
    name.includes('piso ceramica') ||
    name.includes('zócalo') ||
    name.includes('zocalo') ||
    name.includes('inodoro') ||
    name.includes('lavamanos') ||
    name.includes('lavamano') ||
    name.includes('ducha') ||
    name.includes('box de bano') ||
    name.includes('box de baño') ||
    name.includes('deca') ||
    name.includes('sanitario') ||
    name.includes('loza vitrificada')
  ) {
    return 'pisos_porcelanatos_banos';
  }

  // 3. Impermeabilizantes y Piedras Sinterizadas (Exclusivo IMPORTACRUZ con Bautech, GLADYMAR, El Constructor)
  if (
    id.includes('granito') ||
    id.includes('impermeab') ||
    cat.includes('impermeabilizantes y piedras sinterizadas') ||
    cat.includes('aislaciones') ||
    name.includes('granito') ||
    name.includes('piedra sinterizada') ||
    name.includes('sinterizada') ||
    name.includes('mesón de granito') ||
    name.includes('meson de granito') ||
    name.includes('isla de cocina') ||
    name.includes('impermeabilizante') ||
    name.includes('bautech') ||
    name.includes('manta líquida') ||
    name.includes('manta liquida') ||
    name.includes('igol') ||
    name.includes('hidrófugo')
  ) {
    return 'impermeabilizantes_piedras';
  }

  // 4. Ladrillos y Obra Gruesa (Exclusivo INCERPAZ, Cerámica Norte, Cerámica Itauguá)
  if (
    id.includes('ladrillo') ||
    id.includes('teja') ||
    id.includes('cumbrera') ||
    cat.includes('mampostería') ||
    cat.includes('ladrillos y obra gruesa') ||
    cat.includes('cubiertas') ||
    name.includes('ladrillo') ||
    name.includes('6 huecos') ||
    name.includes('teja colonial') ||
    name.includes('teja') ||
    name.includes('cumbrera') ||
    name.includes('bovedilla')
  ) {
    return 'ladrillos_obra_gruesa';
  }

  // 5. Acero / Fierro Corrugado / Alambre / Metales (Exclusivo Las Lomas, Monterrey, Aceros Arequipa, Casa del Fierro)
  if (
    id.includes('fierro') ||
    id.includes('acero') ||
    id.includes('alambre') ||
    id.includes('costanera') ||
    id.includes('viga-metalica') ||
    cat.includes('acero') ||
    cat.includes('metales') ||
    cat.includes('estructuras metálicas') ||
    name.includes('fierro corrugado') ||
    name.includes('acero estructural') ||
    name.includes('fierro') ||
    name.includes('alambre') ||
    name.includes('malla electrosoldada') ||
    name.includes('costanera') ||
    name.includes('perfil metálico') ||
    name.includes('perfil metalico') ||
    name.includes('viga metálica') ||
    name.includes('viga metalica')
  ) {
    return 'acero';
  }

  // 6. Áridos (Arena, Grava, Ripio, Piedra de Río Piraí)
  if (
    id.includes('arena') ||
    id.includes('ripio') ||
    id.includes('grava') ||
    id.includes('piedra') ||
    cat.includes('árido') ||
    cat.includes('aridos') ||
    name.includes('arena') ||
    name.includes('ripio') ||
    name.includes('grava') ||
    name.includes('piedra')
  ) {
    return 'aridos';
  }

  // 7. Maderas y Carpintería (Exclusivo Maderera El Oriente)
  if (
    id.includes('madera') ||
    id.includes('puerta-prin') ||
    id.includes('puerta-int') ||
    id.includes('jamba') ||
    cat.includes('carpintería de madera') ||
    cat.includes('maderas') ||
    name.includes('madera') ||
    name.includes('tajibo') ||
    name.includes('ochoó') ||
    name.includes('ochoo') ||
    name.includes('puerta principal') ||
    name.includes('puerta interior') ||
    name.includes('puerta de madera') ||
    name.includes('puerta placa') ||
    name.includes('jamba') ||
    name.includes('alero') ||
    name.includes('barandado de madera')
  ) {
    return 'maderas';
  }

  // 8. Plomería y Tuberías (Exclusivo Plásticos Tigre / TuboCentro)
  if (
    id.includes('pvc') ||
    id.includes('tubo') ||
    cat.includes('plomería') ||
    cat.includes('instalaciones sanitarias') ||
    name.includes('pvc') ||
    name.includes('tubería') ||
    name.includes('tuberia') ||
    name.includes('alcantarillado')
  ) {
    return 'plomeria';
  }

  // 9. Electricidad e Iluminación (Exclusivo Ferretería Industrial del Oriente / Tramontina)
  if (
    id.includes('cable') ||
    id.includes('placa-tramontina') ||
    cat.includes('instalaciones eléctricas') ||
    cat.includes('electricidad') ||
    name.includes('cable') ||
    name.includes('tramontina') ||
    name.includes('eléctrico') ||
    name.includes('electrico') ||
    name.includes('enchufe') ||
    name.includes('tomacorriente') ||
    name.includes('interruptor') ||
    name.includes('térmico') ||
    name.includes('termico') ||
    name.includes('punto de tv') ||
    name.includes('punto de internet')
  ) {
    return 'electricidad';
  }

  // 10. Ferretería General, Pinturas, Químicos y Acabados Generales
  return 'ferreteria_general';
}

/**
 * Filtra estrictamente los proveedores permitidos para un material según las normas del mercado de Santa Cruz:
 *
 * 1. Cemento y Aglomerantes: Exclusivamente SOBOCE, FANCESA, ITAMBA / ITACAMBA (o Comercial Santa Cruz Materiales).
 *    PROHIBIDO mostrar empresas de acero o cerámica/ladrillo.
 *
 * 2. Acero / Fierro Corrugado / Alambre: Exclusivamente Aceros Las Lomas S.A., Importadora Monterrey,
 *    Aceros Arequipa, Casa del Fierro. PROHIBIDO mostrar cementeras o ladrilleras.
 *
 * 3. Ladrillos y Obra Gruesa: Exclusivamente industrias cerámicas y ladrilleras INCERPAZ, Cerámica Norte,
 *    Cerámica Itauguá. PROHIBIDO marcas de cemento o acero.
 *
 * 4. Pisos, Porcelanatos, Revestimientos y Baños: Exclusivamente GLADYMAR, ROHO Homecenter, IMPORTACRUZ, CERABOL.
 *    PROHIBIDO mostrar marcas de cemento, acero o ladrilleras de obra gruesa.
 *
 * 5. Impermeabilizantes y Piedras Sinterizadas: IMPORTACRUZ (Bautech / piedras sinterizadas), GLADYMAR (granitos),
 *    Ferretería El Constructor (químicos para construcción).
 *
 * 6. Áridos y Canteras: Áridos y Cantera Río Piraí (con respaldo referencial CADECOCRUZ).
 *
 * 7. Maderas y Puertas: Maderera El Oriente & Carpintería.
 *
 * 8. Plomería y Tuberías: Plásticos Tigre / TuboCentro Santa Cruz, Ferretería El Constructor.
 *
 * 9. Electricidad: Ferretería Industrial del Oriente (Tramontina Liz), Ferretería El Constructor.
 *
 * 10. Resto / Ferretería General: Ferretería El Constructor, Comercial Santa Cruz, Ferretería Industrial del Oriente.
 */
export function getValidSuppliersForMaterial(
  material: { id?: string; name: string; category?: string; quotes?: SupplierQuote[] },
  allSuppliers: Supplier[]
): Supplier[] {
  const domain = getMaterialDomain(material);

  let filtered = allSuppliers.filter(supplier => {
    const sCat = supplier.category.toLowerCase();
    const sName = supplier.name.toLowerCase();
    const sId = supplier.id.toLowerCase();

    switch (domain) {
      case 'cemento':
        // Estrictamente fábricas de cemento o distribuidores autorizados de cemento
        return (
          sCat.includes('cementera') ||
          sCat.includes('materiales pesados y cemento') ||
          sId === 'sup-soboce' ||
          sId === 'sup-fancesa' ||
          sId === 'sup-itacamba' ||
          sId === 'sup-comercial-scz' ||
          sName.includes('soboce') ||
          sName.includes('fancesa') ||
          sName.includes('itacamba') ||
          sName.includes('itamba')
        );

      case 'acero':
        // Estrictamente distribuidoras autorizadas de acero y metales
        return (
          sCat.includes('aceros y metales') ||
          sId === 'sup-laslomas' ||
          sId === 'sup-monterrey' ||
          sId === 'sup-arequipa' ||
          sId === 'sup-casadelfierro' ||
          sName.includes('lomas') ||
          sName.includes('monterrey') ||
          sName.includes('arequipa') ||
          sName.includes('casa del fierro')
        );

      case 'ladrillos_obra_gruesa':
        // Estrictamente industrias cerámicas y ladrilleras de obra gruesa (Ladrillo 6H, Tejas, Cumbreras)
        return (
          (sCat.includes('ladrillos') || sCat.includes('cerámica y ladrillos')) &&
          (sId === 'sup-incerpaz' ||
            sId === 'sup-ceranorte' ||
            sId === 'sup-ceraitaugua' ||
            sName.includes('incerpaz') ||
            sName.includes('norte') ||
            sName.includes('itaugua') ||
            sName.includes('itauguá'))
        );

      case 'pisos_porcelanatos_banos':
        // Estrictamente GLADYMAR, ROHO Homecenter, IMPORTACRUZ, CERABOL
        return (
          sCat.includes('pisos, porcelanatos, revestimientos y baños') ||
          sId === 'sup-gladymar' ||
          sId === 'sup-roho' ||
          sId === 'sup-importacruz' ||
          sId === 'sup-cerabol' ||
          sName.includes('gladymar') ||
          sName.includes('roho') ||
          sName.includes('importacruz') ||
          sName.includes('cerabol')
        );

      case 'impermeabilizantes_piedras':
        // Exclusivamente Importacruz (Bautech y piedras sinterizadas), Gladymar (granito) y Ferretería El Constructor
        return (
          sId === 'sup-importacruz' ||
          sId === 'sup-gladymar' ||
          sId === 'sup-constructor' ||
          sName.includes('importacruz') ||
          sName.includes('gladymar') ||
          sName.includes('constructor')
        );

      case 'aridos':
        // Canteras y asociaciones autorizadas de la cuenca del Río Piraí
        return (
          sCat.includes('árido') ||
          sCat.includes('cantera') ||
          sId === 'sup-aridos-pirai' ||
          sName.includes('piraí') ||
          sName.includes('pirai') ||
          sName.includes('cantera')
        );

      case 'maderas':
        // Barracas y carpinterías autorizadas
        return (
          sCat.includes('madera') ||
          sCat.includes('carpintería') ||
          sId === 'sup-maderera-oriente' ||
          sName.includes('maderera')
        );

      case 'plomeria':
        // Plásticos Tigre / TuboCentro y ferreterías especializadas
        return (
          sCat.includes('plomería') ||
          sCat.includes('tubería') ||
          sId === 'sup-tigre' ||
          sId === 'sup-constructor' ||
          sName.includes('tigre') ||
          sName.includes('tubocentro')
        );

      case 'electricidad':
        // Ferretería Industrial del Oriente (distribuidor Tramontina Liz) y El Constructor
        return (
          sId === 'sup-industrial-oriente' ||
          sId === 'sup-constructor' ||
          sName.includes('industrial del oriente') ||
          sName.includes('constructor')
        );

      case 'ferreteria_general':
      default:
        // Ferreterías generales autorizadas. Excluir expresamente cementeras puras, acereras puras y ladrilleras puras.
        return (
          !sCat.includes('cementera') &&
          !sCat.includes('acero') &&
          !sCat.includes('ladrillos y obra gruesa') &&
          !sCat.includes('árido') &&
          !sCat.includes('pisos, porcelanatos') &&
          (sCat.includes('ferretería') ||
            sCat.includes('materiales pesados') ||
            sCat.includes('quincallería') ||
            sId === 'sup-constructor' ||
            sId === 'sup-comercial-scz' ||
            sId === 'sup-industrial-oriente')
        );
    }
  });

  // Si el material tiene cotizaciones explícitas configuradas que pertenecen al dominio, asegurar que figuren
  if (material.quotes && material.quotes.length > 0) {
    const quoteSupplierIds = new Set(material.quotes.map(q => q.supplierId));
    const quoteSuppliers = allSuppliers.filter(s => quoteSupplierIds.has(s.id));
    const existingIds = new Set(filtered.map(s => s.id));
    for (const qs of quoteSuppliers) {
      if (!existingIds.has(qs.id)) {
        // Verificar que el quote supplier pertenezca al dominio y no sea un cruce erróneo
        const sCat = qs.category.toLowerCase();
        if (domain === 'cemento' && (sCat.includes('acero') || sCat.includes('ladrillo') || sCat.includes('porcelanato'))) {
          continue;
        }
        if (domain === 'acero' && (sCat.includes('cemento') || sCat.includes('ladrillo') || sCat.includes('porcelanato'))) {
          continue;
        }
        if (domain === 'ladrillos_obra_gruesa' && (sCat.includes('cemento') || sCat.includes('acero') || sCat.includes('porcelanato'))) {
          continue;
        }
        if (domain === 'pisos_porcelanatos_banos' && (sCat.includes('cemento') || sCat.includes('acero') || sCat.includes('ladrillos y obra gruesa'))) {
          continue;
        }
        filtered.push(qs);
      }
    }
  }

  // Fallback seguro si la lista queda vacía
  if (filtered.length === 0) {
    filtered = allSuppliers.filter(s => s.category.toLowerCase().includes('ferretería'));
  }

  return filtered;
}

/**
 * Devuelve la insignia visual e información del dominio estricto del insumo para Santa Cruz
 */
export function getDomainBadgeInfo(domain: MaterialDomainCategory): {
  label: string;
  badgeBg: string;
  badgeText: string;
  allowedHint: string;
} {
  switch (domain) {
    case 'cemento':
      return {
        label: 'Cemento & Aglomerantes',
        badgeBg: 'bg-amber-100 border-amber-300',
        badgeText: 'text-amber-900',
        allowedHint: 'Exclusivo Fábricas: SOBOCE · FANCESA · ITAMBA / ITACAMBA'
      };
    case 'acero':
      return {
        label: 'Acero & Metales',
        badgeBg: 'bg-blue-100 border-blue-300',
        badgeText: 'text-blue-900',
        allowedHint: 'Exclusivo Acereras: Las Lomas · Monterrey · Aceros Arequipa · Casa del Fierro'
      };
    case 'ladrillos_obra_gruesa':
      return {
        label: 'Ladrillos & Obra Gruesa',
        badgeBg: 'bg-orange-100 border-orange-300',
        badgeText: 'text-orange-900',
        allowedHint: 'Exclusivo Ladrilleras: INCERPAZ · Cerámica Norte · Cerámica Itauguá'
      };
    case 'pisos_porcelanatos_banos':
      return {
        label: 'Pisos, Porcelanatos & Baños',
        badgeBg: 'bg-teal-100 border-teal-300',
        badgeText: 'text-teal-900',
        allowedHint: 'Exclusivo: GLADYMAR · ROHO Homecenter · IMPORTACRUZ · CERABOL'
      };
    case 'impermeabilizantes_piedras':
      return {
        label: 'Impermeabilizantes & Piedras',
        badgeBg: 'bg-indigo-100 border-indigo-300',
        badgeText: 'text-indigo-900',
        allowedHint: 'Exclusivo: IMPORTACRUZ (Bautech/Piedras) · GLADYMAR · El Constructor'
      };
    case 'aridos':
      return {
        label: 'Áridos & Cantera',
        badgeBg: 'bg-stone-100 border-stone-300',
        badgeText: 'text-stone-900',
        allowedHint: 'Exclusivo Canteras: Río Piraí (con respaldo CADECOCRUZ)'
      };
    case 'maderas':
      return {
        label: 'Maderas & Carpintería',
        badgeBg: 'bg-emerald-100 border-emerald-300',
        badgeText: 'text-emerald-900',
        allowedHint: 'Exclusivo Madereras: Maderera El Oriente'
      };
    case 'plomeria':
      return {
        label: 'Plomería & Tuberías',
        badgeBg: 'bg-cyan-100 border-cyan-300',
        badgeText: 'text-cyan-900',
        allowedHint: 'Exclusivo Tuberías: Plásticos Tigre / TuboCentro'
      };
    case 'electricidad':
      return {
        label: 'Electricidad & Iluminación',
        badgeBg: 'bg-yellow-100 border-yellow-300',
        badgeText: 'text-yellow-900',
        allowedHint: 'Exclusivo: Ferretería Industrial del Oriente (Tramontina) · El Constructor'
      };
    case 'ferreteria_general':
    default:
      return {
        label: 'Ferretería General & CADECOCRUZ',
        badgeBg: 'bg-slate-100 border-slate-300',
        badgeText: 'text-slate-800',
        allowedHint: 'Ferreterías autorizadas con respaldo de precios CADECOCRUZ'
      };
  }
}

