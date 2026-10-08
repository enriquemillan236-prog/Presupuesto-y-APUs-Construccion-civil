export type ResourceType = 'material' | 'labor' | 'equipment';

export interface SupplierQuote {
  supplierId: string;
  supplierName: string;
  price: number; // Bs
  brandOrNote: string; // Ej: "Warnes IP-30 (Soboce)", "Fancesa Superior", "Itacamba Yacuses", "Las Lomas Belgo Bekaert", "Monterrey B500"
}

export interface Supplier {
  id: string;
  name: string;
  nit: string;
  phone: string;
  city: string; // Santa Cruz de la Sierra, etc.
  address: string;
  email: string;
  notes?: string;
  category: string; // 'Cementera', 'Aceros y Metales', 'Cerámica y Ladrillos', 'Ferretería General', 'Áridos y Cantera', etc.
}

export interface ResourceMaterial {
  id: string;
  name: string;
  unit: string; // bolsa, kg, m3, pza, barra, pt, galón, etc.
  category: string;
  defaultUnitPrice: number; // Bs
  defaultSupplierId: string;
  specification?: string;
  cadecocruzPrice?: number; // Precio referencial Cámara de la Construcción de Santa Cruz (CADECOCRUZ)
  quotes?: SupplierQuote[]; // Opciones de múltiples proveedores cruceños
}

export interface ResourceLabor {
  id: string;
  specialty: string;
  unit: string; // 'hh' (hora-hombre)
  hourlyRate: number; // Bs/hh
  category: 'Especialista' | 'Mano de Obra Calificada' | 'Ayudante';
}

export interface ResourceEquipment {
  id: string;
  name: string;
  unit: string; // 'hora' o 'dia'
  hourlyRate: number; // Bs/hora
  capacity?: string;
}

export interface APUComponent {
  id: string;
  type: ResourceType;
  resourceId: string;
  description: string;
  unit: string;
  quantity: number; // Rendimiento por unidad de ítem
  unitPrice: number; // Precio unitario en Bs
  supplierId?: string; // Para materiales
  quoteBrand?: string; // Marca o proveedor específico seleccionado (ej: "Itacamba", "Las Lomas")
  isCadecocruzRef?: boolean; // Si usa precio referencial de CADECOCRUZ
}

export interface EconomicParameters {
  socialChargesPercent: number; // % Cargas Sociales (e.g. 55.0% a 71.18%)
  vatLaborPercent: number; // % IVA de M.O. / RC-IVA (e.g. 14.94% o 0% si ya incluye factura)
  minorToolsPercent: number; // % Herramientas menores sobre Mano de Obra (e.g. 5.0%)
  generalExpensesPercent: number; // % Gastos Generales (e.g. 10.0%)
  utilityPercent: number; // % Utilidad del contratista (e.g. 10.0%)
  itTaxPercent: number; // % Impuesto a las Transacciones (3.0% o 3.09%)
}

export interface APUItem {
  id: string;
  code: string; // Ej: ACT-01, ACT-02...
  name: string; // Ej: "INSTALACION DE FAENAS", "COLUMNAS DE HORMIGON ARMADO"
  unit: string; // GBL, M3, M2, ML, PZA, PTO
  category: string;
  specification: string;
  components: APUComponent[];
  customParameters?: Partial<EconomicParameters>;
}

export interface BudgetItem {
  id: string;
  apuItemId: string;
  itemNumber: number;
  quantity: number; // Metrado de la obra
  notes?: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  client: string;
  location: string;
  city: string;
  date: string;
  supervisor: string;
  currency: string;
  economicParameters: EconomicParameters;
}

export interface APUCalculationResult {
  // Subtotales directos
  materialsTotal: number;
  laborBaseTotal: number;
  socialChargesAmount: number;
  vatLaborAmount: number;
  laborTotal: number;
  equipmentDirectTotal: number;
  minorToolsAmount: number;
  equipmentTotal: number;

  // Costo Directo
  directCost: number;

  // Indirectos
  generalExpensesAmount: number;
  technicalCost: number; // CD + GG
  utilityAmount: number;
  netCost: number; // CD + GG + Utilidad
  itTaxAmount: number;

  // Precio final
  unitPriceTotal: number;

  // Desgloses porcentuales
  breakdown: {
    materialsPct: number;
    laborPct: number;
    equipmentPct: number;
    indirectsPct: number;
  };
}

export interface ConsolidatedPurchaseItem {
  resourceId: string;
  name: string;
  unit: string;
  supplierId: string;
  supplierName: string;
  brandOrNote?: string;
  totalQuantity: number;
  unitPrice: number;
  subtotal: number;
  usedInItems: {
    apuCode: string;
    apuName: string;
    quantity: number;
    totalAmount: number;
  }[];
}

export interface SupplierPurchaseOrder {
  supplier: Supplier;
  items: ConsolidatedPurchaseItem[];
  totalAmount: number;
  orderNumber: string;
  date: string;
}
