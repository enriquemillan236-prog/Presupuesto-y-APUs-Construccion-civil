import React, { useState } from 'react';
import {
  ResourceMaterial,
  ResourceLabor,
  ResourceEquipment,
  Supplier
} from '../types/apu';
import { formatBs } from '../utils/calculations';
import {
  getValidSuppliersForMaterial,
  getMaterialDomain,
  getDomainBadgeInfo
} from '../utils/supplierFilter';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  HardHat,
  Truck,
  Box,
  Search,
  Check
} from 'lucide-react';

interface MaterialsDBModuleProps {
  materials: ResourceMaterial[];
  onUpdateMaterials: (materials: ResourceMaterial[]) => void;
  labor: ResourceLabor[];
  onUpdateLabor: (labor: ResourceLabor[]) => void;
  equipment: ResourceEquipment[];
  onUpdateEquipment: (equipment: ResourceEquipment[]) => void;
  suppliers: Supplier[];
}

export const MaterialsDBModule: React.FC<MaterialsDBModuleProps> = ({
  materials,
  onUpdateMaterials,
  labor,
  onUpdateLabor,
  equipment,
  onUpdateEquipment,
  suppliers
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'labor' | 'equipment'>('materials');
  const [search, setSearch] = useState('');

  // Estados para nuevo/editar
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<'material' | 'labor' | 'equipment'>('material');
  const [editingItem, setEditingItem] = useState<any>(null);

  const supplierMap = new Map<string, Supplier>();
  suppliers.forEach(s => supplierMap.set(s.id, s));

  const handleOpenAdd = () => {
    setEditingType(activeTab === 'materials' ? 'material' : activeTab === 'labor' ? 'labor' : 'equipment');
    if (activeTab === 'materials') {
      setEditingItem({
        id: `mat-${Date.now()}`,
        name: '',
        unit: 'bolsa',
        category: 'Aglomerantes',
        defaultUnitPrice: 10.0,
        defaultSupplierId: suppliers[0]?.id || 'sup-1',
        specification: ''
      });
    } else if (activeTab === 'labor') {
      setEditingItem({
        id: `lab-${Date.now()}`,
        specialty: '',
        unit: 'hh',
        hourlyRate: 20.0,
        category: 'Mano de Obra Calificada'
      });
    } else {
      setEditingItem({
        id: `eq-${Date.now()}`,
        name: '',
        unit: 'hora',
        hourlyRate: 25.0,
        capacity: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType === 'material') {
      const exists = materials.some(m => m.id === editingItem.id);
      if (exists) {
        onUpdateMaterials(materials.map(m => (m.id === editingItem.id ? editingItem : m)));
      } else {
        onUpdateMaterials([...materials, editingItem]);
      }
    } else if (editingType === 'labor') {
      const exists = labor.some(l => l.id === editingItem.id);
      if (exists) {
        onUpdateLabor(labor.map(l => (l.id === editingItem.id ? editingItem : l)));
      } else {
        onUpdateLabor([...labor, editingItem]);
      }
    } else {
      const exists = equipment.some(eq => eq.id === editingItem.id);
      if (exists) {
        onUpdateEquipment(equipment.map(eq => (eq.id === editingItem.id ? editingItem : eq)));
      } else {
        onUpdateEquipment([...equipment, editingItem]);
      }
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string, type: 'material' | 'labor' | 'equipment') => {
    if (type === 'material') {
      onUpdateMaterials(materials.filter(m => m.id !== id));
    } else if (type === 'labor') {
      onUpdateLabor(labor.filter(l => l.id !== id));
    } else {
      onUpdateEquipment(equipment.filter(eq => eq.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            Base de Precios de Materiales & Jornales (Santa Cruz)
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Precios referenciales de plaza en Bolivianos (Bs) y jornales vigentes en la construcción cruceña.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>
            {activeTab === 'materials'
              ? 'Agregar Material'
              : activeTab === 'labor'
              ? 'Agregar Especialidad'
              : 'Agregar Maquinaria'}
          </span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Materiales ({materials.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('labor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'labor'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>Mano de Obra ({labor.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('equipment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'equipment'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Equipos ({equipment.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 shadow-xs"
          />
        </div>
      </div>

      {/* TABLE VIEW en Tarjeta Blanca Limpia */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        {activeTab === 'materials' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Descripción del Material</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-2 text-center w-20">Unidad</th>
                  <th className="py-3 px-4 text-right w-32">Precio Ref. (Bs)</th>
                  <th className="py-3 px-4">Proveedor Habitual</th>
                  <th className="py-3 px-3 text-center w-20">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {materials
                  .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
                  .map(mat => {
                    const sup = supplierMap.get(mat.defaultSupplierId);
                    return (
                      <tr key={mat.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{mat.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{mat.specification}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-medium">{mat.category}</td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-emerald-700">{mat.unit}</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                          {formatBs(mat.defaultUnitPrice)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {sup?.name || 'Comercio General'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingType('material');
                                setEditingItem(mat);
                                setShowModal(true);
                              }}
                              className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(mat.id, 'material')}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'labor' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Especialidad de Mano de Obra</th>
                  <th className="py-3 px-3">Calificación</th>
                  <th className="py-3 px-2 text-center w-20">Unidad</th>
                  <th className="py-3 px-4 text-right w-36">Jornal Horario (Bs/hh)</th>
                  <th className="py-3 px-4 text-right w-36">Jornal Diario (8h)</th>
                  <th className="py-3 px-3 text-center w-20">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {labor
                  .filter(l => l.specialty.toLowerCase().includes(search.toLowerCase()))
                  .map(lab => (
                    <tr key={lab.id} className="hover:bg-teal-50/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{lab.specialty}</td>
                      <td className="py-3 px-3 text-slate-500 font-medium">{lab.category}</td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-teal-700">{lab.unit}</td>
                      <td className="py-3 px-4 text-right font-mono font-black text-teal-700">
                        {formatBs(lab.hourlyRate)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatBs(lab.hourlyRate * 8)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingType('labor');
                              setEditingItem(lab);
                              setShowModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-teal-700 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(lab.id, 'labor')}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Descripción de Maquinaria / Equipo</th>
                  <th className="py-3 px-4">Capacidad / Potencia</th>
                  <th className="py-3 px-2 text-center w-20">Unidad</th>
                  <th className="py-3 px-4 text-right w-36">Costo Alquiler (Bs)</th>
                  <th className="py-3 px-3 text-center w-20">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {equipment
                  .filter(eq => eq.name.toLowerCase().includes(search.toLowerCase()))
                  .map(eq => (
                    <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{eq.name}</td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{eq.capacity || 'Estándar'}</td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-700">{eq.unit}</td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                        {formatBs(eq.hourlyRate)} / {eq.unit}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingType('equipment');
                              setEditingItem(eq);
                              setShowModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(eq.id, 'equipment')}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: EDIT / ADD RESOURCE */}
      {showModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 text-slate-900 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingType === 'material'
                ? 'Editar / Crear Material'
                : editingType === 'labor'
                ? 'Editar / Crear Mano de Obra'
                : 'Editar / Crear Maquinaria'}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-3.5 text-xs">
              {editingType === 'material' && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre del Material</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                      placeholder="Ej: Cemento IP-30, Fierro 8mm, Porcelanato 60x60..."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Categoría de Insumo (Santa Cruz)</label>
                    <select
                      value={editingItem.category || 'Aglomerantes'}
                      onChange={e => {
                        const newCat = e.target.value;
                        const validForNewCat = getValidSuppliersForMaterial(
                          { id: editingItem.id, name: editingItem.name, category: newCat },
                          suppliers
                        );
                        setEditingItem({
                          ...editingItem,
                          category: newCat,
                          defaultSupplierId: validForNewCat[0]?.id || suppliers[0]?.id
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                    >
                      <option value="Aglomerantes">Aglomerantes (Cemento IP-30, Cal, Yeso)</option>
                      <option value="Aceros">Aceros (Fierro Corrugado, Alambre, Costaneras)</option>
                      <option value="Mampostería">Ladrillos y Obra Gruesa (Ladrillo 6H, Tejas Incerpaz/Ceranorte)</option>
                      <option value="Pisos, Porcelanatos, Revestimientos y Baños">Pisos, Porcelanatos, Revestimientos y Baños (Gladymar, Roho, Importacruz, Cerabol)</option>
                      <option value="Impermeabilizantes y Piedras Sinterizadas">Impermeabilizantes y Piedras Sinterizadas (Bautech, Granito)</option>
                      <option value="Áridos">Áridos (Arena, Grava, Ripio Río Piraí)</option>
                      <option value="Maderas">Maderas (Tajibo, Ochoó, Puertas)</option>
                      <option value="Sanitarios">Sanitarios y Tuberías (PVC Tigre)</option>
                      <option value="Electricidad">Electricidad (Cables THHN, Tramontina)</option>
                      <option value="Ferretería">Ferretería General & Varios</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Unidad</label>
                      <input
                        type="text"
                        required
                        value={editingItem.unit}
                        onChange={e => setEditingItem({ ...editingItem, unit: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                        placeholder="bolsa, m3, kg, pza..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Precio Unitario Ref. (Bs)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingItem.defaultUnitPrice}
                        onChange={e => setEditingItem({ ...editingItem, defaultUnitPrice: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>
                  </div>
                  <div>
                    {(() => {
                      const validSuppliers = getValidSuppliersForMaterial(
                        {
                          id: editingItem.id,
                          name: editingItem.name || '',
                          category: editingItem.category
                        },
                        suppliers
                      );
                      const domain = getMaterialDomain({
                        id: editingItem.id,
                        name: editingItem.name || '',
                        category: editingItem.category
                      });
                      const badgeInfo = getDomainBadgeInfo(domain);

                      return (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-700 font-semibold">Proveedor Habitual</label>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${badgeInfo.badgeBg} ${badgeInfo.badgeText}`}>
                              {badgeInfo.label}
                            </span>
                          </div>
                          <select
                            value={editingItem.defaultSupplierId || validSuppliers[0]?.id}
                            onChange={e => setEditingItem({ ...editingItem, defaultSupplierId: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                          >
                            {validSuppliers.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-500 mt-1">{badgeInfo.allowedHint}</p>
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {editingType === 'labor' && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Especialidad / Cargo</label>
                    <input
                      type="text"
                      required
                      value={editingItem.specialty}
                      onChange={e => setEditingItem({ ...editingItem, specialty: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-teal-600 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Jornal Horario (Bs/hh)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingItem.hourlyRate}
                        onChange={e => setEditingItem({ ...editingItem, hourlyRate: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                      <select
                        value={editingItem.category}
                        onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
                      >
                        <option value="Especialista">Especialista</option>
                        <option value="Mano de Obra Calificada">Mano de Obra Calificada</option>
                        <option value="Ayudante">Ayudante</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {editingType === 'equipment' && (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nombre del Equipo</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tarifa Alquiler (Bs)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingItem.hourlyRate}
                        onChange={e => setEditingItem({ ...editingItem, hourlyRate: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Unidad</label>
                      <select
                        value={editingItem.unit}
                        onChange={e => setEditingItem({ ...editingItem, unit: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="hora">hora</option>
                        <option value="dia">dia</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
