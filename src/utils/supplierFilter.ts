import { Supplier, SupplierQuote } from '../types/apu';

export type MaterialDomainCategory =
  | 'cemento'
  | 'acero'
  | 'ladrillo_ceramica'
  | 'aridos'
  | 'maderas'
  | 'plomeria'
  | 'ferreteria_general';

/**
 * Determina el dominio estricto de un insumo/material en el mercado de Santa Cruz.
 */
export function getMaterialDomain(
  material: { id?: string; name: string; category?: string } | string
): MaterialDomainCategory {
  const name = typeof material === 'string' ? material.toLowerCase() : material.name.toLowerCase();
  const cat = typeof material === 'object' && material.category ? material.category.toLowerCase() : '';
  const id = typeof material === 'object' && material.id ? material.id.toLowerCase() : '';

  // 1. Cemento y aglomerantes
  if (
    id.includes('cemento') ||
    id.includes('yeso') ||
    id.includes('cal') ||
    cat.includes('aglomerante') ||
    name.includes('cemento') ||
    name.includes('yeso') ||
    name.includes('cal')
  ) {
    return 'cemento';
  }

  // 2. Acero / Fierro Corrugado / Alambre / Metales
  if (
    id.includes('fierro') ||
    id.includes('acero') ||
    id.includes('alambre') ||
    id.includes('clavo') ||
    id.includes('costanera') ||
    id.includes('viga-metalica') ||
    cat.includes('acero') ||
    cat.includes('metales') ||
    name.includes('fierro') ||
    name.includes('acero') ||
    name.includes('alambre') ||
    name.includes('clavo') ||
    name.includes('malla electrosoldada') ||
    name.includes('costanera') ||
    name.includes('perfil metálico')
  ) {
    return 'acero';
  }

  // 3. Ladrillos y Cerámicas
  if (
    id.includes('ladrillo') ||
    id.includes('teja') ||
    id.includes('cumbrera') ||
    id.includes('ceramica') ||
    id.includes('porcelanato') ||
    id.includes('azulejo') ||
    cat.includes('mampostería') ||
    cat.includes('cerámica') ||
    cat.includes('cubiertas cerámicas') ||
    name.includes('ladrillo') ||
    name.includes('teja') ||
    name.includes('cumbrera') ||
    name.includes('cerámica') ||
    name.includes('porcelanato') ||
    name.includes('bovedilla')
  ) {
    return 'ladrillo_ceramica';
  }

  // 4. Áridos (Arena, Grava, Ripio, Piedra)
  if (
    id.includes('arena') ||
    id.includes('ripio') ||
    id.includes('grava') ||
    id.includes('piedra') ||
    cat.includes('árido') ||
    name.includes('arena') ||
    name.includes('ripio') ||
    name.includes('grava') ||
    name.includes('piedra')
  ) {
    return 'aridos';
  }

  // 5. Maderas
  if (
    id.includes('madera') ||
    id.includes('puerta') ||
    id.includes('jamba') ||
    cat.includes('carpintería') ||
    cat.includes('maderas') ||
    name.includes('madera') ||
    name.includes('tajibo') ||
    name.includes('ochoó') ||
    name.includes('puerta') ||
    name.includes('jamba')
  ) {
    return 'maderas';
  }

  // 6. Plomería y Sanitarios
  if (
    id.includes('pvc') ||
    id.includes('tubo') ||
    cat.includes('plomería') ||
    name.includes('pvc') ||
    name.includes('tubería')
  ) {
    return 'plomeria';
  }

  // 7. Ferretería General & Acabados
  return 'ferreteria_general';
}

/**
 * Filtra estrictamente los proveedores permitidos para un material según las normas del mercado cruceño:
 * - Cemento: Estrictamente SOBOCE, FANCESA, ITAMBA (Cementeras). Prohibido ladrillo o acero.
 * - Acero: Estrictamente Las Lomas, Monterrey, Aceros Arequipa, Casa del Fierro (Aceros y Metales). Prohibido cementeras o ladrilleras.
 * - Ladrillos: Estrictamente INCERPAZ, Cerámica Norte, Cerámica Itauguá (Cerámica y Ladrillos). Prohibido marcas de cemento o acero.
 * - Áridos: Estrictamente Canteras autorizadas de Río Piraí.
 * - Resto: Proveedores autorizados de ferretería general / especialidad con respaldo CADECOCRUZ.
 */
export function getValidSuppliersForMaterial(
  material: { id?: string; name: string; category?: string; quotes?: SupplierQuote[] },
  allSuppliers: Supplier[]
): Supplier[] {
  const domain = getMaterialDomain(material);

  let filtered = allSuppliers.filter(supplier => {
    const sCat = supplier.category.toLowerCase();
    const sName = supplier.name.toLowerCase();

    switch (domain) {
      case 'cemento':
        // Estrictamente fábricas de cemento o distribuidores autorizados de cemento
        return (
          sCat.includes('cementera') ||
          sName.includes('soboce') ||
          sName.includes('fancesa') ||
          sName.includes('itacamba') ||
          sName.includes('itamba')
        );

      case 'acero':
        // Estrictamente distribuidoras de acero y metales
        return (
          sCat.includes('acero') ||
          sCat.includes('metal') ||
          sName.includes('lomas') ||
          sName.includes('monterrey') ||
          sName.includes('arequipa') ||
          sName.includes('fierro')
        );

      case 'ladrillo_ceramica':
        // Estrictamente industrias cerámicas y ladrilleras
        return (
          sCat.includes('cerámica') ||
          sCat.includes('ladrillo') ||
          sName.includes('incerpaz') ||
          sName.includes('norte') ||
          sName.includes('itaugua')
        );

      case 'aridos':
        // Canteras y asociaciones autorizadas de la zona
        return (
          sCat.includes('árido') ||
          sCat.includes('cantera') ||
          sName.includes('piraí') ||
          sName.includes('cantera')
        );

      case 'maderas':
        return (
          sCat.includes('madera') ||
          sCat.includes('carpintería') ||
          sName.includes('maderera')
        );

      case 'plomeria':
        return (
          sCat.includes('plomería') ||
          sCat.includes('tubería') ||
          sName.includes('tigre') ||
          sName.includes('tubocentro') ||
          sCat.includes('ferretería general')
        );

      case 'ferreteria_general':
      default:
        // Ferreterías generales, quincallería y acabados. Excluir cementeras puras, acereras puras y ladrilleras puras.
        return (
          !sCat.includes('cementera') &&
          !sCat.includes('acero') &&
          !sCat.includes('cerámica y ladrillos') &&
          !sCat.includes('árido')
        );
    }
  });

  // Si el material tiene quotes explícitos, asegurar que los proveedores de los quotes estén incluidos
  if (material.quotes && material.quotes.length > 0) {
    const quoteSupplierIds = new Set(material.quotes.map(q => q.supplierId));
    const quoteSuppliers = allSuppliers.filter(s => quoteSupplierIds.has(s.id));
    const existingIds = new Set(filtered.map(s => s.id));
    for (const qs of quoteSuppliers) {
      if (!existingIds.has(qs.id)) {
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
 * Devuelve una etiqueta amigable y el color de insignia del dominio
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
        allowedHint: 'Exclusivo Fábricas: SOBOCE · FANCESA · ITAMBA'
      };
    case 'acero':
      return {
        label: 'Acero & Metales',
        badgeBg: 'bg-blue-100 border-blue-300',
        badgeText: 'text-blue-900',
        allowedHint: 'Exclusivo Acereras: Las Lomas · Monterrey · Aceros Arequipa · Casa del Fierro'
      };
    case 'ladrillo_ceramica':
      return {
        label: 'Ladrillos & Cerámicas',
        badgeBg: 'bg-orange-100 border-orange-300',
        badgeText: 'text-orange-900',
        allowedHint: 'Exclusivo Ladrilleras: INCERPAZ · Cerámica Norte · Cerámica Itauguá'
      };
    case 'aridos':
      return {
        label: 'Áridos & Cantera',
        badgeBg: 'bg-stone-100 border-stone-300',
        badgeText: 'text-stone-900',
        allowedHint: 'Exclusivo Canteras: Río Piraí'
      };
    case 'maderas':
      return {
        label: 'Maderas de Construcción',
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
