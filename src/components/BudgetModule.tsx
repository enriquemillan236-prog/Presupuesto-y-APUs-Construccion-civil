import React, { useState } from 'react';
import {
  BudgetItem,
  APUItem,
  EconomicParameters,
  Supplier,
  ResourceMaterial,
  ResourceLabor,
  ResourceEquipment
} from '../types/apu';
import { calculateAPU, formatBs, formatQty } from '../utils/calculations';
import {
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Layers,
  PieChart,
  FileSpreadsheet,
  Check,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { APUEditorModal } from './APUEditorModal';

interface BudgetModuleProps {
  budgetItems: BudgetItem[];
  onUpdateBudgetItems: (items: BudgetItem[]) => void;
  apuItems: APUItem[];
  onUpdateAPUItem: (item: APUItem) => void;
  economicParams: EconomicParameters;
  suppliers: Supplier[];
  materialsCatalog: ResourceMaterial[];
  laborCatalog: ResourceLabor[];
  equipmentCatalog: ResourceEquipment[];
  onNavigateToPurchasing: () => void;
}

export const BudgetModule: React.FC<BudgetModuleProps> = ({
  budgetItems,
  onUpdateBudgetItems,
  apuItems,
  onUpdateAPUItem,
  economicParams,
  suppliers,
  materialsCatalog,
  laborCatalog,
  equipmentCatalog,
  onNavigateToPurchasing
}) => {
  const [selectedAPUForEdit, setSelectedAPUForEdit] = useState<APUItem | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedAPUIdToAdd, setSelectedAPUIdToAdd] = useState<string>(apuItems[0]?.id || '');
  const [newQuantityToAdd, setNewQuantityToAdd] = useState<number>(10);
  const [newNotesToAdd, setNewNotesToAdd] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mapa de APUs para cálculos rápidos
  const apuMap = new Map<string, APUItem>();
  apuItems.forEach(i => apuMap.set(i.id, i));

  // Actualizar metrado de una fila
  const handleUpdateQuantity = (id: string, qty: number) => {
    onUpdateBudgetItems(
      budgetItems.map(item => (item.id === id ? { ...item, quantity: Math.max(0, qty) } : item))
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    onUpdateBudgetItems(
      budgetItems.map(item => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    onUpdateBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= budgetItems.length) return;

    const newItems = [...budgetItems];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const renumbered = newItems.map((item, idx) => ({
      ...item,
      itemNumber: idx + 1
    }));
    onUpdateBudgetItems(renumbered);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAPUIdToAdd) return;

    const newItem: BudgetItem = {
      id: `b-${Date.now()}`,
      apuItemId: selectedAPUIdToAdd,
      itemNumber: budgetItems.length + 1,
      quantity: Number(newQuantityToAdd) || 1,
      notes: newNotesToAdd
    };

    onUpdateBudgetItems([...budgetItems, newItem]);
    setShowAddItemModal(false);
    setNewNotesToAdd('');
  };

  // Cálculos globales del presupuesto
  let grandTotal = 0;
  let totalMaterials = 0;
  let totalLabor = 0;
  let totalEquipment = 0;
  let totalGeneralExpenses = 0;
  let totalUtility = 0;
  let totalIT = 0;

  budgetItems.forEach(bItem => {
    const apu = apuMap.get(bItem.apuItemId);
    if (!apu) return;
    const calc = calculateAPU(apu, economicParams);
    const subtotal = calc.unitPriceTotal * bItem.quantity;
    grandTotal += subtotal;

    totalMaterials += calc.materialsTotal * bItem.quantity;
    totalLabor += calc.laborTotal * bItem.quantity;
    totalEquipment += calc.equipmentTotal * bItem.quantity;
    totalGeneralExpenses += calc.generalExpensesAmount * bItem.quantity;
    totalUtility += calc.utilityAmount * bItem.quantity;
    totalIT += calc.itTaxAmount * bItem.quantity;
  });

  const totalDirect = totalMaterials + totalLabor + totalEquipment;

  const categories = Array.from(new Set(apuItems.map(a => a.category)));

  // Filtrado de ítems
  const filteredBudgetItems = budgetItems.filter(b => {
    const apu = apuMap.get(b.apuItemId);
    if (!apu) return false;
    const matchesSearch =
      apu.name.toLowerCase().includes(search.toLowerCase()) ||
      apu.code.toLowerCase().includes(search.toLowerCase()) ||
      b.itemNumber.toString().includes(search) ||
      (b.notes && b.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || apu.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = () => {
    const headers = ['N°', 'Código', 'Descripción de Actividad', 'Unidad', 'Metrado', 'P. Unitario (Bs)', 'Parcial (Bs)', 'Notas'];
    const rows = budgetItems.map((bItem, idx) => {
      const apu = apuMap.get(bItem.apuItemId);
      if (!apu) return [];
      const calc = calculateAPU(apu, economicParams);
      const subtotal = calc.unitPriceTotal * bItem.quantity;
      return [
        bItem.itemNumber || idx + 1,
        apu.code,
        `"${apu.name}"`,
        apu.unit,
        bItem.quantity,
        calc.unitPriceTotal.toFixed(2),
        subtotal.toFixed(2),
        `"${bItem.notes || ''}"`
      ];
    });

    const csvContent = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Indicadores / Tarjetas de Métricas Superiores en Grilla (Blanco limpio / Gris suave) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Presupuesto Total Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Presupuesto Total de Obra
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-2">
            {formatBs(grandTotal)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{budgetItems.length} actividades programadas</span>
            <span className="font-semibold text-emerald-800">100% Contrato</span>
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none text-emerald-900">
            <Layers className="w-24 h-24" />
          </div>
        </div>

        {/* Costo Directo Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Costo Directo Total (CD)
            </span>
            <span className="text-[10px] font-mono text-slate-400">Materiales + MO + Eq</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-2">
            {formatBs(totalDirect)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {grandTotal > 0 ? ((totalDirect / grandTotal) * 100).toFixed(1) : 0}% del valor total
          </div>
        </div>

        {/* Compras de Materiales Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                Insumos & Materiales
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                Santa Cruz
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-teal-700 mt-2">
              {formatBs(totalMaterials)}
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToPurchasing}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 mt-2 transition-colors"
          >
            Ver órdenes de compra &rarr;
          </button>
        </div>

        {/* Mano de Obra y Equipos Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Mano de Obra + Equipos
            </span>
            <span className="text-[10px] text-slate-400">Jornales Santa Cruz</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-800 mt-2">
            {formatBs(totalLabor + totalEquipment)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            M.O. Efectiva: {formatBs(totalLabor)}
          </div>
        </div>
      </div>

      {/* Barra de Distribución Financiera de la Obra */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            Distribución Presupuestaria de la Obra (Santa Cruz, Bolivia)
          </span>
          <span className="text-slate-500 text-[11px]">
            Cargas Sociales: {economicParams.socialChargesPercent}% · GG: {economicParams.generalExpensesPercent}% · Utilidad: {economicParams.utilityPercent}% · IT: {economicParams.itTaxPercent}%
          </span>
        </div>

        <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
          <div
            style={{ width: `${grandTotal > 0 ? (totalMaterials / grandTotal) * 100 : 0}%` }}
            className="bg-emerald-600"
            title={`Materiales: ${formatBs(totalMaterials)}`}
          />
          <div
            style={{ width: `${grandTotal > 0 ? (totalLabor / grandTotal) * 100 : 0}%` }}
            className="bg-teal-500"
            title={`Mano de Obra: ${formatBs(totalLabor)}`}
          />
          <div
            style={{ width: `${grandTotal > 0 ? (totalEquipment / grandTotal) * 100 : 0}%` }}
            className="bg-amber-500"
            title={`Equipos: ${formatBs(totalEquipment)}`}
          />
          <div
            style={{ width: `${grandTotal > 0 ? (totalGeneralExpenses / grandTotal) * 100 : 0}%` }}
            className="bg-slate-500"
            title={`Gastos Generales: ${formatBs(totalGeneralExpenses)}`}
          />
          <div
            style={{ width: `${grandTotal > 0 ? (totalUtility / grandTotal) * 100 : 0}%` }}
            className="bg-emerald-400"
            title={`Utilidad: ${formatBs(totalUtility)}`}
          />
          <div
            style={{ width: `${grandTotal > 0 ? (totalIT / grandTotal) * 100 : 0}%` }}
            className="bg-rose-500"
            title={`IT Impuesto 3%: ${formatBs(totalIT)}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] pt-1 text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
            Materiales ({grandTotal > 0 ? ((totalMaterials / grandTotal) * 100).toFixed(1) : 0}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-teal-500 inline-block" />
            Mano de Obra ({grandTotal > 0 ? ((totalLabor / grandTotal) * 100).toFixed(1) : 0}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
            Equipos ({grandTotal > 0 ? ((totalEquipment / grandTotal) * 100).toFixed(1) : 0}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-500 inline-block" />
            Gastos Generales ({grandTotal > 0 ? ((totalGeneralExpenses / grandTotal) * 100).toFixed(1) : 0}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 inline-block" />
            Utilidad ({grandTotal > 0 ? ((totalUtility / grandTotal) * 100).toFixed(1) : 0}%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
            IT 3% ({grandTotal > 0 ? ((totalIT / grandTotal) * 100).toFixed(1) : 0}%)
          </span>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Acciones */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar entre las 56 actividades (ej. Muro 6H, Zapatas, Ducha Deca, Tramontina)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
          >
            <option value="all">Todas las Categorías ({categories.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5"
            title="Copiar planilla completa para pegar directamente en Microsoft Excel"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado a Excel!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copiar a Excel</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowAddItemModal(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Actividad</span>
          </button>
        </div>
      </div>

      {/* Tabla Oficial de las 56 Actividades de Obra en Santa Cruz */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-center w-12">N°</th>
                <th className="py-3 px-3 w-20">Código</th>
                <th className="py-3 px-4">Descripción Oficial de la Actividad</th>
                <th className="py-3 px-2 text-center w-16">Unidad</th>
                <th className="py-3 px-3 text-right w-28">Metrado</th>
                <th className="py-3 px-3 text-right w-32">P. Unitario (Bs)</th>
                <th className="py-3 px-4 text-right w-36">Total Parcial (Bs)</th>
                <th className="py-3 px-3 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBudgetItems.map((bItem, index) => {
                const apu = apuMap.get(bItem.apuItemId);
                if (!apu) return null;

                const calc = calculateAPU(apu, economicParams);
                const lineTotal = calc.unitPriceTotal * bItem.quantity;

                return (
                  <tr
                    key={bItem.id}
                    className="hover:bg-emerald-50/40 transition-colors group"
                  >
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                      {bItem.itemNumber || index + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {apu.code}
                    </td>
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setSelectedAPUForEdit(apu)}
                        className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{apu.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Ubicación o detalle de cómputo en obra..."
                        value={bItem.notes || ''}
                        onChange={e => handleUpdateNotes(bItem.id, e.target.value)}
                        className="w-full bg-transparent hover:bg-slate-50 focus:bg-white text-[11px] text-slate-500 rounded px-1.5 py-0.5 mt-0.5 border border-transparent focus:border-slate-300 focus:outline-hidden"
                      />
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-semibold text-slate-600">
                      {apu.unit}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={bItem.quantity}
                        onChange={e => handleUpdateQuantity(bItem.id, Number(e.target.value))}
                        className="w-24 text-right font-mono font-semibold bg-slate-50 border border-slate-200 text-slate-900 rounded px-2 py-1 text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      {formatNumber(calc.unitPriceTotal)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 text-sm">
                      {formatNumber(lineTotal)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Subir posición"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === budgetItems.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Bajar posición"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAPUForEdit(apu)}
                          className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                          title="Abrir análisis de precios unitarios (APU)"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(bItem.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar ítem del presupuesto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Pie de tabla con totales oficiales */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan={4} className="py-4 px-4 text-right uppercase tracking-wider text-xs">
                  TOTAL GENERAL DEL PRESUPUESTO (Bs.):
                </td>
                <td className="py-4 px-3 text-right font-mono text-slate-500">
                  {budgetItems.reduce((acc, i) => acc + i.quantity, 0).toFixed(1)} u.
                </td>
                <td className="py-4 px-3"></td>
                <td className="py-4 px-4 text-right font-mono text-base font-black text-emerald-700">
                  {formatBs(grandTotal)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal: Agregar Actividad al Presupuesto */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Agregar Actividad al Presupuesto
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Seleccionar Actividad de la Lista de Santa Cruz:
                </label>
                <select
                  value={selectedAPUIdToAdd}
                  onChange={e => setSelectedAPUIdToAdd(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  {apuItems.map(apu => {
                    const c = calculateAPU(apu, economicParams);
                    return (
                      <option key={apu.id} value={apu.id}>
                        [{apu.code}] {apu.name} ({apu.unit}) - {formatBs(c.unitPriceTotal)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Metrado / Cantidad a Ejecutar:
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={newQuantityToAdd}
                  onChange={e => setNewQuantityToAdd(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-semibold focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ubicación o Notas en Planos (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Planta alta, dormitorios 1 y 2..."
                  value={newNotesToAdd}
                  onChange={e => setNewNotesToAdd(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Incorporar a la Planilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editor Modal de APU si el usuario hace clic en cualquier actividad */}
      {selectedAPUForEdit && (
        <APUEditorModal
          item={selectedAPUForEdit}
          isOpen={true}
          onClose={() => setSelectedAPUForEdit(null)}
          onSave={updated => {
            onUpdateAPUItem(updated);
            setSelectedAPUForEdit(null);
          }}
          economicParams={economicParams}
          suppliers={suppliers}
          materialsCatalog={materialsCatalog}
          laborCatalog={laborCatalog}
          equipmentCatalog={equipmentCatalog}
        />
      )}
    </div>
  );
};

function formatNumber(num: number): string {
  return num.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
