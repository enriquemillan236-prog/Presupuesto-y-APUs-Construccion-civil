import React, { useState } from 'react';
import {
  APUItem,
  APUComponent,
  EconomicParameters,
  Supplier,
  ResourceMaterial,
  ResourceLabor,
  ResourceEquipment
} from '../types/apu';
import { calculateAPU, formatBs, formatQty } from '../utils/calculations';
import {
  getValidSuppliersForMaterial,
  getMaterialDomain,
  getDomainBadgeInfo
} from '../utils/supplierFilter';
import {
  X,
  Plus,
  Trash2,
  HardHat,
  Truck,
  Wrench,
  Percent,
  CheckCircle2,
  Tag,
  Building,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface APUEditorModalProps {
  item: APUItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: APUItem) => void;
  economicParams: EconomicParameters;
  suppliers: Supplier[];
  materialsCatalog: ResourceMaterial[];
  laborCatalog: ResourceLabor[];
  equipmentCatalog: ResourceEquipment[];
}

export const APUEditorModal: React.FC<APUEditorModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  economicParams,
  suppliers,
  materialsCatalog,
  laborCatalog,
  equipmentCatalog
}) => {
  const [formData, setFormData] = useState<APUItem>(JSON.parse(JSON.stringify(item)));
  const [activeCatalogTab, setActiveCatalogTab] = useState<'material' | 'labor' | 'equipment'>('material');
  const [showCatalogSelector, setShowCatalogSelector] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  if (!isOpen) return null;

  // Mapa de materiales para buscar cotizaciones de proveedores y precios CADECOCRUZ
  const materialDefMap = new Map<string, ResourceMaterial>();
  materialsCatalog.forEach(m => materialDefMap.set(m.id, m));

  // Cálculo en tiempo real del APU con los parámetros actuales
  const calculation = calculateAPU(formData, economicParams);

  // Actualizar campo genérico de un componente
  const handleUpdateComponent = (
    id: string,
    field: keyof APUComponent,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.map(comp => {
        if (comp.id !== id) return comp;
        return {
          ...comp,
          [field]: typeof comp[field] === 'number' ? Number(value) || 0 : value
        };
      })
    }));
  };

  // Asignar cotización específica de proveedor (ej: Soboce vs Fancesa vs Itacamba / Las Lomas vs Monterrey)
  const handleSelectSupplierQuote = (
    compId: string,
    supplierId: string,
    quotePrice: number,
    brandOrNote: string
  ) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.map(comp => {
        if (comp.id !== compId) return comp;
        return {
          ...comp,
          supplierId,
          unitPrice: quotePrice,
          quoteBrand: brandOrNote,
          isCadecocruzRef: false
        };
      })
    }));
  };

  // Aplicar precio referencial oficial de CADECOCRUZ
  const handleApplyCadecocruzRef = (compId: string, cadecocruzPrice: number) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.map(comp => {
        if (comp.id !== compId) return comp;
        return {
          ...comp,
          unitPrice: cadecocruzPrice,
          quoteBrand: 'Referencial CADECOCRUZ',
          isCadecocruzRef: true
        };
      })
    }));
  };

  const handleRemoveComponent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id)
    }));
  };

  const handleAddFromCatalog = (
    type: 'material' | 'labor' | 'equipment',
    resource: ResourceMaterial | ResourceLabor | ResourceEquipment
  ) => {
    let newComp: APUComponent;

    if (type === 'material') {
      const mat = resource as ResourceMaterial;
      const initialQuote = mat.quotes && mat.quotes.length > 0 ? mat.quotes[0] : null;
      newComp = {
        id: `c-mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'material',
        resourceId: mat.id,
        description: mat.name,
        unit: mat.unit,
        quantity: 1.0,
        unitPrice: initialQuote ? initialQuote.price : mat.defaultUnitPrice,
        supplierId: initialQuote ? initialQuote.supplierId : (mat.defaultSupplierId || suppliers[0]?.id || 'sup-itacamba'),
        quoteBrand: initialQuote ? initialQuote.brandOrNote : undefined
      };
    } else if (type === 'labor') {
      const lab = resource as ResourceLabor;
      newComp = {
        id: `c-lab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'labor',
        resourceId: lab.id,
        description: lab.specialty,
        unit: lab.unit,
        quantity: 1.0,
        unitPrice: lab.hourlyRate
      };
    } else {
      const eq = resource as ResourceEquipment;
      newComp = {
        id: `c-eq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'equipment',
        resourceId: eq.id,
        description: eq.name,
        unit: eq.unit,
        quantity: 1.0,
        unitPrice: eq.hourlyRate
      };
    }

    setFormData(prev => ({
      ...prev,
      components: [...prev.components, newComp]
    }));
    setShowCatalogSelector(false);
  };

  const handleAddNewCustomRow = (type: 'material' | 'labor' | 'equipment') => {
    const newComp: APUComponent = {
      id: `c-custom-${Date.now()}`,
      type,
      resourceId: `custom-${Date.now()}`,
      description: type === 'material' ? 'Nuevo Material' : type === 'labor' ? 'Nueva Cuadrilla / Especialidad' : 'Nuevo Equipo / Maquinaria',
      unit: type === 'material' ? 'pza' : type === 'labor' ? 'hh' : 'hora',
      quantity: 1.0,
      unitPrice: 10.0,
      supplierId: type === 'material' ? (suppliers[0]?.id || 'sup-constructor') : undefined
    };

    setFormData(prev => ({
      ...prev,
      components: [...prev.components, newComp]
    }));
  };

  const handleSaveAndExit = () => {
    onSave(formData);
    onClose();
  };

  const materials = formData.components.filter(c => c.type === 'material');
  const labor = formData.components.filter(c => c.type === 'labor');
  const equipment = formData.components.filter(c => c.type === 'equipment');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl my-auto text-slate-900 shadow-2xl flex flex-col max-h-[94vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                Formulario B-2 · SABS Bolivia
              </span>
              <span className="text-xs text-slate-500">Santa Cruz de la Sierra</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <span className="text-emerald-700">{formData.code}:</span> {formData.name}
              <span className="text-xs font-semibold text-slate-500">({formData.unit})</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Precio Unitario Calculado</span>
              <span className="text-xl font-mono font-black text-emerald-700">
                {formatBs(calculation.unitPriceTotal)} / {formData.unit}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-white">
          {/* General Properties Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Código Oficial</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-mono text-xs focus:outline-hidden focus:border-emerald-600 font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción de la Actividad</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-semibold text-xs focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unidad de Medida</label>
              <input
                type="text"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-bold text-xs focus:outline-hidden focus:border-emerald-600 text-center"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Especificación Técnica en Obra</label>
              <input
                type="text"
                value={formData.specification}
                onChange={e => setFormData({ ...formData, specification: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs focus:outline-hidden focus:border-emerald-600"
                placeholder="Dosificación en obra, marcas utilizadas, norma CBH-87 / ACI..."
              />
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-700 font-bold">Agregar componentes al análisis:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveCatalogTab('material');
                  setShowCatalogSelector(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Material del Mercado</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCatalogTab('labor');
                  setShowCatalogSelector(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>+ Mano de Obra</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCatalogTab('equipment');
                  setShowCatalogSelector(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>+ Maquinaria / Equipo</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN 1: MATERIALES CON SELECCIÓN DE MÚLTIPLES PROVEEDORES (SOBOCE/FANCESA/ITACAMBA, LAS LOMAS/MONTERREY, ETC.) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs sm:text-sm">
                  1. Materiales & Opciones de Proveedor (Santa Cruz)
                </h3>
                <span className="text-xs text-slate-500 font-medium">({materials.length} insumos)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Subtotal 1:</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  {formatBs(calculation.materialsTotal)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddNewCustomRow('material')}
                  className="text-xs text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" /> Fila Manual
                </button>
              </div>
            </div>

            {materials.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No hay materiales agregados en este APU. Haz clic en "+ Material del Mercado" para incluir insumos.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Descripción del Material</th>
                      <th className="py-2.5 px-3 w-72">Cotización / Proveedor Cruceño</th>
                      <th className="py-2.5 px-2 text-center w-14">Unidad</th>
                      <th className="py-2.5 px-3 text-right w-24">Rendimiento</th>
                      <th className="py-2.5 px-3 text-right w-24">P. Unitario (Bs)</th>
                      <th className="py-2.5 px-3 text-right w-28">Subtotal (Bs)</th>
                      <th className="py-2.5 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {materials.map(comp => {
                      const lineTotal = comp.quantity * comp.unitPrice;
                      const matDef = materialDefMap.get(comp.resourceId);
                      const hasQuotes = matDef && matDef.quotes && matDef.quotes.length > 0;
                      const hasCadecocruz = matDef && typeof matDef.cadecocruzPrice === 'number';

                      return (
                        <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Descripción */}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={comp.description}
                              onChange={e => handleUpdateComponent(comp.id, 'description', e.target.value)}
                              className="w-full bg-transparent hover:bg-white focus:bg-white text-slate-900 rounded px-1.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 font-bold"
                            />
                            {comp.quoteBrand && (
                              <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                                <Tag className="w-3 h-3" />
                                <span>Marca/Opción: {comp.quoteBrand}</span>
                                {comp.isCadecocruzRef && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1 rounded font-bold">
                                    CADECOCRUZ
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Selector de Cotización / Proveedor Múltiple con Filtrado Estricto por Categoría */}
                          <td className="py-2.5 px-3">
                            {(() => {
                              const validSuppliers = getValidSuppliersForMaterial(
                                {
                                  id: comp.resourceId,
                                  name: comp.description,
                                  category: matDef?.category,
                                  quotes: matDef?.quotes
                                },
                                suppliers
                              );
                              const domain = getMaterialDomain({
                                id: comp.resourceId,
                                name: comp.description,
                                category: matDef?.category
                              });
                              const badgeInfo = getDomainBadgeInfo(domain);
                              const currentSupplierValid = validSuppliers.some(s => s.id === comp.supplierId);
                              const effectiveSupplierId = currentSupplierValid ? comp.supplierId : validSuppliers[0]?.id;

                              return (
                                <div className="space-y-1">
                                  {/* Indicador de categoría estricta de proveedor */}
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${badgeInfo.badgeBg} ${badgeInfo.badgeText}`}
                                      title={badgeInfo.allowedHint}
                                    >
                                      {badgeInfo.label}
                                    </span>
                                  </div>

                                  <select
                                    value={effectiveSupplierId}
                                    onChange={e => {
                                      const selectedId = e.target.value;
                                      const quote = matDef?.quotes?.find(q => q.supplierId === selectedId);
                                      if (quote) {
                                        handleSelectSupplierQuote(comp.id, quote.supplierId, quote.price, quote.brandOrNote);
                                      } else {
                                        handleUpdateComponent(comp.id, 'supplierId', selectedId);
                                      }
                                    }}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-emerald-600 font-semibold"
                                  >
                                    {hasQuotes && matDef?.quotes && (
                                      <optgroup label="Cotizaciones Directas de Fábrica">
                                        {matDef.quotes
                                          .filter(quote => validSuppliers.some(vs => vs.id === quote.supplierId))
                                          .map(quote => (
                                            <option key={quote.supplierId} value={quote.supplierId}>
                                              {quote.supplierName.split('(')[0].trim()} ({formatBs(quote.price)})
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

                                  {/* Botón rápido para consultar / aplicar precio CADECOCRUZ */}
                                  {hasCadecocruz && (
                                    <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleApplyCadecocruzRef(comp.id, matDef.cadecocruzPrice!)}
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                                          comp.isCadecocruzRef
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                        }`}
                                        title="Aplicar precio referencial oficial de la Cámara de la Construcción de Santa Cruz"
                                      >
                                        <span>Ref CADECOCRUZ: {formatBs(matDef.cadecocruzPrice!)}</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>

                          {/* Unidad */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="text"
                              value={comp.unit}
                              onChange={e => handleUpdateComponent(comp.id, 'unit', e.target.value)}
                              className="w-12 text-center bg-transparent hover:bg-white focus:bg-white text-slate-700 font-mono rounded px-1 py-1 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 font-bold"
                            />
                          </td>

                          {/* Rendimiento */}
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              step="0.0001"
                              min="0"
                              value={comp.quantity}
                              onChange={e => handleUpdateComponent(comp.id, 'quantity', e.target.value)}
                              className="w-20 text-right font-mono font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2 py-1 focus:outline-hidden focus:border-emerald-600"
                            />
                          </td>

                          {/* Precio Unitario */}
                          <td className="py-2.5 px-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={comp.unitPrice}
                              onChange={e => {
                                handleUpdateComponent(comp.id, 'unitPrice', e.target.value);
                                handleUpdateComponent(comp.id, 'isCadecocruzRef', false);
                              }}
                              className="w-20 text-right font-mono font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2 py-1 focus:outline-hidden focus:border-emerald-600"
                            />
                          </td>

                          {/* Subtotal */}
                          <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">
                            {formatNumber(lineTotal)}
                          </td>

                          {/* Borrar */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveComponent(comp.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="Eliminar insumo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECCIÓN 2: MANO DE OBRA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs sm:text-sm">
                  2. Mano de Obra (Jornales Santa Cruz)
                </h3>
                <span className="text-xs text-slate-500 font-medium">({labor.length} categorías)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Subtotal 2 (Efectivo):</span>
                <span className="font-mono font-black text-teal-700 text-sm">
                  {formatBs(calculation.laborTotal)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddNewCustomRow('labor')}
                  className="text-xs text-slate-500 hover:text-teal-700 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" /> Fila Manual
                </button>
              </div>
            </div>

            {labor.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                No hay mano de obra asignada. Haz clic en "+ Mano de Obra" para incluir cuadrilla de albañiles.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Especialidad / Cuadrilla</th>
                      <th className="py-2.5 px-2 text-center w-16">Unidad</th>
                      <th className="py-2.5 px-3 text-right w-28">Rendimiento (hh)</th>
                      <th className="py-2.5 px-3 text-right w-28">Jornal (Bs/hh)</th>
                      <th className="py-2.5 px-3 text-right w-32">Subtotal Base (Bs)</th>
                      <th className="py-2.5 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {labor.map(comp => {
                      const lineTotal = comp.quantity * comp.unitPrice;
                      return (
                        <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={comp.description}
                              onChange={e => handleUpdateComponent(comp.id, 'description', e.target.value)}
                              className="w-full bg-transparent hover:bg-white focus:bg-white text-slate-900 rounded px-1.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-teal-600 font-bold"
                            />
                          </td>
                          <td className="py-2 px-2 text-center font-mono text-slate-500 font-semibold">
                            {comp.unit}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={comp.quantity}
                              onChange={e => handleUpdateComponent(comp.id, 'quantity', e.target.value)}
                              className="w-24 text-right font-mono font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2 py-1 focus:outline-hidden focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={comp.unitPrice}
                              onChange={e => handleUpdateComponent(comp.id, 'unitPrice', e.target.value)}
                              className="w-24 text-right font-mono font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2 py-1 focus:outline-hidden focus:border-teal-600"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                            {formatNumber(lineTotal)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveComponent(comp.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Sub-totales de Mano de Obra: Cargas Sociales */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal Mano de Obra Base:</span>
                    <span className="font-mono font-bold text-slate-900">{formatBs(calculation.laborBaseTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Percent className="w-3.5 h-3.5 text-teal-600" />
                      Cargas Sociales ({economicParams.socialChargesPercent.toFixed(1)}% Ley Laboral Bolivia):
                    </span>
                    <span className="font-mono font-bold text-teal-700">+{formatBs(calculation.socialChargesAmount)}</span>
                  </div>
                  {economicParams.vatLaborPercent > 0 && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>RC-IVA Mano de Obra ({economicParams.vatLaborPercent.toFixed(2)}%):</span>
                      <span className="font-mono">+{formatBs(calculation.vatLaborAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-bold text-slate-900">
                    <span>Total Mano de Obra Efectiva (Subtotal 2):</span>
                    <span className="font-mono font-black text-teal-700">{formatBs(calculation.laborTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 3: MAQUINARIA, EQUIPOS Y HERRAMIENTAS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs sm:text-sm">
                  3. Maquinaria, Equipos y Herramientas
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Subtotal 3:</span>
                <span className="font-mono font-black text-amber-700 text-sm">
                  {formatBs(calculation.equipmentTotal)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddNewCustomRow('equipment')}
                  className="text-xs text-slate-500 hover:text-amber-700 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" /> Fila Manual
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Descripción del Equipo / Maquinaria</th>
                    <th className="py-2.5 px-2 text-center w-16">Unidad</th>
                    <th className="py-2.5 px-3 text-right w-28">Rendimiento</th>
                    <th className="py-2.5 px-3 text-right w-28">Tarifa (Bs)</th>
                    <th className="py-2.5 px-3 text-right w-32">Subtotal (Bs)</th>
                    <th className="py-2.5 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {equipment.map(comp => {
                    const lineTotal = comp.quantity * comp.unitPrice;
                    return (
                      <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={comp.description}
                            onChange={e => handleUpdateComponent(comp.id, 'description', e.target.value)}
                            className="w-full bg-transparent hover:bg-white focus:bg-white text-slate-900 rounded px-1.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-amber-600 font-bold"
                          />
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-500 font-semibold">
                          {comp.unit}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={comp.quantity}
                            onChange={e => handleUpdateComponent(comp.id, 'quantity', e.target.value)}
                            className="w-24 text-right font-mono font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2 py-1 focus:outline-hidden focus:border-amber-600"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={comp.unitPrice}
                            onChange={e => handleUpdateComponent(comp.id, 'unitPrice', e.target.value)}
                            className="w-24 text-right font-mono font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2 py-1 focus:outline-hidden focus:border-amber-600"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                          {formatNumber(lineTotal)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveComponent(comp.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Herramientas menores */}
              <div className="bg-slate-50 p-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Equipos Directos:</span>
                  <span className="font-mono font-bold text-slate-900">{formatBs(calculation.equipmentDirectTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    Herramientas Menores ({economicParams.minorToolsPercent.toFixed(1)}% de Mano de Obra Base):
                  </span>
                  <span className="font-mono font-bold text-amber-700">+{formatBs(calculation.minorToolsAmount)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Maquinaria y Equipos (Subtotal 3):</span>
                  <span className="font-mono font-black text-amber-700">{formatBs(calculation.equipmentTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN FINAL FORMULARIO B-2 (COSTO DIRECTO + INDIRECTOS + IT) */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs flex items-center justify-between border-b border-slate-200 pb-2">
              <span>Liquidación Técnica Oficial (Normativa SABS Bolivia)</span>
              <span className="text-[11px] font-semibold text-slate-500">Expresado en Bolivianos (Bs)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>1. Subtotal Materiales:</span>
                  <span className="font-mono font-bold text-slate-900">{formatBs(calculation.materialsTotal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>2. Subtotal Mano de Obra (c/ Cargas Sociales):</span>
                  <span className="font-mono font-bold text-slate-900">{formatBs(calculation.laborTotal)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>3. Subtotal Maquinaria, Equipos y H.M.:</span>
                  <span className="font-mono font-bold text-slate-900">{formatBs(calculation.equipmentTotal)}</span>
                </div>
                <div className="flex justify-between py-2 font-black text-emerald-800 bg-emerald-100/60 px-3 rounded-lg">
                  <span>COSTO DIRECTO TOTAL (CD):</span>
                  <span className="font-mono text-sm">{formatBs(calculation.directCost)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>
                    4. Gastos Generales ({economicParams.generalExpensesPercent.toFixed(1)}% de CD):
                  </span>
                  <span className="font-mono font-bold text-slate-900">+{formatBs(calculation.generalExpensesAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>
                    5. Utilidad del Contratista ({economicParams.utilityPercent.toFixed(1)}%):
                  </span>
                  <span className="font-mono font-bold text-slate-900">+{formatBs(calculation.utilityAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>
                    6. Impuesto a las Transacciones IT ({economicParams.itTaxPercent.toFixed(2)}%):
                  </span>
                  <span className="font-mono font-bold text-slate-900">+{formatBs(calculation.itTaxAmount)}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
                  <span className="uppercase tracking-wider text-xs">
                    PRECIO UNITARIO TOTAL ADOPTADO:
                  </span>
                  <span className="font-mono text-base font-black">
                    {formatBs(calculation.unitPriceTotal)} / {formData.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-2xl sticky bottom-0 z-20">
          <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Los cambios de proveedor y precios recalculan el presupuesto y las órdenes de compra en tiempo real.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
            >
              Guardar Análisis APU
            </button>
          </div>
        </div>
      </div>

      {/* SUB-MODAL: SELECTOR DESDE EL CATÁLOGO */}
      {showCatalogSelector && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 text-slate-900 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                Catálogo de Recursos de Santa Cruz, Bolivia
              </h3>
              <button
                type="button"
                onClick={() => setShowCatalogSelector(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs in Catalog */}
            <div className="flex gap-2 my-3">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('material')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCatalogTab === 'material' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Materiales ({materialsCatalog.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCatalogTab('labor')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCatalogTab === 'labor' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mano de Obra ({laborCatalog.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCatalogTab('equipment')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeCatalogTab === 'equipment' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Equipos ({equipmentCatalog.length})
              </button>
            </div>

            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={catalogSearch}
              onChange={e => setCatalogSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 mb-3 focus:outline-hidden focus:border-emerald-600"
            />

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 text-xs">
              {activeCatalogTab === 'material' && (
                materialsCatalog
                  .filter(m => m.name.toLowerCase().includes(catalogSearch.toLowerCase()))
                  .map(mat => {
                    const defaultSup = suppliers.find(s => s.id === mat.defaultSupplierId);
                    return (
                      <div
                        key={mat.id}
                        className="p-2.5 flex items-center justify-between hover:bg-emerald-50/50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleAddFromCatalog('material', mat)}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{mat.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Unidad: <span className="font-semibold text-emerald-700">{mat.unit}</span> · Proveedor sugerido: {defaultSup?.name || 'General'}
                          </div>
                          {mat.quotes && mat.quotes.length > 0 && (
                            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                              {mat.quotes.length} marcas disponibles ({mat.quotes.map(q => q.brandOrNote.split(' ')[0]).join(', ')})
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-emerald-700 block">
                            {formatBs(mat.defaultUnitPrice)}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">+ Agregar</span>
                        </div>
                      </div>
                    );
                  })
              )}

              {activeCatalogTab === 'labor' && (
                laborCatalog
                  .filter(l => l.specialty.toLowerCase().includes(catalogSearch.toLowerCase()))
                  .map(lab => (
                    <div
                      key={lab.id}
                      className="p-2.5 flex items-center justify-between hover:bg-teal-50/50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleAddFromCatalog('labor', lab)}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{lab.specialty}</div>
                        <div className="text-[11px] text-slate-500">
                          {lab.category} · Unidad: hh
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-teal-700 block">
                          {formatBs(lab.hourlyRate)}/hh
                        </span>
                        <span className="text-[10px] text-teal-600 font-semibold">+ Agregar</span>
                      </div>
                    </div>
                  ))
              )}

              {activeCatalogTab === 'equipment' && (
                equipmentCatalog
                  .filter(e => e.name.toLowerCase().includes(catalogSearch.toLowerCase()))
                  .map(eq => (
                    <div
                      key={eq.id}
                      className="p-2.5 flex items-center justify-between hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleAddFromCatalog('equipment', eq)}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{eq.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {eq.capacity || 'Equipo estándar'} · Unidad: {eq.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-slate-800 block">
                          {formatBs(eq.hourlyRate)}/{eq.unit}
                        </span>
                        <span className="text-[10px] text-slate-600 font-semibold">+ Agregar</span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCatalogSelector(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
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
