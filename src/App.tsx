import React, { useState, useMemo, useEffect } from 'react';
import {
  Boxes,
  Plus,
  LayoutGrid,
  List,
  Filter,
  Search,
  Store,
  Factory,
  Building2,
  MapPin,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  Asset,
  Employee,
  AssetCategory,
  LocationType,
  ViewTab,
  AssetStatus,
} from './types';
import {
  loadStoredAssets,
  saveStoredAssets,
  loadStoredEmployees,
  saveStoredEmployees,
  resetApplicationData,
  exportAssetsToCSV,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { AssetTable } from './components/AssetTable';
import { AssetCards } from './components/AssetCards';
import { LocationWiseView } from './components/LocationWiseView';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { AssetDetailModal } from './components/AssetDetailModal';
import { AssetModal } from './components/AssetModal';
import { AssignDeviceModal } from './components/AssignDeviceModal';
import { EmployeeModal } from './components/EmployeeModal';
import { CategoryIcon } from './components/Badges';

const ALL_CATEGORIES: ('ALL' | AssetCategory)[] = [
  'ALL',
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

const LOCATION_TYPES: ('ALL' | LocationType)[] = [
  'ALL',
  'COCO Store',
  'Factory',
  'Head Office',
  'Warehouse',
];

export default function App() {
  // Master data backed by localStorage
  const [assets, setAssets] = useState<Asset[]>(() => loadStoredAssets());
  const [employees, setEmployees] = useState<Employee[]>(() => loadStoredEmployees());

  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<ViewTab>('inventory');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [globalSearch, setGlobalSearch] = useState('');

  // Filters
  const [selectedLocationType, setSelectedLocationType] = useState<'ALL' | LocationType>('ALL');
  const [selectedLocationName, setSelectedLocationName] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AssetCategory | 'SURVEILLANCE' | 'COMPUTING'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<'assetTag' | 'name' | 'category' | 'locationName' | 'status' | 'purchaseCost'>('assetTag');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [prefilledLocation, setPrefilledLocation] = useState<{ type: LocationType; name: string } | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetAsset, setAssignTargetAsset] = useState<Asset | null>(null);
  const [assignTargetEmployee, setAssignTargetEmployee] = useState<Employee | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredAssets(assets);
  }, [assets]);

  useEffect(() => {
    saveStoredEmployees(employees);
  }, [employees]);

  // Distinct location names for dropdown filter
  const uniqueLocationNames = useMemo(() => {
    const names = new Set<string>();
    assets.forEach((a) => {
      if (a.locationName) names.add(a.locationName);
    });
    return Array.from(names).sort();
  }, [assets]);

  // Filtered & Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // Global Search
        if (globalSearch.trim()) {
          const q = globalSearch.toLowerCase().trim();
          const matchTag = asset.assetTag.toLowerCase().includes(q);
          const matchName = asset.name.toLowerCase().includes(q);
          const matchSerial = asset.serialNumber.toLowerCase().includes(q);
          const matchCat = asset.category.toLowerCase().includes(q);
          const matchLoc = asset.locationName.toLowerCase().includes(q);
          const matchSubLoc = asset.subLocation ? asset.subLocation.toLowerCase().includes(q) : false;
          const matchIp = asset.ipAddress ? asset.ipAddress.toLowerCase().includes(q) : false;
          if (!matchTag && !matchName && !matchSerial && !matchCat && !matchLoc && !matchSubLoc && !matchIp) {
            return false;
          }
        }

        // Location Type Filter
        if (selectedLocationType !== 'ALL' && asset.locationType !== selectedLocationType) {
          return false;
        }

        // Location Name Filter
        if (selectedLocationName !== 'ALL' && asset.locationName !== selectedLocationName) {
          return false;
        }

        // Category Filter (including convenience presets 'SURVEILLANCE' and 'COMPUTING')
        if (categoryFilter === 'SURVEILLANCE') {
          if (
            asset.category !== 'CCTV Camera' &&
            asset.category !== 'IP Camera' &&
            asset.category !== 'DVR / NVR'
          ) {
            return false;
          }
        } else if (categoryFilter === 'COMPUTING') {
          if (
            asset.category !== 'Laptop' &&
            asset.category !== '2-in-1 PCs' &&
            asset.category !== 'Desktops' &&
            asset.category !== 'Printers'
          ) {
            return false;
          }
        } else if (categoryFilter !== 'ALL' && asset.category !== categoryFilter) {
          return false;
        }

        // Status Filter
        if (statusFilter !== 'ALL' && asset.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB || '').toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [
    assets,
    globalSearch,
    selectedLocationType,
    selectedLocationName,
    categoryFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  const handleSortChange = (
    field: 'assetTag' | 'name' | 'category' | 'locationName' | 'status' | 'purchaseCost'
  ) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Asset CRUD & updates
  const handleSaveAsset = (assetData: Partial<Asset>) => {
    if (editingAsset) {
      // Update
      setAssets((prev) =>
        prev.map((a) =>
          a.id === editingAsset.id
            ? ({
                ...a,
                ...assetData,
                updatedAt: new Date().toISOString(),
              } as Asset)
            : a
        )
      );
      if (detailAsset && detailAsset.id === editingAsset.id) {
        setDetailAsset((prev) => (prev ? ({ ...prev, ...assetData } as Asset) : null));
      }
    } else {
      // Create new
      const newAsset: Asset = {
        id: `ast-${Date.now()}`,
        assetTag: assetData.assetTag || `AST-${Math.floor(1000 + Math.random() * 9000)}`,
        serialNumber: assetData.serialNumber || `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        name: assetData.name || 'Untitled Device',
        category: assetData.category || 'Laptop',
        locationType: assetData.locationType || 'COCO Store',
        locationName: assetData.locationName || 'COCO Store #101 - Downtown',
        subLocation: assetData.subLocation,
        ipAddress: assetData.ipAddress,
        status: assetData.status || 'In Use',
        condition: assetData.condition || 'Good',
        currentEmployeeId: assetData.currentEmployeeId || null,
        manufacturer: assetData.manufacturer || 'Generic',
        model: assetData.model || 'Standard',
        specifications: assetData.specifications,
        purchaseDate: assetData.purchaseDate,
        purchaseCost: assetData.purchaseCost || 0,
        notes: assetData.notes,
        updatedAt: new Date().toISOString(),
      };
      setAssets((prev) => [newAsset, ...prev]);
    }
    setEditingAsset(null);
    setPrefilledLocation(null);
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset(null);
    }
  };

  const handleUpdateStatus = (assetId: string, newStatus: AssetStatus) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a
      )
    );
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleReassignEmployee = (assetId: string, employeeId: string | null) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              currentEmployeeId: employeeId,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset((prev) => (prev ? { ...prev, currentEmployeeId: employeeId } : null));
    }
  };

  const handleUnassignAsset = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, currentEmployeeId: null } : a))
    );
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset((prev) => (prev ? { ...prev, currentEmployeeId: null } : null));
    }
  };

  const handleConfirmAssignment = (
    assetId: string,
    employeeId: string,
    location: string,
    note: string
  ) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              currentEmployeeId: employeeId,
              status: 'In Use',
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  // Employee CRUD
  const handleSaveEmployee = (empData: Partial<Employee>) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editingEmployee.id ? ({ ...e, ...empData } as Employee) : e))
      );
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: empData.name || 'New Employee',
        email: empData.email || 'employee@enterprise.com',
        department: empData.department || 'Store Operations',
        jobTitle: empData.jobTitle || 'Associate',
        location: empData.location || 'COCO Store #101 - Downtown',
        avatarColor: empData.avatarColor || 'bg-indigo-600',
        status: empData.status || 'Active',
      };
      setEmployees((prev) => [...prev, newEmp]);
    }
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
    // Release assigned assets
    setAssets((prev) =>
      prev.map((a) => (a.currentEmployeeId === empId ? { ...a, currentEmployeeId: null } : a))
    );
  };

  const handleResetDemoData = () => {
    if (confirm('Reset application data to original store and factory setup?')) {
      const reset = resetApplicationData();
      setAssets(reset.assets);
      setEmployees(reset.employees);
      setSelectedLocationType('ALL');
      setSelectedLocationName('ALL');
      setCategoryFilter('ALL');
      setStatusFilter('ALL');
      setGlobalSearch('');
    }
  };

  const hasActiveFilters =
    selectedLocationType !== 'ALL' ||
    selectedLocationName !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    globalSearch !== '';

  const clearAllFilters = () => {
    setSelectedLocationType('ALL');
    setSelectedLocationName('ALL');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setGlobalSearch('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        assetCount={assets.length}
        employeeCount={employees.length}
        onNewAssetClick={() => {
          setEditingAsset(null);
          setPrefilledLocation(null);
          setIsAssetModalOpen(true);
        }}
        onExportCsvClick={() => exportAssetsToCSV(filteredAssets, employees)}
        onResetDataClick={handleResetDemoData}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Hardware Inventory */}
        {currentTab === 'inventory' && (
          <div className="space-y-4">
            {/* Quick Metrics & Location Jump Bar */}
            <StatsBar
              assets={assets}
              selectedLocationType={selectedLocationType}
              onSelectLocationType={(type) => {
                setSelectedLocationType(type);
                setSelectedLocationName('ALL');
              }}
              selectedCategory={categoryFilter}
              onSelectCategoryFilter={setCategoryFilter}
              selectedStatus={statusFilter}
              onSelectStatus={setStatusFilter}
            />

            {/* Filter & Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Location Type Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">Location:</span>
                  <select
                    value={selectedLocationType}
                    onChange={(e) => {
                      setSelectedLocationType(e.target.value as any);
                      setSelectedLocationName('ALL');
                    }}
                    className="text-xs font-medium px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="ALL">All Facilities</option>
                    <option value="COCO Store">COCO Stores</option>
                    <option value="Factory">Factories</option>
                    <option value="Head Office">Head Office</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>

                {/* Specific Location Name Filter */}
                {uniqueLocationNames.length > 0 && (
                  <select
                    value={selectedLocationName}
                    onChange={(e) => setSelectedLocationName(e.target.value)}
                    className="text-xs font-medium px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 max-w-[200px] truncate"
                  >
                    <option value="ALL">All Specific Branches</option>
                    {uniqueLocationNames.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                )}

                {/* Category Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="text-xs font-medium px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="SURVEILLANCE">Surveillance (CCTV, IP, NVR)</option>
                    <option value="COMPUTING">Computing & POS (PC, Tab, Printer)</option>
                    {ALL_CATEGORIES.filter((c) => c !== 'ALL').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-medium px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="In Use">In Use</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Decommissioned">Decommissioned</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* View Mode Toggle & Result Count */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Showing <strong className="text-slate-800">{filteredAssets.length}</strong> of{' '}
                  {assets.length} devices
                </span>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setViewMode('table')}
                    title="Table view"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    title="Grid card view"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      viewMode === 'cards' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Content: Table or Cards */}
            {viewMode === 'table' ? (
              <AssetTable
                assets={filteredAssets}
                employees={employees}
                onSelectAsset={setDetailAsset}
                onEditAsset={(asset) => {
                  setEditingAsset(asset);
                  setIsAssetModalOpen(true);
                }}
                onDeleteAsset={handleDeleteAsset}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
              />
            ) : (
              <AssetCards
                assets={filteredAssets}
                employees={employees}
                onSelectAsset={setDetailAsset}
                onEditAsset={(asset) => {
                  setEditingAsset(asset);
                  setIsAssetModalOpen(true);
                }}
                onDeleteAsset={handleDeleteAsset}
              />
            )}
          </div>
        )}

        {/* Tab 2: Location-wise View (Dedicated for COCO Stores & Factories) */}
        {currentTab === 'location_wise' && (
          <LocationWiseView
            assets={assets}
            employees={employees}
            onSelectAsset={setDetailAsset}
            onAddAssetToLocation={(locType, locName) => {
              setPrefilledLocation({ type: locType, name: locName });
              setEditingAsset(null);
              setIsAssetModalOpen(true);
            }}
            onFilterInventoryByLocation={(locName) => {
              setSelectedLocationName(locName);
              setSelectedLocationType('ALL');
              setCurrentTab('inventory');
            }}
          />
        )}

        {/* Tab 3: Staff Allocations */}
        {currentTab === 'employees' && (
          <EmployeeDirectory
            employees={employees}
            assets={assets}
            onAssignToEmployee={(emp) => {
              setAssignTargetEmployee(emp);
              setAssignTargetAsset(null);
              setIsAssignModalOpen(true);
            }}
            onUnassignAsset={handleUnassignAsset}
            onSelectAsset={setDetailAsset}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}
      </main>

      {/* Asset Detail Modal */}
      {detailAsset && (
        <AssetDetailModal
          asset={detailAsset}
          employees={employees}
          onClose={() => setDetailAsset(null)}
          onEdit={(asset) => {
            setDetailAsset(null);
            setEditingAsset(asset);
            setIsAssetModalOpen(true);
          }}
          onDelete={handleDeleteAsset}
          onUpdateStatus={handleUpdateStatus}
          onReassignEmployee={handleReassignEmployee}
        />
      )}

      {/* Add / Edit Hardware Asset Modal */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false);
          setEditingAsset(null);
          setPrefilledLocation(null);
        }}
        onSave={handleSaveAsset}
        initialAsset={editingAsset}
        defaultLocation={prefilledLocation}
        employees={employees}
      />

      {/* Assign Device Modal */}
      <AssignDeviceModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignTargetAsset(null);
          setAssignTargetEmployee(null);
        }}
        asset={assignTargetAsset}
        targetEmployee={assignTargetEmployee}
        availableAssets={assets.filter((a) => !a.currentEmployeeId && a.status !== 'Decommissioned')}
        employees={employees}
        onConfirmAssign={handleConfirmAssignment}
      />

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialEmployee={editingEmployee}
      />
    </div>
  );
}
