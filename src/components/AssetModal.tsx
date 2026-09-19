import React, { useState, useEffect } from 'react';
import { X, Save, Plus, MapPin, Wifi, Store, Factory, Building2 } from 'lucide-react';
import {
  Asset,
  AssetCategory,
  AssetStatus,
  HealthCondition,
  LocationType,
  Employee,
} from '../types';
import { CategoryIcon, LocationTypeBadge } from './Badges';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Partial<Asset>) => void;
  initialAsset?: Asset | null;
  defaultLocation?: { type: LocationType; name: string } | null;
  employees: Employee[];
}

const CATEGORIES: AssetCategory[] = [
  'Laptop',
  '2-in-1 PCs',
  'Desktops',
  'Printers',
  'Mobile Phones',
  'CCTV Camera',
  'IP Camera',
  'DVR / NVR',
  'Network Devices',
  'Other Peripheral',
];

const LOCATION_TYPES: LocationType[] = [
  'COCO Store',
  'Factory',
  'Head Office',
  'Warehouse',
  'Other',
];

const COMMON_LOCATIONS = [
  { type: 'COCO Store' as LocationType, name: 'COCO Store #101 - Downtown' },
  { type: 'COCO Store' as LocationType, name: 'COCO Store #102 - Phoenix Metro' },
  { type: 'Factory' as LocationType, name: 'Factory - Plant 1 (Assembly)' },
  { type: 'Factory' as LocationType, name: 'Factory - Plant 2 (Packaging)' },
  { type: 'Head Office' as LocationType, name: 'Head Office - Main Office' },
];

export function AssetModal({
  isOpen,
  onClose,
  onSave,
  initialAsset,
  defaultLocation,
  employees,
}: AssetModalProps) {
  if (!isOpen) return null;

  const [assetTag, setAssetTag] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Laptop');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [locationType, setLocationType] = useState<LocationType>('COCO Store');
  const [locationName, setLocationName] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState<AssetStatus>('In Use');
  const [condition, setCondition] = useState<HealthCondition>('Good');
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialAsset) {
      setAssetTag(initialAsset.assetTag);
      setName(initialAsset.name);
      setCategory(initialAsset.category);
      setManufacturer(initialAsset.manufacturer);
      setModel(initialAsset.model);
      setSerialNumber(initialAsset.serialNumber);
      setLocationType(initialAsset.locationType || 'COCO Store');
      setLocationName(initialAsset.locationName || '');
      setSubLocation(initialAsset.subLocation || '');
      setIpAddress(initialAsset.ipAddress || '');
      setStatus(initialAsset.status);
      setCondition(initialAsset.condition);
      setCurrentEmployeeId(initialAsset.currentEmployeeId || '');
      setPurchaseCost(initialAsset.purchaseCost?.toString() || '');
      setPurchaseDate(initialAsset.purchaseDate || '');
      setSpecifications(initialAsset.specifications || '');
      setNotes(initialAsset.notes || '');
    } else {
      // New Asset Initialization
      const randomTag = Math.floor(1000 + Math.random() * 9000);
      setAssetTag(`AST-${randomTag}`);
      setName('');
      setCategory('Laptop');
      setManufacturer('');
      setModel('');
      setSerialNumber(`SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);

      if (defaultLocation) {
        setLocationType(defaultLocation.type);
        setLocationName(defaultLocation.name);
      } else {
        setLocationType('COCO Store');
        setLocationName('COCO Store #101 - Downtown');
      }

      setSubLocation('');
      setIpAddress('');
      setStatus('In Use');
      setCondition('Good');
      setCurrentEmployeeId('');
      setPurchaseCost('');
      setPurchaseDate(new Date().toISOString().slice(0, 10));
      setSpecifications('');
      setNotes('');
    }
  }, [initialAsset, defaultLocation, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !assetTag.trim() || !locationName.trim()) {
      alert('Please fill in Asset Tag, Device Name, and Location Name.');
      return;
    }

    onSave({
      assetTag: assetTag.trim(),
      name: name.trim(),
      category,
      manufacturer: manufacturer.trim() || 'Generic',
      model: model.trim() || 'Standard Model',
      serialNumber: serialNumber.trim(),
      locationType,
      locationName: locationName.trim(),
      subLocation: subLocation.trim() || undefined,
      ipAddress: ipAddress.trim() || undefined,
      status,
      condition,
      currentEmployeeId: currentEmployeeId ? currentEmployeeId : null,
      purchaseCost: purchaseCost ? parseFloat(purchaseCost) : 0,
      purchaseDate: purchaseDate || undefined,
      specifications: specifications.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              {initialAsset ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialAsset ? 'Edit Device Hardware' : 'Register New Device'}
              </h3>
              <p className="text-xs text-slate-500">Tag asset to a store, factory, or department</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Tag, Category & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Tag <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={assetTag}
                  onChange={(e) => setAssetTag(e.target.value)}
                  placeholder="e.g. AST-1042"
                  className="w-full text-xs font-mono font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AssetCategory)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Device Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Device / Asset Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hikvision 4MP Turret IP Camera or Dell OptiPlex 3090"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* LOCATION TAGGING SECTION */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Location Tagging (COCO Stores & Factories)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Facility Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as LocationType)}
                    className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {LOCATION_TYPES.map((lt) => (
                      <option key={lt} value={lt}>
                        {lt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / Facility Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. COCO Store #101 - Downtown"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Quick Select Facility Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Select:</span>
                {COMMON_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      setLocationType(loc.type);
                      setLocationName(loc.name);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-800 font-medium transition-colors cursor-pointer"
                  >
                    {loc.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-Location / Specific Area
                  </label>
                  <input
                    type="text"
                    value={subLocation}
                    onChange={(e) => setSubLocation(e.target.value)}
                    placeholder="e.g. Cash Counter 1, Assembly Line 1, Main Gate"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Static IP Address (Cameras, NVR, Switches, Printers)
                  </label>
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="e.g. 192.168.10.101"
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Hardware Status & Health Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operational Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AssetStatus)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="In Use">In Use</option>
                  <option value="In Stock">In Stock (Available/Spare)</option>
                  <option value="Maintenance">Maintenance (Repair)</option>
                  <option value="Decommissioned">Decommissioned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Health Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as HealthCondition)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
            </div>

            {/* Hardware Make, Model & Serial */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Hikvision, HP, Cisco, Zebra"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. ColorVu 4MP / ZT411"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Hardware S/N"
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Assigned Custodian & Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign to Employee (Optional)
                </label>
                <select
                  value={currentEmployeeId}
                  onChange={(e) => setCurrentEmployeeId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">Unassigned / Shared Facility Infrastructure</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.jobTitle} ({emp.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cost ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Specifications & Notes
              </label>
              <textarea
                rows={2}
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                placeholder="Key specs (e.g. 4MP, PoE 802.3af, 24/7 ColorVu, 16-channel, etc.)"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{initialAsset ? 'Save Changes' : 'Register Hardware'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
