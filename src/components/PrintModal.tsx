import React, { useState } from 'react';
import {
  ProjectInfo,
  BudgetItem,
  APUItem,
  Supplier,
  EconomicParameters
} from '../types/apu';
import { calculateAPU, consolidatePurchases, formatBs, formatQty } from '../utils/calculations';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectInfo: ProjectInfo;
  budgetItems: BudgetItem[];
  apuItems: APUItem[];
  suppliers: Supplier[];
  economicParams: EconomicParameters;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  projectInfo,
  budgetItems,
  apuItems,
  suppliers,
  economicParams
}) => {
  const [reportType, setReportType] = useState<'budget' | 'apu' | 'purchases'>('budget');
  const [selectedAPUId, setSelectedAPUId] = useState<string>(apuItems[0]?.id || '');

  if (!isOpen) return null;

  const apuMap = new Map<string, APUItem>();
  apuItems.forEach(a => apuMap.set(a.id, a));

  const currentAPU = apuMap.get(selectedAPUId) || apuItems[0];
  const currentAPUCalc = currentAPU ? calculateAPU(currentAPU, economicParams) : null;

  const { ordersBySupplier, totalPurchasesAmount } = consolidatePurchases(budgetItems, apuItems, suppliers);

  // Totales de presupuesto
  let grandTotalBudget = 0;
  budgetItems.forEach(b => {
    const a = apuMap.get(b.apuItemId);
    if (!a) return;
    const c = calculateAPU(a, economicParams);
    grandTotalBudget += c.unitPriceTotal * b.quantity;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl my-auto text-slate-900 shadow-2xl flex flex-col max-h-[95vh]">
        {/* Controls Bar (Hidden during printing) */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-t-2xl sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Centro de Reportes & Exportación Oficial (Santa Cruz)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Report Selector */}
            <div className="flex bg-slate-200/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setReportType('budget')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  reportType === 'budget' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                1. Presupuesto (56 Ítems)
              </button>
              <button
                type="button"
                onClick={() => setReportType('apu')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  reportType === 'apu' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                2. Formulario B-2 (APU)
              </button>
              <button
                type="button"
                onClick={() => setReportType('purchases')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  reportType === 'purchases' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                3. Compras por Proveedor
              </button>
            </div>

            {reportType === 'apu' && (
              <select
                value={selectedAPUId}
                onChange={e => setSelectedAPUId(e.target.value)}
                className="bg-white border border-slate-300 text-xs text-slate-900 font-medium rounded-lg px-2.5 py-1.5 max-w-xs truncate focus:outline-hidden focus:border-emerald-600"
              >
                {apuItems.map(a => (
                  <option key={a.id} value={a.id}>
                    [{a.code}] {a.name}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SHEET */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 printable-area text-xs">
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-900 pb-3 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-900">
                  {reportType === 'budget' && 'PLANILLA DE PRESUPUESTO GENERAL DE OBRA'}
                  {reportType === 'apu' && 'FORMULARIO B-2: ANÁLISIS DE PRECIOS UNITARIOS'}
                  {reportType === 'purchases' && 'CONSOLIDADO GENERAL DE COMPRAS POR PROVEEDOR'}
                </h1>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  SANTA CRUZ DE LA SIERRA, BOLIVIA · COLEGIO DE INGENIEROS CIVILES DE SANTA CRUZ (CIC-SC)
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-xs text-slate-800 block">
                  Fecha: {projectInfo.date}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Moneda: Bolivianos (Bs)
                </span>
              </div>
            </div>

            {/* Project Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mt-3 pt-2 border-t border-slate-200 bg-slate-50 p-2.5 rounded-lg">
              <div>
                <span className="text-slate-500 block">Proyecto / Obra:</span>
                <strong className="text-slate-800">{projectInfo.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Cliente:</span>
                <strong className="text-slate-800">{projectInfo.client}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Ubicación / Ciudad:</span>
                <strong className="text-slate-800">{projectInfo.city}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Ingeniero Responsable:</span>
                <strong className="text-slate-800">{projectInfo.supervisor}</strong>
              </div>
            </div>
          </div>

          {/* REPORT 1: PRESUPUESTO GENERAL */}
          {reportType === 'budget' && (
            <div className="space-y-4">
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 uppercase font-bold text-[10px] border-b border-slate-300">
                    <th className="p-2 border border-slate-300 text-center w-10">N°</th>
                    <th className="p-2 border border-slate-300 w-20">Código</th>
                    <th className="p-2 border border-slate-300">Descripción Oficial de la Actividad</th>
                    <th className="p-2 border border-slate-300 text-center w-14">Unidad</th>
                    <th className="p-2 border border-slate-300 text-right w-24">Metrado</th>
                    <th className="p-2 border border-slate-300 text-right w-28">P. Unitario (Bs)</th>
                    <th className="p-2 border border-slate-300 text-right w-32">Total Parcial (Bs)</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetItems.map((b, idx) => {
                    const apu = apuMap.get(b.apuItemId);
                    if (!apu) return null;
                    const c = calculateAPU(apu, economicParams);
                    const sub = c.unitPriceTotal * b.quantity;
                    return (
                      <tr key={b.id} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-300 text-center font-mono">{b.itemNumber || idx + 1}</td>
                        <td className="p-2 border border-slate-300 font-mono font-bold text-slate-800">{apu.code}</td>
                        <td className="p-2 border border-slate-300 font-medium">
                          {apu.name}
                          {b.notes && <div className="text-[10px] text-slate-500 italic">{b.notes}</div>}
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-mono font-semibold">{apu.unit}</td>
                        <td className="p-2 border border-slate-300 text-right font-mono font-bold">
                          {formatQty(b.quantity)}
                        </td>
                        <td className="p-2 border border-slate-300 text-right font-mono">
                          {c.unitPriceTotal.toFixed(2)}
                        </td>
                        <td className="p-2 border border-slate-300 text-right font-mono font-bold">
                          {sub.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-900">
                    <td colSpan={6} className="p-2 text-right uppercase border border-slate-300">
                      MONTO TOTAL DEL PRESUPUESTO (Bs.):
                    </td>
                    <td className="p-2 text-right font-mono text-sm font-black border border-slate-300">
                      {formatBs(grandTotalBudget)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* REPORT 2: FORMULARIO B-2 APU */}
          {reportType === 'apu' && currentAPU && currentAPUCalc && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Actividad de Obra:</span>
                  <div className="text-sm font-bold text-slate-900">
                    <span className="text-emerald-800 font-mono">[{currentAPU.code}]</span> {currentAPU.name}
                  </div>
                  <div className="text-[11px] text-slate-600 italic mt-0.5">{currentAPU.specification}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Unidad</span>
                  <span className="font-mono font-bold text-base text-slate-900">{currentAPU.unit}</span>
                </div>
              </div>

              {/* 1. Materiales */}
              <div>
                <div className="font-bold uppercase text-[11px] text-slate-800 mb-1 border-b border-slate-400 pb-0.5 flex justify-between">
                  <span>1. MATERIALES</span>
                  <span className="font-mono">Subtotal 1: {formatBs(currentAPUCalc.materialsTotal)}</span>
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 mb-2">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold uppercase">
                      <th className="p-1.5 border border-slate-300">Descripción del Insumo</th>
                      <th className="p-1.5 border border-slate-300 text-center w-14">Unidad</th>
                      <th className="p-1.5 border border-slate-300 text-right w-24">Rendimiento</th>
                      <th className="p-1.5 border border-slate-300 text-right w-24">P. Unitario</th>
                      <th className="p-1.5 border border-slate-300 text-right w-28">Subtotal (Bs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAPU.components.filter(c => c.type === 'material').map(m => (
                      <tr key={m.id} className="border-b border-slate-200">
                        <td className="p-1.5 border border-slate-300">{m.description}</td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono">{m.unit}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono">{formatQty(m.quantity)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono">{m.unitPrice.toFixed(2)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-bold">{(m.quantity * m.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 2. Mano de Obra */}
              <div>
                <div className="font-bold uppercase text-[11px] text-slate-800 mb-1 border-b border-slate-400 pb-0.5 flex justify-between">
                  <span>2. MANO DE OBRA</span>
                  <span className="font-mono">Subtotal 2: {formatBs(currentAPUCalc.laborTotal)}</span>
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 mb-1">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold uppercase">
                      <th className="p-1.5 border border-slate-300">Especialidad</th>
                      <th className="p-1.5 border border-slate-300 text-center w-14">Unidad</th>
                      <th className="p-1.5 border border-slate-300 text-right w-24">Rendimiento</th>
                      <th className="p-1.5 border border-slate-300 text-right w-24">Jornal (Bs/hh)</th>
                      <th className="p-1.5 border border-slate-300 text-right w-28">Subtotal Base</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAPU.components.filter(c => c.type === 'labor').map(l => (
                      <tr key={l.id} className="border-b border-slate-200">
                        <td className="p-1.5 border border-slate-300">{l.description}</td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono">{l.unit}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono">{formatQty(l.quantity)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono">{l.unitPrice.toFixed(2)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-bold">{(l.quantity * l.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[11px] bg-slate-50 p-2 border border-slate-200 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Subtotal Mano de Obra Base:</span>
                    <span className="font-mono">{formatBs(currentAPUCalc.laborBaseTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cargas Sociales ({economicParams.socialChargesPercent.toFixed(1)}%):</span>
                    <span className="font-mono">+{formatBs(currentAPUCalc.socialChargesAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-300 pt-0.5">
                    <span>Total Mano de Obra Efectiva:</span>
                    <span className="font-mono">{formatBs(currentAPUCalc.laborTotal)}</span>
                  </div>
                </div>
              </div>

              {/* 3. Equipos */}
              <div>
                <div className="font-bold uppercase text-[11px] text-slate-800 mb-1 border-b border-slate-400 pb-0.5 flex justify-between">
                  <span>3. MAQUINARIA, EQUIPOS Y HERRAMIENTAS</span>
                  <span className="font-mono">Subtotal 3: {formatBs(currentAPUCalc.equipmentTotal)}</span>
                </div>
                <table className="w-full text-left border-collapse border border-slate-300 mb-1">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold uppercase">
                      <th className="p-1.5 border border-slate-300">Descripción del Equipo</th>
                      <th className="p-1.5 border border-slate-300 text-center w-14">Unidad</th>
                      <th className="p-1.5 border border-slate-300 text-right w-24">Rendimiento</th>
                      <th className="p-1.5 border border-slate-300 text-right w-24">Tarifa (Bs)</th>
                      <th className="p-1.5 border border-slate-300 text-right w-28">Subtotal (Bs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAPU.components.filter(c => c.type === 'equipment').map(eq => (
                      <tr key={eq.id} className="border-b border-slate-200">
                        <td className="p-1.5 border border-slate-300">{eq.description}</td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono">{eq.unit}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono">{formatQty(eq.quantity)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono">{eq.unitPrice.toFixed(2)}</td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-bold">{(eq.quantity * eq.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[11px] bg-slate-50 p-2 border border-slate-200 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Herramientas Menores ({economicParams.minorToolsPercent.toFixed(1)}% de Mano de Obra Base):</span>
                    <span className="font-mono">+{formatBs(currentAPUCalc.minorToolsAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-300 pt-0.5">
                    <span>Total Maquinaria y Equipos:</span>
                    <span className="font-mono">{formatBs(currentAPUCalc.equipmentTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Liquidación oficial SABS */}
              <div className="border-2 border-slate-900 p-3 bg-slate-50 text-[11px] space-y-1">
                <div className="flex justify-between font-bold text-slate-900 border-b border-slate-300 pb-1">
                  <span>COSTO DIRECTO TOTAL (1 + 2 + 3):</span>
                  <span className="font-mono">{formatBs(currentAPUCalc.directCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos Generales ({economicParams.generalExpensesPercent.toFixed(1)}% de CD):</span>
                  <span className="font-mono">+{formatBs(currentAPUCalc.generalExpensesAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilidad del Contratista ({economicParams.utilityPercent.toFixed(1)}%):</span>
                  <span className="font-mono">+{formatBs(currentAPUCalc.utilityAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuesto a las Transacciones IT ({economicParams.itTaxPercent.toFixed(2)}%):</span>
                  <span className="font-mono">+{formatBs(currentAPUCalc.itTaxAmount)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 border-t-2 border-slate-900 pt-1">
                  <span>PRECIO UNITARIO TOTAL ADOPTADO:</span>
                  <span className="font-mono">{formatBs(currentAPUCalc.unitPriceTotal)} / {currentAPU.unit}</span>
                </div>
              </div>
            </div>
          )}

          {/* REPORT 3: CONSOLIDADO DE COMPRAS */}
          {reportType === 'purchases' && (
            <div className="space-y-6">
              {ordersBySupplier.map(ord => (
                <div key={ord.supplier.id} className="border border-slate-300 rounded-xl p-3 bg-slate-50/50">
                  <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-2">
                    <div>
                      <strong className="text-xs uppercase text-slate-900">{ord.supplier.name}</strong>
                      <div className="text-[10px] text-slate-500">
                        NIT: {ord.supplier.nit} · {ord.supplier.city} · Tel: {ord.supplier.phone}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-800 text-xs">
                        Subtotal: {formatBs(ord.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold uppercase text-[9px]">
                        <th className="p-1 border border-slate-200">Material</th>
                        <th className="p-1 border border-slate-200 text-center w-12">Unidad</th>
                        <th className="p-1 border border-slate-200 text-right w-20">Cantidad</th>
                        <th className="p-1 border border-slate-200 text-right w-24">P. Unitario</th>
                        <th className="p-1 border border-slate-200 text-right w-28">Subtotal (Bs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ord.items.map(it => (
                        <tr key={it.resourceId} className="border-b border-slate-100">
                          <td className="p-1 border border-slate-200">{it.name}</td>
                          <td className="p-1 border border-slate-200 text-center font-mono">{it.unit}</td>
                          <td className="p-1 border border-slate-200 text-right font-mono font-bold">{formatQty(it.totalQuantity)}</td>
                          <td className="p-1 border border-slate-200 text-right font-mono">{it.unitPrice.toFixed(2)}</td>
                          <td className="p-1 border border-slate-200 text-right font-mono font-bold">{it.subtotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <div className="text-right font-black text-sm border-t-2 border-slate-900 pt-2 text-slate-900">
                TOTAL GENERAL COMPRAS DE OBRA: {formatBs(totalPurchasesAmount)}
              </div>
            </div>
          )}

          {/* Signature Footer */}
          <div className="grid grid-cols-2 gap-10 pt-12 text-center text-xs mt-6 border-t border-slate-200">
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-800">{projectInfo.supervisor}</div>
              <div className="text-slate-500 text-[10px]">Ingeniero Especialista de Costos y Presupuestos</div>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <div className="font-bold text-slate-800">Dirección de Obra / Supervisión</div>
              <div className="text-slate-500 text-[10px]">Santa Cruz de la Sierra, Bolivia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
