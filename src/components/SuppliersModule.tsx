import React, { useState } from 'react';
import { Supplier, BudgetItem, APUItem } from '../types/apu';
import { consolidatePurchases, formatBs } from '../utils/calculations';
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  FileText,
  Search,
  CheckCircle
} from 'lucide-react';

interface SuppliersModuleProps {
  suppliers: Supplier[];
  onUpdateSuppliers: (suppliers: Supplier[]) => void;
  budgetItems: BudgetItem[];
  apuItems: APUItem[];
}

export const SuppliersModule: React.FC<SuppliersModuleProps> = ({
  suppliers,
  onUpdateSuppliers,
  budgetItems,
  apuItems
}) => {
  const [search, setSearch] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isNewSupplier, setIsNewSupplier] = useState(false);

  // Obtener montos acumulados por proveedor
  const { ordersBySupplier } = consolidatePurchases(budgetItems, apuItems, suppliers);
  const totalsMap = new Map<string, number>();
  ordersBySupplier.forEach(o => totalsMap.set(o.supplier.id, o.totalAmount));

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.nit.includes(search)
  );

  const handleOpenNew = () => {
    setIsNewSupplier(true);
    setEditingSupplier({
      id: `sup-${Date.now()}`,
      name: '',
      nit: '',
      phone: '+591 ',
      city: 'Santa Cruz de la Sierra',
      address: '',
      email: '',
      category: 'Ferretería General',
      notes: ''
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;

    if (isNewSupplier) {
      onUpdateSuppliers([...suppliers, editingSupplier]);
    } else {
      onUpdateSuppliers(
        suppliers.map(s => (s.id === editingSupplier.id ? editingSupplier : s))
      );
    }
    setEditingSupplier(null);
  };

  const handleDelete = (id: string) => {
    if (suppliers.length <= 1) {
      alert('Debe existir al menos un proveedor en el sistema.');
      return;
    }
    onUpdateSuppliers(suppliers.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            Proveedores y Ferreterías en Santa Cruz, Bolivia
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Administra los comercios locales de referencia para cotizaciones y emisión de órdenes de compra.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Proveedor</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar proveedor por nombre, NIT, rubro o dirección..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 shadow-xs"
        />
      </div>

      {/* Grid of Suppliers in Clean White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(sup => {
          const totalAssigned = totalsMap.get(sup.id) || 0;

          return (
            <div
              key={sup.id}
              className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-md shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">
                    {sup.category}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">NIT: {sup.nit}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1" title={sup.name}>
                  {sup.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{sup.city} · {sup.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                  {sup.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{sup.email}</span>
                    </div>
                  )}
                </div>

                {sup.notes && (
                  <p className="mt-2.5 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{sup.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Compras en esta obra</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">
                    {formatBs(totalAssigned)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewSupplier(false);
                      setEditingSupplier(sup);
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Editar datos de proveedor"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(sup.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar proveedor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Editar o Crear Proveedor */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              {isNewSupplier ? 'Registrar Proveedor en Santa Cruz' : 'Editar Datos de Proveedor'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Razón Social / Nombre Comercial</label>
                <input
                  type="text"
                  required
                  value={editingSupplier.name}
                  onChange={e => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder="Ej: Comercial Santa Cruz Materiales"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NIT</label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.nit}
                    onChange={e => setEditingSupplier({ ...editingSupplier, nit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-emerald-600"
                    placeholder="1029384021"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rubro / Categoría Oficial</label>
                  <select
                    value={editingSupplier.category}
                    onChange={e => setEditingSupplier({ ...editingSupplier, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                  >
                    <option value="Cementera">Cementera (Fábrica / Distribuidora)</option>
                    <option value="Aceros y Metales">Aceros y Metales (Fierro / Mallas)</option>
                    <option value="Cerámica y Ladrillos">Cerámica y Ladrillos (Fábrica 6H / Tejas)</option>
                    <option value="Áridos y Cantera">Áridos y Cantera (Río Piraí)</option>
                    <option value="Maderas de Construcción y Puertas">Maderas de Construcción y Puertas</option>
                    <option value="Plomería y Tuberías">Plomería y Tuberías (PVC / Agua)</option>
                    <option value="Ferretería General & Agregados">Ferretería General & Agregados</option>
                    <option value="Quincallería y Acabados">Quincallería y Acabados (Deca / Tramontina)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={editingSupplier.city}
                    onChange={e => setEditingSupplier({ ...editingSupplier, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={editingSupplier.phone}
                    onChange={e => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                    placeholder="+591 760-12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dirección / Anillo / Zona</label>
                <input
                  type="text"
                  value={editingSupplier.address}
                  onChange={e => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder="Av. Santos Dumont 3er Anillo Interno"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={editingSupplier.email}
                  onChange={e => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder="ventas@proveedor.bo"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notas Comerciales</label>
                <textarea
                  rows={2}
                  value={editingSupplier.notes}
                  onChange={e => setEditingSupplier({ ...editingSupplier, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  placeholder="Descuentos por pago contado, flete a obra incluido..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
