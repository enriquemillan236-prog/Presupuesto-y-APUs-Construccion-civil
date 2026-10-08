import React, { useState } from 'react';
import { ProjectInfo } from '../types/apu';
import {
  Building2,
  Calendar,
  MapPin,
  UserCheck,
  Settings,
  Printer,
  RotateCcw,
  Layers,
  Calculator,
  ShoppingCart,
  Truck,
  Database,
  Edit3
} from 'lucide-react';
import { formatBs } from '../utils/calculations';

interface HeaderProps {
  projectInfo: ProjectInfo;
  onUpdateProjectInfo: (info: ProjectInfo) => void;
  activeTab: 'budget' | 'apu' | 'purchasing' | 'suppliers' | 'resources' | 'params';
  setActiveTab: (tab: 'budget' | 'apu' | 'purchasing' | 'suppliers' | 'resources' | 'params') => void;
  totalBudget: number;
  totalPurchases: number;
  apuCount: number;
  supplierCount: number;
  onOpenPrint: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectInfo,
  onUpdateProjectInfo,
  activeTab,
  setActiveTab,
  totalBudget,
  totalPurchases,
  apuCount,
  supplierCount,
  onOpenPrint,
  onResetData
}) => {
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [tempProject, setTempProject] = useState<ProjectInfo>(projectInfo);

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProjectInfo(tempProject);
    setIsEditingProject(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      {/* Top Banner: Brand and Project Quick Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
              🏗️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  Santa Cruz de la Sierra · Bolivia
                </span>
                <span className="text-slate-600 text-xs">|</span>
                <span className="text-xs text-slate-400 font-mono">56 Actividades de Obra</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                APU & Presupuestos de Construcción
              </h1>
            </div>
          </div>

          {/* Quick Metrics Bar in Top Header */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Presupuesto General</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                {formatBs(totalBudget)}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Compras Materiales</span>
              <span className="font-mono text-base font-bold text-teal-300">
                {formatBs(totalPurchases)}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenPrint}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-xs"
                title="Generar planilla de impresión oficial"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Reporte</span>
              </button>
              <button
                type="button"
                onClick={onResetData}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 border border-slate-700"
                title="Restablecer a las 56 actividades oficiales de Santa Cruz"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restablecer 56 Ítems</span>
              </button>
            </div>
          </div>
        </div>

        {/* Project Sub-Bar */}
        <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{projectInfo.name}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{projectInfo.location} · {projectInfo.city}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <div className="flex items-center gap-1 text-slate-400">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>{projectInfo.supervisor}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTempProject(projectInfo);
              setIsEditingProject(true);
            }}
            className="self-start sm:self-auto text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar Datos de Proyecto</span>
          </button>
        </div>

        {/* Navigation Tabs - Emerald Active States */}
        <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-1 pb-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'budget'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Presupuesto de Obra (56 Actividades)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apu')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'apu'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>2. Matriz de APU ({apuCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('purchasing')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'purchasing'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>3. Compras por Proveedor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suppliers')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'suppliers'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Proveedores Santa Cruz ({supplierCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'resources'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Insumos & Jornales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('params')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'params'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cargas Sociales & GG</span>
          </button>
        </nav>
      </div>

      {/* Modal: Edit Project Info */}
      {isEditingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Editar Información de la Obra en Santa Cruz
            </h3>
            <form onSubmit={handleSaveProject} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre del Proyecto u Obra
                </label>
                <input
                  type="text"
                  required
                  value={tempProject.name}
                  onChange={e => setTempProject({ ...tempProject, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cliente / Propietario
                  </label>
                  <input
                    type="text"
                    value={tempProject.client}
                    onChange={e => setTempProject({ ...tempProject, client: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ciudad / Departamento
                  </label>
                  <input
                    type="text"
                    value={tempProject.city}
                    onChange={e => setTempProject({ ...tempProject, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ubicación (Condominio / Zona / Anillo)
                </label>
                <input
                  type="text"
                  value={tempProject.location}
                  onChange={e => setTempProject({ ...tempProject, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ingeniero Residente / Supervisor
                  </label>
                  <input
                    type="text"
                    value={tempProject.supervisor}
                    onChange={e => setTempProject({ ...tempProject, supervisor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha del Presupuesto
                  </label>
                  <input
                    type="text"
                    value={tempProject.date}
                    onChange={e => setTempProject({ ...tempProject, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingProject(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
