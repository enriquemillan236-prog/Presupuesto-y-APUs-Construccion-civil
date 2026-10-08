import {
  APUItem,
  APUCalculationResult,
  EconomicParameters,
  BudgetItem,
  Supplier,
  ConsolidatedPurchaseItem,
  SupplierPurchaseOrder
} from '../types/apu';

/**
 * Realiza el cálculo formal de un Análisis de Precios Unitarios (APU)
 * bajo la metodología boliviana del SABS (Formulario B-2)
 */
export function calculateAPU(
  item: APUItem,
  projectParams: EconomicParameters
): APUCalculationResult {
  const params: EconomicParameters = {
    ...projectParams,
    ...(item.customParameters || {})
  };

  // 1. MATERIALES
  const materials = item.components.filter(c => c.type === 'material');
  const materialsTotal = materials.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0);

  // 2. MANO DE OBRA
  const labor = item.components.filter(c => c.type === 'labor');
  const laborBaseTotal = labor.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0);
  const socialChargesAmount = laborBaseTotal * (params.socialChargesPercent / 100);
  const laborWithSocial = laborBaseTotal + socialChargesAmount;
  const vatLaborAmount = laborWithSocial * (params.vatLaborPercent / 100);
  const laborTotal = laborWithSocial + vatLaborAmount;

  // 3. MAQUINARIA, EQUIPOS Y HERRAMIENTAS
  const equipment = item.components.filter(c => c.type === 'equipment');
  const equipmentDirectTotal = equipment.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0);
  // En Bolivia las herramientas menores se calculan típicamente como % sobre la Mano de Obra Base
  const minorToolsAmount = laborBaseTotal * (params.minorToolsPercent / 100);
  const equipmentTotal = equipmentDirectTotal + minorToolsAmount;

  // COSTO DIRECTO TOTAL
  const directCost = materialsTotal + laborTotal + equipmentTotal;

  // 4. GASTOS GENERALES
  const generalExpensesAmount = directCost * (params.generalExpensesPercent / 100);
  const technicalCost = directCost + generalExpensesAmount;

  // 5. UTILIDAD
  // En la práctica boliviana la utilidad se aplica sobre el costo directo + gastos generales
  const utilityAmount = technicalCost * (params.utilityPercent / 100);
  const netCost = technicalCost + utilityAmount;

  // 6. IMPUESTO A LAS TRANSACCIONES (IT)
  // En licitaciones bolivianas con factor efectivo: IT = NetCost * (itTaxPercent / 100)
  const itTaxAmount = netCost * (params.itTaxPercent / 100);

  // PRECIO UNITARIO FINAL
  const unitPriceTotal = netCost + itTaxAmount;

  // Desgloses porcentuales respecto al total
  const totalSafe = unitPriceTotal > 0 ? unitPriceTotal : 1;
  const breakdown = {
    materialsPct: (materialsTotal / totalSafe) * 100,
    laborPct: (laborTotal / totalSafe) * 100,
    equipmentPct: (equipmentTotal / totalSafe) * 100,
    indirectsPct: ((generalExpensesAmount + utilityAmount + itTaxAmount) / totalSafe) * 100
  };

  return {
    materialsTotal,
    laborBaseTotal,
    socialChargesAmount,
    vatLaborAmount,
    laborTotal,
    equipmentDirectTotal,
    minorToolsAmount,
    equipmentTotal,
    directCost,
    generalExpensesAmount,
    technicalCost,
    utilityAmount,
    netCost,
    itTaxAmount,
    unitPriceTotal,
    breakdown
  };
}

/**
 * Optimiza y consolida la lista de compras de la obra entera,
 * agrupando materiales por Proveedor para generar Órdenes de Compra.
 */
export function consolidatePurchases(
  budgetItems: BudgetItem[],
  apuItems: APUItem[],
  suppliers: Supplier[]
): {
  consolidatedItems: ConsolidatedPurchaseItem[];
  ordersBySupplier: SupplierPurchaseOrder[];
  totalPurchasesAmount: number;
  totalMaterialsCount: number;
} {
  const apuMap = new Map<string, APUItem>();
  apuItems.forEach(item => apuMap.set(item.id, item));

  const supplierMap = new Map<string, Supplier>();
  suppliers.forEach(s => supplierMap.set(s.id, s));

  // Clave de agrupación: `${resourceId}_${supplierId}`
  const map = new Map<string, ConsolidatedPurchaseItem>();

  for (const bItem of budgetItems) {
    if (bItem.quantity <= 0) continue;
    const apu = apuMap.get(bItem.apuItemId);
    if (!apu) continue;

    const materials = apu.components.filter(c => c.type === 'material');
    for (const mat of materials) {
      const supplierId = mat.supplierId || 'sup-1'; // fallback al proveedor 1 si no está definido
      const supplier = supplierMap.get(supplierId) || {
        id: supplierId,
        name: 'Proveedor Sin Asignar',
        nit: '-',
        phone: '-',
        city: 'Bolivia',
        address: '-',
        email: '-',
        category: 'Varios'
      };

      const groupKey = `${mat.resourceId}_${supplierId}`;
      const neededQty = mat.quantity * bItem.quantity;
      const amount = neededQty * mat.unitPrice;

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          resourceId: mat.resourceId,
          name: mat.description,
          unit: mat.unit,
          supplierId: supplierId,
          supplierName: supplier.name,
          brandOrNote: mat.quoteBrand,
          totalQuantity: 0,
          unitPrice: mat.unitPrice,
          subtotal: 0,
          usedInItems: []
        });
      }

      const entry = map.get(groupKey)!;
      entry.totalQuantity += neededQty;
      entry.subtotal += amount;
      if (mat.quoteBrand && !entry.brandOrNote) {
        entry.brandOrNote = mat.quoteBrand;
      }
      entry.usedInItems.push({
        apuCode: apu.code,
        apuName: apu.name,
        quantity: neededQty,
        totalAmount: amount
      });
    }
  }

  const consolidatedItems = Array.from(map.values()).sort((a, b) => b.subtotal - a.subtotal);
  const totalPurchasesAmount = consolidatedItems.reduce((acc, i) => acc + i.subtotal, 0);

  // Agrupar por proveedor
  const supplierOrdersMap = new Map<string, ConsolidatedPurchaseItem[]>();
  for (const item of consolidatedItems) {
    if (!supplierOrdersMap.has(item.supplierId)) {
      supplierOrdersMap.set(item.supplierId, []);
    }
    supplierOrdersMap.get(item.supplierId)!.push(item);
  }

  const ordersBySupplier: SupplierPurchaseOrder[] = [];
  let orderIndex = 1;

  supplierOrdersMap.forEach((items, supId) => {
    const supplier = supplierMap.get(supId) || {
      id: supId,
      name: 'Proveedor Sin Asignar',
      nit: '-',
      phone: '-',
      city: 'Bolivia',
      address: '-',
      email: '-',
      category: 'Varios'
    };

    const supTotal = items.reduce((acc, i) => acc + i.subtotal, 0);
    const orderNumber = `OC-BOL-${String(orderIndex).padStart(3, '0')}`;
    orderIndex++;

    ordersBySupplier.push({
      supplier,
      items: items.sort((a, b) => b.subtotal - a.subtotal),
      totalAmount: supTotal,
      orderNumber,
      date: new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    });
  });

  // Ordenar órdenes de compra por monto total descendente
  ordersBySupplier.sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    consolidatedItems,
    ordersBySupplier,
    totalPurchasesAmount,
    totalMaterialsCount: consolidatedItems.length
  };
}

/** Formateadores para moneda boliviana (Bs) */
export function formatBs(amount: number): string {
  if (isNaN(amount)) return 'Bs. 0.00';
  return `Bs. ${amount.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatQty(qty: number, decimals: number = 2): string {
  if (isNaN(qty)) return '0.00';
  return qty.toLocaleString('es-BO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
