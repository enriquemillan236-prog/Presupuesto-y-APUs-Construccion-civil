import React from 'react';
import { EconomicParameters } from '../types/apu';
import { Settings, Percent, Info, ShieldCheck, Scale, Award } from 'lucide-react';

interface EconomicParametersModuleProps {
  parameters: EconomicParameters;
  onUpdateParameters: (params: EconomicParameters) => void;
}

export const EconomicParametersModule: React.FC<EconomicParametersModuleProps> = ({
  parameters,
  onUpdateParameters
}) => {
  const handleChange = (field: keyof EconomicParameters, value: number) => {
    onUpdateParameters({
      ...parameters,
      [field]: Number(value) || 0
    });
  };

  const applyPreset = (presetName: 'sabs' | 'private' | 'major') => {
    if (presetName === 'sabs') {
      onUpdateParameters({
        socialChargesPercent: 55.0,
        vatLaborPercent: 0.0,
        minorToolsPercent: 5.0,
        generalExpensesPercent: 10.0,
        utilityPercent: 10.0,
        itTaxPercent: 3.09
      });
    } else if (presetName === 'private') {
      onUpdateParameters({
        socialChargesPercent: 45.0,
        vatLaborPercent: 0.0,
        minorToolsPercent: 5.0,
        generalExpensesPercent: 8.0,
        utilityPercent: 12.0,
        itTaxPercent: 3.0
      });
    } else if (presetName === 'major') {
      onUpdateParameters({
        socialChargesPercent: 71.18,
        vatLaborPercent: 14.94,
        minorToolsPercent: 5.0,
        generalExpensesPercent: 12.0,
        utilityPercent: 10.0,
        itTaxPercent: 3.09
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Marco Normativo y Contable
          </span>
          <span className="text-slate-400 text-xs">·</span>
          <span className="text-xs text-slate-500 font-semibold">D.S. 0181 SABS Bolivia</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          Parámetros Económicos, Sociales e Impositivos (Santa Cruz)
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl">
          Configura los coeficientes de incidencia que se aplicarán automáticamente a cada uno de los 56 Análisis de Precios Unitarios (APU). En Bolivia estos factores están regulados por la Ley General del Trabajo y los Pliegos de Contrataciones Estatales.
        </p>
      </div>

      {/* Preset Profiles */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-2">
          Perfiles Preconfigurados:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => applyPreset('sabs')}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors group"
          >
            <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-800 flex items-center justify-between">
              <span>Licitación SABS Estándar</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              C. Sociales: 55% · H. Menores: 5% · GG: 10% · Util: 10% · IT: 3.09%
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('private')}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-colors group"
          >
            <div className="font-bold text-slate-900 text-xs group-hover:text-teal-800 flex items-center justify-between">
              <span>Obra Privada Urbana</span>
              <Scale className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              C. Sociales: 45% · H. Menores: 5% · GG: 8% · Util: 12% · IT: 3.0%
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('major')}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors group"
          >
            <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-800 flex items-center justify-between">
              <span>Gran Obra Institucional</span>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              C. Sociales: 71.18% · IVA MO: 14.94% · GG: 12% · Util: 10% · IT: 3.09%
            </div>
          </button>
        </div>
      </div>

      {/* Main Parameters Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda: Cargas de Mano de Obra y Equipos */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            Incidencia Directa (Mano de Obra & Equipos)
          </h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Cargas Sociales sobre Mano de Obra (%)
              </label>
              <span className="font-mono text-emerald-700 font-bold text-sm">
                {parameters.socialChargesPercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={parameters.socialChargesPercent}
              onChange={e => handleChange('socialChargesPercent', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm focus:outline-hidden focus:border-emerald-600 font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Cubre beneficios obligatorios en Bolivia: Aguinaldo (8.33%), Indemnización (8.33%), Caja Nacional de Salud CNS (10%), Seguro solidario y aporte patronal (3%), Aporte Pro-Vivienda (2%), subsidios y ropa de trabajo. Rango típico: 55% a 71.18%.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Herramientas Menores (% sobre Mano de Obra Base)
              </label>
              <span className="font-mono text-teal-700 font-bold text-sm">
                {parameters.minorToolsPercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              max="30"
              value={parameters.minorToolsPercent}
              onChange={e => handleChange('minorToolsPercent', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm focus:outline-hidden focus:border-emerald-600 font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Desgaste y reposición de palas, picotas, carretillas, combos, reglas y baldes. La práctica boliviana fija este rubro entre el 3% y el 7% de la Mano de Obra base.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                RC-IVA Mano de Obra (%)
              </label>
              <span className="font-mono text-slate-700 font-bold text-sm">
                {parameters.vatLaborPercent.toFixed(2)}%
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              max="20"
              value={parameters.vatLaborPercent}
              onChange={e => handleChange('vatLaborPercent', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm focus:outline-hidden focus:border-emerald-600 font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Factor de retención 14.94% cuando la mano de obra no emite factura tributaria individual. (Dejar en 0.00% si se paga jornal neto de obra).
            </p>
          </div>
        </div>

        {/* Columna Derecha: Indirectos, Utilidad e Impuestos */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            Costos Indirectos, Margen & Tributos
          </h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Gastos Generales GG (% sobre Costo Directo)
              </label>
              <span className="font-mono text-slate-900 font-bold text-sm">
                {parameters.generalExpensesPercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              value={parameters.generalExpensesPercent}
              onChange={e => handleChange('generalExpensesPercent', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm focus:outline-hidden focus:border-emerald-600 font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Gastos de administración central, movilización de campamento, papelería, seguros y honorarios de dirección técnica. Estándar: 8% a 15%.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Utilidad del Contratista (%)
              </label>
              <span className="font-mono text-emerald-700 font-bold text-sm">
                {parameters.utilityPercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              value={parameters.utilityPercent}
              onChange={e => handleChange('utilityPercent', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm focus:outline-hidden focus:border-emerald-600 font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Margen de beneficio esperado por la empresa constructora en Santa Cruz antes de impuestos societarios. Se calcula sobre (Costo Directo + Gastos Generales). Estándar: 10.0%.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Impuesto a las Transacciones IT (%)
              </label>
              <span className="font-mono text-rose-600 font-bold text-sm">
                {parameters.itTaxPercent.toFixed(2)}%
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              max="15"
              value={parameters.itTaxPercent}
              onChange={e => handleChange('itTaxPercent', Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-sm focus:outline-hidden focus:border-emerald-600 font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              El IT nominal en Bolivia es 3.00%. En la fórmula oficial del SABS la incidencia efectiva es <strong>3.09%</strong> (calculado como 3 / (100 - 3) * 100).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
