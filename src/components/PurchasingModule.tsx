import React, { useState } from 'react';
import {
  BudgetItem,
  APUItem,
  Supplier,
  SupplierPurchaseOrder,
  ConsolidatedPurchaseItem,
  ProjectInfo,
  ResourceMaterial
} from '../types/apu';
import { consolidatePurchases, formatBs, formatQty } from '../utils/calculations';
import {
  getValidSuppliersForMaterial,
  getMaterialDomain,
  getDomainBadgeInfo
} from '../utils/supplierFilter';
import {
  ShoppingCart,
  Truck,
  FileText,
  Printer,
  Share2,
  CheckCircle,
  Search,
  Building,
  Phone,
  Mail,
  X,
  Layers,
  ArrowRight,
  Tag,
  Scale,
  Sparkles,
  Check
} from 'lucide-react';

interface PurchasingModuleProps {
  budgetItems: BudgetItem[];
  apuItems: APUItem[];
  suppliers: Supplier[];
  projectInfo: ProjectInfo;
  materialsCatalog?: ResourceMaterial[];
  onUpdateMaterialSupplier: (resourceId: string, newSupplierId: string) => void;
}

export const PurchasingModule: React.FC<PurchasingModuleProps> = ({
  budgetItems,
  apuItems,
  suppliers,
  projectInfo,
  materialsCatalog = [],
  onUpdateMaterialSupplier
}) => {
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activePurchaseOrder, setActivePurchaseOrder] = useState<SupplierPurchaseOrder | null>(null);

  // Map rápido de materiales para consultar cotizaciones y CADECOCRUZ
  const materialDefMap = new Map<string, ResourceMaterial>();
  materialsCatalog.forEach(m => materialDefMap.set(m.id, m));

  // Ejecutar consolidación automática de compras
  const {
    consolidatedItems,
    ordersBySupplier,
    totalPurchasesAmount,
    totalMaterialsCount
  } = consolidatePurchases(budgetItems, apuItems, suppliers);

  // Insumos estratégicos para el panel comparativo de cotizaciones cruceñas
  const cementoTotalQty = consolidatedItems
    .filter(i => i.resourceId === 'mat-cemento')
    .reduce((acc, i) => acc + i.totalQuantity, 0);
  const cementoCurrentSupplierId = consolidatedItems.find(i => i.resourceId === 'mat-cemento')?.supplierId;

  const fierroTotalQty = consolidatedItems
    .filter(i => i.resourceId === 'mat-fierro')
    .reduce((acc, i) => acc + i.totalQuantity, 0);
  const fierroCurrentSupplierId = consolidatedItems.find(i => i.resourceId === 'mat-fierro')?.supplierId;

  const ladrilloTotalQty = consolidatedItems
    .filter(i => i.resourceId === 'mat-ladrillo-6h')
    .reduce((acc, i) => acc + i.totalQuantity, 0);
  const ladrilloCurrentSupplierId = consolidatedItems.find(i => i.resourceId === 'mat-ladrillo-6h')?.supplierId;

  const porcelanatoTotalQty = consolidatedItems
    .filter(i => i.resourceId === 'mat-porcelanato' || i.resourceId === 'mat-ceramica')
    .reduce((acc, i) => acc + i.totalQuantity, 0);
  const porcelanatoCurrentSupplierId = consolidatedItems.find(i => i.resourceId === 'mat-porcelanato')?.supplierId;

  const filteredConsolidated = consolidatedItems.filter(item => {
    const matchesSupplier =
      selectedSupplierFilter === 'all' || item.supplierId === selectedSupplierFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(search.toLowerCase());
    return matchesSupplier && matchesSearch;
  });

  const handlePrintOrder = () => {
    window.print();
  };

  const handleShareWhatsApp = (order: SupplierPurchaseOrder) => {
    const lines = [
      `*ORDEN DE COMPRA: ${order.orderNumber}*`,
      `*Proyecto:* ${projectInfo.name}`,
      `*Ubicación:* ${projectInfo.location}, ${projectInfo.city}`,
      `*Proveedor:* ${order.supplier.name} (NIT: ${order.supplier.nit})`,
      `*Fecha:* ${order.date}`,
      ``,
      `*Detalle de Materiales Solicitados:*`
    ];

    order.items.forEach((item, idx) => {
      lines.push(
        `${idx + 1}. ${item.name}: ${formatQty(item.totalQuantity)} ${item.unit} @ ${formatBs(item.unitPrice)} = ${formatBs(item.subtotal)}`
      );
    });

    lines.push(``);
    lines.push(`*MONTO TOTAL A FACTURAR:* ${formatBs(order.totalAmount)}`);
    lines.push(`Lugar de Entrega: En Obra (Santa Cruz).`);
    lines.push(`Solicitado por: ${projectInfo.supervisor}`);

    const message = encodeURIComponent(lines.join('\n'));
    const cleanPhone = order.supplier.phone.replace(/[^0-9]/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${message}`
      : `https://wa.me/?text=${message}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner en Tarjeta Blanca Limpia */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Logística & Abastecimiento
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs text-slate-500 font-semibold">Santa Cruz de la Sierra</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            Consolidación y Órdenes de Compra por Proveedor
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Multiplica automáticamente los rendimientos de cada una de las 56 actividades por los cómputos métricos, agrupa los insumos por ferretería o distribuidor y genera las órdenes de compra listas para emitir.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-right shrink-0">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
            Total Materiales a Comprar
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-0.5">
            {formatBs(totalPurchasesAmount)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {totalMaterialsCount} materiales requeridos en {ordersBySupplier.length} proveedores
          </div>
        </div>
      </div>

      {/* Proveedores Resumen en Tarjetas Blancas */}
      <div>
        <h3 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          Resumen de Órdenes por Proveedor Asignado ({ordersBySupplier.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ordersBySupplier.map(order => {
            const percentage = totalPurchasesAmount > 0 ? (order.totalAmount / totalPurchasesAmount) * 100 : 0;
            return (
              <div
                key={order.supplier.id}
                className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-md shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{order.supplier.city.split('/')[0]}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1" title={order.supplier.name}>
                    {order.supplier.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    NIT: {order.supplier.nit}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Insumos a comprar:</span>
                      <span className="font-bold text-slate-800">{order.items.length} materiales</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Participación en compras:</span>
                      <span className="font-mono font-bold text-emerald-700">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-mono font-black text-emerald-800 text-sm">
                    {formatBs(order.totalAmount)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePurchaseOrder(order)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver O.C.</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel de Comparativa Estratégica de Proveedores Cruceños */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-wide text-white">
              Comparador de Cotizaciones Estratégicas en Santa Cruz
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Precios en Bolvianos (Bs) · Asignación masiva en 1 clic para toda la obra
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Cemento IP-30 */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-400">Cemento IP-30</span>
                <span className="font-mono text-[11px] text-slate-300 bg-slate-700 px-1.5 py-0.5 rounded">
                  {formatQty(cementoTotalQty)} bolsas
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Ref. CADECOCRUZ: <span className="text-white font-mono font-semibold">Bs 47.00</span>
              </p>

              <div className="space-y-1.5">
                {[
                  { id: 'sup-itacamba', name: 'ITAMBA / ITACAMBA', price: 46.00, tag: 'Más Económico' },
                  { id: 'sup-fancesa', name: 'FANCESA Cemento', price: 47.50, tag: 'Superior' },
                  { id: 'sup-soboce', name: 'SOBOCE S.A.', price: 48.50, tag: 'Warnes' }
                ].map(opt => {
                  const isSelected = cementoCurrentSupplierId === opt.id;
                  const totalEst = cementoTotalQty * opt.price;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdateMaterialSupplier('mat-cemento', opt.id)}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all border ${
                        isSelected
                          ? 'bg-amber-600/30 border-amber-500 text-white shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {opt.name}
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Total obra: <span className="font-mono">{formatBs(totalEst)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-amber-300 text-xs">
                          {formatBs(opt.price)}
                        </span>
                        <div className="text-[9px] text-slate-400">{opt.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Acero / Fierro Corrugado */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-blue-400">Acero Corrugado Gr. 500</span>
                <span className="font-mono text-[11px] text-slate-300 bg-slate-700 px-1.5 py-0.5 rounded">
                  {formatQty(fierroTotalQty)} kg
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Ref. CADECOCRUZ: <span className="text-white font-mono font-semibold">Bs 8.25/kg</span>
              </p>

              <div className="space-y-1.5">
                {[
                  { id: 'sup-monterrey', name: 'Monterrey B500', price: 8.10, tag: 'Mayorista' },
                  { id: 'sup-casadelfierro', name: 'Casa del Fierro', price: 8.15, tag: 'Inmediato' },
                  { id: 'sup-laslomas', name: 'Las Lomas Belgo', price: 8.20, tag: 'Certificado' },
                  { id: 'sup-arequipa', name: 'Aceros Arequipa', price: 8.35, tag: 'Norma ASTM' }
                ].map(opt => {
                  const isSelected = fierroCurrentSupplierId === opt.id;
                  const totalEst = fierroTotalQty * opt.price;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdateMaterialSupplier('mat-fierro', opt.id)}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all border ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {opt.name}
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Total obra: <span className="font-mono">{formatBs(totalEst)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-blue-300 text-xs">
                          {formatBs(opt.price)}/kg
                        </span>
                        <div className="text-[9px] text-slate-400">{opt.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ladrillo Cerámico 6H */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-orange-400">Ladrillo 6H 18x25x12</span>
                <span className="font-mono text-[11px] text-slate-300 bg-slate-700 px-1.5 py-0.5 rounded">
                  {formatQty(ladrilloTotalQty)} pzas
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Ref. CADECOCRUZ: <span className="text-white font-mono font-semibold">Bs 1.28/pza</span>
              </p>

              <div className="space-y-1.5">
                {[
                  { id: 'sup-ceranorte', name: 'Cerámica Norte', price: 1.25, tag: 'Económico 6H' },
                  { id: 'sup-ceraitaugua', name: 'Cerámica Itauguá', price: 1.26, tag: 'Planta Cotoca' },
                  { id: 'sup-incerpaz', name: 'INCERPAZ Santa Cruz', price: 1.30, tag: 'Primera Calidad' }
                ].map(opt => {
                  const isSelected = ladrilloCurrentSupplierId === opt.id;
                  const totalEst = ladrilloTotalQty * opt.price;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdateMaterialSupplier('mat-ladrillo-6h', opt.id)}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all border ${
                        isSelected
                          ? 'bg-orange-600/30 border-orange-500 text-white shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {opt.name}
                          {isSelected && <Check className="w-3.5 h-3.5 text-orange-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Total obra: <span className="font-mono">{formatBs(totalEst)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-orange-300 text-xs">
                          {formatBs(opt.price)}/pza
                        </span>
                        <div className="text-[9px] text-slate-400">{opt.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pisos, Porcelanatos y Baños (GLADYMAR / ROHO / IMPORTACRUZ / CERABOL) */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-teal-400">Pisos & Porcelanatos</span>
                <span className="font-mono text-[11px] text-slate-300 bg-slate-700 px-1.5 py-0.5 rounded">
                  {formatQty(porcelanatoTotalQty)} m2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Ref. CADECOCRUZ: <span className="text-white font-mono font-semibold">Bs 85.00/m2</span>
              </p>

              <div className="space-y-1.5">
                {[
                  { id: 'sup-cerabol', name: 'CERABOL', price: 82.00, tag: 'Gres 60x60' },
                  { id: 'sup-importacruz', name: 'IMPORTACRUZ', price: 83.00, tag: 'Alto Tránsito' },
                  { id: 'sup-roho', name: 'ROHO Homecenter', price: 84.50, tag: 'Importado' },
                  { id: 'sup-gladymar', name: 'GLADYMAR S.A.', price: 86.00, tag: 'Rectificado' }
                ].map(opt => {
                  const isSelected = porcelanatoCurrentSupplierId === opt.id;
                  const totalEst = porcelanatoTotalQty * opt.price;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onUpdateMaterialSupplier('mat-porcelanato', opt.id);
                        onUpdateMaterialSupplier('mat-ceramica', opt.id);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all border ${
                        isSelected
                          ? 'bg-teal-600/30 border-teal-500 text-white shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {opt.name}
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Total obra: <span className="font-mono">{formatBs(totalEst)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-teal-300 text-xs">
                          {formatBs(opt.price)}/m2
                        </span>
                        <div className="text-[9px] text-slate-400">{opt.tag}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Detallada de Consolidación de Materiales */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              Lista de Compras de la Obra y Asignación de Proveedores
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Puedes reasignar el proveedor de cualquier material en el desplegable para optimizar cotizaciones en Santa Cruz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSupplierFilter}
              onChange={e => setSelectedSupplierFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-3 py-2 focus:outline-hidden focus:border-emerald-600"
            >
              <option value="all">Todos los Proveedores ({ordersBySupplier.length})</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar material..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg pl-8 pr-3 py-2 focus:outline-hidden focus:border-emerald-600 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-4">Descripción del Material</th>
                  <th className="py-3 px-2 text-center w-16">Unidad</th>
                  <th className="py-3 px-3 text-right w-28">Cant. Total Obra</th>
                  <th className="py-3 px-3 text-right w-28">P. Unitario (Bs)</th>
                  <th className="py-3 px-4 text-right w-36">Subtotal Compra</th>
                  <th className="py-3 px-4 w-64">Proveedor Asignado & Cotización</th>
                  <th className="py-3 px-3 w-40">Actividades de Uso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredConsolidated.map((item, index) => {
                  const matDef = materialDefMap.get(item.resourceId);
                  const hasQuotes = matDef && matDef.quotes && matDef.quotes.length > 0;
                  const validSuppliers = getValidSuppliersForMaterial(
                    {
                      id: item.resourceId,
                      name: item.name,
                      category: matDef?.category,
                      quotes: matDef?.quotes
                    },
                    suppliers
                  );
                  const domain = getMaterialDomain({
                    id: item.resourceId,
                    name: item.name,
                    category: matDef?.category
                  });
                  const badgeInfo = getDomainBadgeInfo(domain);
                  const currentSupplierValid = validSuppliers.some(s => s.id === item.supplierId);
                  const effectiveSupplierId = currentSupplierValid ? item.supplierId : validSuppliers[0]?.id;

                  return (
                    <tr key={`${item.resourceId}-${item.supplierId}`} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-3 text-center font-mono text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900">{item.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${badgeInfo.badgeBg} ${badgeInfo.badgeText}`}
                            title={badgeInfo.allowedHint}
                          >
                            {badgeInfo.label}
                          </span>
                        </div>
                        {item.brandOrNote && (
                          <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                            <Tag className="w-3 h-3 shrink-0" />
                            <span>Opción: {item.brandOrNote}</span>
                          </div>
                        )}
                        {matDef?.cadecocruzPrice && (
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                            Ref. CADECOCRUZ: <span className="font-mono font-semibold text-slate-700">{formatBs(matDef.cadecocruzPrice)}</span>/{item.unit}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-emerald-700">
                        {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {formatQty(item.totalQuantity)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {formatBs(item.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                        {formatBs(item.subtotal)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={effectiveSupplierId}
                          onChange={e => onUpdateMaterialSupplier(item.resourceId, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-emerald-600 font-medium truncate"
                        >
                          {hasQuotes && matDef?.quotes && (
                            <optgroup label="Cotizaciones Directas de Fábrica">
                              {matDef.quotes
                                .filter(q => validSuppliers.some(vs => vs.id === q.supplierId))
                                .map(q => (
                                  <option key={q.supplierId} value={q.supplierId}>
                                    {q.supplierName.split('(')[0].trim()} ({formatBs(q.price)})
                                  </option>
                                ))}
                            </optgroup>
                          )}
                          <optgroup label={`Proveedores Autorizados (${badgeInfo.label})`}>
                            {validSuppliers
                              .filter(s => !matDef?.quotes?.some(q => q.supplierId === s.id))
                              .map(sup => (
                                <option key={sup.id} value={sup.id}>
                                  {sup.name}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-500">
                        <div className="flex flex-wrap gap-1">
                          {item.usedInItems.slice(0, 4).map(usage => (
                            <span
                              key={usage.apuCode}
                              className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-700"
                              title={`${usage.apuName}: ${formatQty(usage.quantity)} ${item.unit}`}
                            >
                              {usage.apuCode}
                            </span>
                          ))}
                          {item.usedInItems.length > 4 && (
                            <span className="text-[10px] text-slate-400 font-medium">+{item.usedInItems.length - 4} más</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-right uppercase tracking-wider text-xs">
                    TOTAL COMPRAS CONSOLIDADAS (Bs.):
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-base font-black text-emerald-700">
                    {formatBs(filteredConsolidated.reduce((acc, i) => acc + i.subtotal, 0))}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: ORDEN DE COMPRA FORMAL (Imprimible & Compartible) */}
      {activePurchaseOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full my-auto text-slate-900 shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Actions Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Orden de Compra Oficial (Santa Cruz)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(activePurchaseOrder)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Enviar requerimiento de materiales por WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Enviar por WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintOrder}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-700" />
                  <span>Imprimir / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePurchaseOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Sheet Printable Area */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900 printable-document">
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                      ORDEN DE COMPRA DE MATERIALES
                    </h1>
                    <div className="text-xs text-slate-600 mt-0.5">
                      SISTEMA DE GESTIÓN TÉCNICA Y SUMINISTROS · SANTA CRUZ, BOLIVIA
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-bold text-slate-500 block">N° Documento</span>
                    <span className="text-lg font-mono font-black text-emerald-700">
                      {activePurchaseOrder.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500 block">Fecha: {activePurchaseOrder.date}</span>
                  </div>
                </div>
              </div>

              {/* Company & Supplier Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                    Datos de la Obra / Solicitante
                  </h4>
                  <div className="space-y-1">
                    <p><strong>Proyecto:</strong> {projectInfo.name}</p>
                    <p><strong>Cliente:</strong> {projectInfo.client}</p>
                    <p><strong>Ubicación:</strong> {projectInfo.location}</p>
                    <p><strong>Ciudad:</strong> {projectInfo.city}</p>
                    <p><strong>Ingeniero Responsable:</strong> {projectInfo.supervisor}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
                    Datos del Proveedor
                  </h4>
                  <div className="space-y-1">
                    <p><strong>Razón Social:</strong> {activePurchaseOrder.supplier.name}</p>
                    <p><strong>NIT:</strong> {activePurchaseOrder.supplier.nit}</p>
                    <p><strong>Dirección:</strong> {activePurchaseOrder.supplier.address}</p>
                    <p><strong>Ciudad:</strong> {activePurchaseOrder.supplier.city}</p>
                    <p><strong>Teléfono / Celular:</strong> {activePurchaseOrder.supplier.phone}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left border-collapse border border-slate-300 mb-6">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] border-b border-slate-300">
                    <th className="p-2 border border-slate-300 text-center w-10">Ítem</th>
                    <th className="p-2 border border-slate-300">Descripción del Material</th>
                    <th className="p-2 border border-slate-300 text-center w-16">Unidad</th>
                    <th className="p-2 border border-slate-300 text-right w-24">Cantidad</th>
                    <th className="p-2 border border-slate-300 text-right w-28">P. Unitario (Bs)</th>
                    <th className="p-2 border border-slate-300 text-right w-32">Total (Bs)</th>
                  </tr>
                </thead>
                <tbody>
                  {activePurchaseOrder.items.map((it, idx) => (
                    <tr key={it.resourceId} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border border-slate-300 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border border-slate-300 font-medium">
                        {it.name}
                        <div className="text-[10px] text-slate-500 font-normal">
                          Para actividades: {it.usedInItems.slice(0, 3).map(u => u.apuCode).join(', ')}
                        </div>
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-mono">{it.unit}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-bold">
                        {formatQty(it.totalQuantity)}
                      </td>
                      <td className="p-2 border border-slate-300 text-right font-mono">
                        {it.unitPrice.toFixed(2)}
                      </td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-bold">
                        {it.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-400">
                    <td colSpan={5} className="p-2 text-right uppercase border border-slate-300">
                      MONTO TOTAL DE LA ORDEN (Bs.):
                    </td>
                    <td className="p-2 text-right font-mono text-base font-black text-emerald-800 border border-slate-300">
                      {formatBs(activePurchaseOrder.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Commercial Conditions & Signatures */}
              <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-8 space-y-1">
                <p><strong>Condiciones Generales:</strong></p>
                <p>1. Precios acordados con entrega en pie de obra ({projectInfo.location}).</p>
                <p>2. Emitir Factura Oficial con NIT del comprador.</p>
                <p>3. Los materiales deben cumplir con las especificaciones técnicas bolivianas.</p>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
                <div className="border-t border-slate-400 pt-2">
                  <div className="font-bold text-slate-800">Residente de Obra / Compras</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{projectInfo.supervisor}</div>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <div className="font-bold text-slate-800">Dirección Técnica</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">Aprobación Financiera</div>
                </div>
                <div className="border-t border-slate-400 pt-2">
                  <div className="font-bold text-slate-800">Aceptado por Proveedor</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{activePurchaseOrder.supplier.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
