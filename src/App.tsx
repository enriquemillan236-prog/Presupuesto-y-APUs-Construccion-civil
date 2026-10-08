import React, { useState, useEffect } from 'react';
import {
  Supplier,
  ResourceMaterial,
  ResourceLabor,
  ResourceEquipment,
  APUItem,
  BudgetItem,
  ProjectInfo,
  EconomicParameters
} from './types/apu';
import {
  INITIAL_SUPPLIERS,
  INITIAL_MATERIALS,
  INITIAL_LABOR,
  INITIAL_EQUIPMENT,
  INITIAL_APU_ITEMS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_PROJECT_INFO,
  INITIAL_ECONOMIC_PARAMETERS
} from './data/boliviaData';
import { calculateAPU, consolidatePurchases } from './utils/calculations';
import { Header } from './components/Header';
import { BudgetModule } from './components/BudgetModule';
import { APUModule } from './components/APUModule';
import { PurchasingModule } from './components/PurchasingModule';
import { SuppliersModule } from './components/SuppliersModule';
import { MaterialsDBModule } from './components/MaterialsDBModule';
import { EconomicParametersModule } from './components/EconomicParametersModule';
import { PrintModal } from './components/PrintModal';

export default function App() {
  // Inicialización con persistencia local asegurando carga de las 56 actividades de Santa Cruz
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(() => {
    const saved = localStorage.getItem('scz_apu_project_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_INFO;
  });

  const [economicParams, setEconomicParams] = useState<EconomicParameters>(() => {
    const saved = localStorage.getItem('scz_apu_params_v3');
    return saved ? JSON.parse(saved) : INITIAL_ECONOMIC_PARAMETERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('scz_apu_suppliers_v3');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [materials, setMaterials] = useState<ResourceMaterial[]>(() => {
    const saved = localStorage.getItem('scz_apu_materials_v3');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [labor, setLabor] = useState<ResourceLabor[]>(() => {
    const saved = localStorage.getItem('scz_apu_labor_v3');
    return saved ? JSON.parse(saved) : INITIAL_LABOR;
  });

  const [equipment, setEquipment] = useState<ResourceEquipment[]>(() => {
    const saved = localStorage.getItem('scz_apu_equipment_v3');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [apuItems, setApuItems] = useState<APUItem[]>(() => {
    const saved = localStorage.getItem('scz_apu_items_v3');
    if (saved) {
      const parsed: APUItem[] = JSON.parse(saved);
      if (parsed.length >= 50) return parsed;
    }
    return INITIAL_APU_ITEMS;
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('scz_apu_budget_v3');
    if (saved) {
      const parsed: BudgetItem[] = JSON.parse(saved);
      if (parsed.length >= 50) return parsed;
    }
    return INITIAL_BUDGET_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<
    'budget' | 'apu' | 'purchasing' | 'suppliers' | 'resources' | 'params'
  >('budget');

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Guardar en localStorage cuando el estado cambie
  useEffect(() => {
    localStorage.setItem('scz_apu_project_v3', JSON.stringify(projectInfo));
  }, [projectInfo]);

  useEffect(() => {
    localStorage.setItem('scz_apu_params_v3', JSON.stringify(economicParams));
  }, [economicParams]);

  useEffect(() => {
    localStorage.setItem('scz_apu_suppliers_v3', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('scz_apu_materials_v3', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('scz_apu_labor_v3', JSON.stringify(labor));
  }, [labor]);

  useEffect(() => {
    localStorage.setItem('scz_apu_equipment_v3', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('scz_apu_items_v3', JSON.stringify(apuItems));
  }, [apuItems]);

  useEffect(() => {
    localStorage.setItem('scz_apu_budget_v3', JSON.stringify(budgetItems));
  }, [budgetItems]);

  // Cálculos globales para los KPIs
  const apuMap = new Map<string, APUItem>();
  apuItems.forEach(i => apuMap.set(i.id, i));

  let totalBudget = 0;
  budgetItems.forEach(b => {
    const apu = apuMap.get(b.apuItemId);
    if (!apu) return;
    const calc = calculateAPU(apu, economicParams);
    totalBudget += calc.unitPriceTotal * b.quantity;
  });

  const { totalPurchasesAmount } = consolidatePurchases(budgetItems, apuItems, suppliers);

  // Reasignar proveedor de un material a nivel transversal en todos los APUs
  const handleUpdateMaterialSupplier = (resourceId: string, newSupplierId: string) => {
    const matDef = materials.find(m => m.id === resourceId);
    const quote = matDef?.quotes?.find(q => q.supplierId === newSupplierId);

    setApuItems(prev =>
      prev.map(apu => ({
        ...apu,
        components: apu.components.map(comp => {
          if (comp.type === 'material' && comp.resourceId === resourceId) {
            return {
              ...comp,
              supplierId: newSupplierId,
              unitPrice: quote ? quote.price : comp.unitPrice,
              quoteBrand: quote ? quote.brandOrNote : comp.quoteBrand,
              isCadecocruzRef: false
            };
          }
          return comp;
        })
      }))
    );
  };

  // Manejadores para APU
  const handleSaveAPU = (updated: APUItem) => {
    setApuItems(prev => {
      const index = prev.findIndex(item => item.id === updated.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const handleDeleteAPU = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta actividad APU?')) {
      setApuItems(prev => prev.filter(i => i.id !== id));
      setBudgetItems(prev => prev.filter(b => b.apuItemId !== id));
    }
  };

  const handleDuplicateAPU = (item: APUItem) => {
    const duplicated: APUItem = {
      ...JSON.parse(JSON.stringify(item)),
      id: `act-${Date.now()}`,
      code: `${item.code}-BIS`,
      name: `${item.name} (Adicional)`
    };
    setApuItems(prev => [...prev, duplicated]);
  };

  // Restablecer datos predeterminados a las 56 actividades de Santa Cruz
  const handleResetData = () => {
    if (confirm('¿Deseas restablecer la lista completa a las 56 actividades oficiales de Santa Cruz, Bolivia?')) {
      localStorage.clear();
      setProjectInfo(INITIAL_PROJECT_INFO);
      setEconomicParams(INITIAL_ECONOMIC_PARAMETERS);
      setSuppliers(INITIAL_SUPPLIERS);
      setMaterials(INITIAL_MATERIALS);
      setLabor(INITIAL_LABOR);
      setEquipment(INITIAL_EQUIPMENT);
      setApuItems(INITIAL_APU_ITEMS);
      setBudgetItems(INITIAL_BUDGET_ITEMS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navegación y Barra Superior Profesional (Slate-900 con acentos esmeralda) */}
      <Header
        projectInfo={projectInfo}
        onUpdateProjectInfo={setProjectInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBudget={totalBudget}
        totalPurchases={totalPurchasesAmount}
        apuCount={apuItems.length}
        supplierCount={suppliers.length}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Contenido Principal según Pestaña Activa con Tarjetas Blancas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'budget' && (
          <BudgetModule
            budgetItems={budgetItems}
            onUpdateBudgetItems={setBudgetItems}
            apuItems={apuItems}
            onUpdateAPUItem={handleSaveAPU}
            economicParams={economicParams}
            suppliers={suppliers}
            materialsCatalog={materials}
            laborCatalog={labor}
            equipmentCatalog={equipment}
            onNavigateToPurchasing={() => setActiveTab('purchasing')}
          />
        )}

        {activeTab === 'apu' && (
          <APUModule
            apuItems={apuItems}
            onSaveAPU={handleSaveAPU}
            onDeleteAPU={handleDeleteAPU}
            onDuplicateAPU={handleDuplicateAPU}
            economicParams={economicParams}
            suppliers={suppliers}
            materialsCatalog={materials}
            laborCatalog={labor}
            equipmentCatalog={equipment}
          />
        )}

        {activeTab === 'purchasing' && (
          <PurchasingModule
            budgetItems={budgetItems}
            apuItems={apuItems}
            suppliers={suppliers}
            projectInfo={projectInfo}
            materialsCatalog={materials}
            onUpdateMaterialSupplier={handleUpdateMaterialSupplier}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersModule
            suppliers={suppliers}
            onUpdateSuppliers={setSuppliers}
            budgetItems={budgetItems}
            apuItems={apuItems}
          />
        )}

        {activeTab === 'resources' && (
          <MaterialsDBModule
            materials={materials}
            onUpdateMaterials={setMaterials}
            labor={labor}
            onUpdateLabor={setLabor}
            equipment={equipment}
            onUpdateEquipment={setEquipment}
            suppliers={suppliers}
          />
        )}

        {activeTab === 'params' && (
          <EconomicParametersModule
            parameters={economicParams}
            onUpdateParameters={setEconomicParams}
          />
        )}
      </main>

      {/* Modal de Impresión / Exportación Oficial */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        projectInfo={projectInfo}
        budgetItems={budgetItems}
        apuItems={apuItems}
        suppliers={suppliers}
        economicParams={economicParams}
      />

      {/* Footer Técnico */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-slate-700">
              Sistema APU & Presupuestos · Santa Cruz, Bolivia (56 Actividades Oficiales)
            </span>
          </div>
          <div>
            <span>Moneda: Bolivianos (Bs) · Formulario B-2 SABS · Colegio de Ingenieros Civiles de Santa Cruz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
