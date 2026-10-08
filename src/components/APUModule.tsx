import React, { useState } from 'react';
import {
  APUItem,
  EconomicParameters,
  Supplier,
  ResourceMaterial,
  ResourceLabor,
  ResourceEquipment
} from '../types/apu';
import { calculateAPU, formatBs } from '../utils/calculations';
import {
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  Layers,
  Calculator,
  ChevronRight,
  Filter
} from 'lucide-react';
import { APUEditorModal } from './APUEditorModal';

interface APUModuleProps {
  apuItems: APUItem[];
  onSaveAPU: (item: APUItem) => void;
  onDeleteAPU: (id: string) => void;
  onDuplicateAPU: (item: APUItem) => void;
  economicParams: EconomicParameters;
  suppliers: Supplier[];
  materialsCatalog: ResourceMaterial[];
  laborCatalog: ResourceLabor[];
  equipmentCatalog: ResourceEquipment[];
}

export const APUModule: React.FC<APUModuleProps> = ({
  apuItems,
  onSaveAPU,
  onDeleteAPU,
  onDuplicateAPU,
  economicParams,
  suppliers,
  materialsCatalog,
  laborCatalog,
  equipmentCatalog
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<APUItem | null>(null);

  const categories = Array.from(new Set(apuItems.map(item => item.category)));

  const filteredItems = apuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.specification.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateNew = () => {
    const newItem: APUItem = {
      id: `act-${Date.now()}`,
      code: `ACT-${String(apuItems.length + 1).padStart(2, '0')}`,
      name: 'NUEVA ACTIVIDAD DE CONSTRUCCION',
      unit: 'M2',
      category: 'General',
      specification: 'Especificación técnica según planos de detalle para Santa Cruz...',
      components: [
        {
          id: `c-mat-${Date.now()}`,
          type: 'material',
          resourceId: materialsCatalog[0]?.id || 'mat-cemento',
          description: materialsCatalog[0]?.name || 'Cemento IP-30',
          unit: materialsCatalog[0]?.unit || 'bolsa',
          quantity: 1,
          unitPrice: materialsCatalog[0]?.defaultUnitPrice || 48,
          supplierId: materialsCatalog[0]?.defaultSupplierId || 'sup-1'
        },
        {
          id: `c-lab-${Date.now()}`,
          type: 'labor',
          resourceId: laborCatalog[0]?.id || 'lab-maestro',
          description: laborCatalog[0]?.specialty || 'Maestro Albañil',
          unit: 'hh',
          quantity: 1,
          unitPrice: laborCatalog[0]?.hourlyRate || 24
        }
      ]
    };
    setEditingItem(newItem);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner en Tarjeta Blanca Limpia */}
      <div className="bg-white border border-slate-200/90 p-5 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Catálogo Oficial Santa Cruz
            </span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-xs text-slate-500 font-mono">Formulario B-2 SABS</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            Matriz de Análisis de Precios Unitarios (APU)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Estructura de costos unitarios para las 56 actividades de construcción en Santa Cruz. Haz clic en cualquier ítem para desglosar sus materiales, mano de obra y equipos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Actividad APU</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar actividad por nombre, código o especificación (ej. ACT-05, Ladrillo, Vigueta)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-xs"
          />
        </div>

        {/* Category Pills/Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Todas ({apuItems.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de Tarjetas APU en Blanco Limpio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const calc = calculateAPU(item, economicParams);
          const matCount = item.components.filter(c => c.type === 'material').length;
          const labCount = item.components.filter(c => c.type === 'labor').length;
          const eqCount = item.components.filter(c => c.type === 'equipment').length;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-md group shadow-xs"
            >
              <div>
                {/* Header tag and code */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.code}
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium">{item.category}</span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => setEditingItem(item)}
                  className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[2.5rem] cursor-pointer"
                >
                  {item.name}
                </h3>

                {/* Specification snippet */}
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                  {item.specification || 'Especificación según planos de construcción de Santa Cruz.'}
                </p>

                {/* Resources summary */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span>Mat: <strong className="text-slate-700">{matCount}</strong></span>
                  <span>·</span>
                  <span>M.O.: <strong className="text-slate-700">{labCount}</strong></span>
                  <span>·</span>
                  <span>Eq: <strong className="text-slate-700">{eqCount}</strong></span>
                  <span>·</span>
                  <span>Unidad: <strong className="text-emerald-700 font-mono">{item.unit}</strong></span>
                </div>

                {/* Cost breakdown progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
                    <div
                      style={{ width: `${calc.breakdown.materialsPct}%` }}
                      className="bg-emerald-600"
                      title={`Materiales: ${calc.breakdown.materialsPct.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${calc.breakdown.laborPct}%` }}
                      className="bg-teal-500"
                      title={`Mano de Obra: ${calc.breakdown.laborPct.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${calc.breakdown.equipmentPct}%` }}
                      className="bg-amber-500"
                      title={`Equipos: ${calc.breakdown.equipmentPct.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${calc.breakdown.indirectsPct}%` }}
                      className="bg-slate-400"
                      title={`Indirectos: ${calc.breakdown.indirectsPct.toFixed(1)}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>CD: {formatBs(calc.directCost)}</span>
                    <span>Indir.+IT: {formatBs(calc.generalExpensesAmount + calc.utilityAmount + calc.itTaxAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Price and Actions Bottom */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Precio Unitario</span>
                  <span className="text-base font-mono font-black text-emerald-700">
                    {formatBs(calc.unitPriceTotal)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium"> / {item.unit}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onDuplicateAPU(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Duplicar ítem APU"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Editar APU</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteAPU(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Eliminar ítem"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal de APU */}
      {editingItem && (
        <APUEditorModal
          item={editingItem}
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSave={updated => {
            onSaveAPU(updated);
            setEditingItem(null);
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
