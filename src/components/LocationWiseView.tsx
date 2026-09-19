import React, { useState, useMemo } from 'react';
import {
  Store,
  Factory,
  Building2,
  Package,
  MapPin,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Cpu,
  Tv,
  Camera,
  Layers,
  ArrowRight,
  ExternalLink,
  Wifi,
} from 'lucide-react';
import { Asset, Employee, LocationType, AssetCategory } from '../types';
import { CategoryIcon, StatusBadge, LocationTypeBadge } from './Badges';

interface LocationWiseViewProps {
  assets: Asset[];
  employees: Employee[];
  onSelectAsset: (asset: Asset) => void;
  onAddAssetToLocation: (locationType: LocationType, locationName: string) => void;
  onFilterInventoryByLocation: (locationName: string) => void;
}

export function LocationWiseView({
  assets,
  employees,
  onSelectAsset,
  onAddAssetToLocation,
  onFilterInventoryByLocation,
}: LocationWiseViewProps) {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | LocationType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({
    'COCO Store #101 - Downtown': true,
    'Factory - Plant 1 (Assembly)': true,
  });

  const employeeMap = useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  // Group assets by location
  const locationGroups = useMemo(() => {
    const groups: Record<
      string,
      {
        locationName: string;
        locationType: LocationType;
        assets: Asset[];
        categoryCounts: Partial<Record<AssetCategory, number>>;
        inUseCount: number;
        inStockCount: number;
        maintenanceCount: number;
      }
    > = {};

    assets.forEach((asset) => {
      const locName = asset.locationName || 'Unassigned Facility';
      if (!groups[locName]) {
        groups[locName] = {
          locationName: locName,
          locationType: asset.locationType || 'Other',
          assets: [],
          categoryCounts: {},
          inUseCount: 0,
          inStockCount: 0,
          maintenanceCount: 0,
        };
      }

      groups[locName].assets.push(asset);
      groups[locName].categoryCounts[asset.category] =
        (groups[locName].categoryCounts[asset.category] || 0) + 1;

      if (asset.status === 'In Use') groups[locName].inUseCount++;
      else if (asset.status === 'In Stock') groups[locName].inStockCount++;
      else if (asset.status === 'Maintenance') groups[locName].maintenanceCount++;
    });

    return Object.values(groups);
  }, [assets]);

  // Filter groups
  const filteredLocationGroups = useMemo(() => {
    return locationGroups.filter((group) => {
      // Type filter
      if (selectedTypeFilter !== 'ALL' && group.locationType !== selectedTypeFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = group.locationName.toLowerCase().includes(q);
        const matchesDevice = group.assets.some(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.assetTag.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            (a.ipAddress && a.ipAddress.includes(q))
        );
        return matchesName || matchesDevice;
      }

      return true;
    });
  }, [locationGroups, selectedTypeFilter, searchQuery]);

  const toggleExpand = (locName: string) => {
    setExpandedLocations((prev) => ({
      ...prev,
      [locName]: !prev[locName],
    }));
  };

  // Counts for top quick filter pills
  const countsByType = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: locationGroups.length,
      'COCO Store': 0,
      Factory: 0,
      'Head Office': 0,
      Warehouse: 0,
    };

    locationGroups.forEach((g) => {
      counts[g.locationType] = (counts[g.locationType] || 0) + 1;
    });

    return counts;
  }, [locationGroups]);

  return (
    <div className="space-y-5">
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Quick Filter Tabs: All, COCO Stores, Factories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Location Types:
          </span>

          <button
            onClick={() => setSelectedTypeFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedTypeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Facilities ({countsByType['ALL'] || 0})
          </button>

          <button
            onClick={() => setSelectedTypeFilter('COCO Store')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedTypeFilter === 'COCO Store'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>COCO Stores ({countsByType['COCO Store'] || 0})</span>
          </button>

          <button
            onClick={() => setSelectedTypeFilter('Factory')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedTypeFilter === 'Factory'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Factories ({countsByType['Factory'] || 0})</span>
          </button>

          <button
            onClick={() => setSelectedTypeFilter('Head Office')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedTypeFilter === 'Head Office'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Head Office ({countsByType['Head Office'] || 0})</span>
          </button>
        </div>

        {/* Search inside locations */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search facility or device..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Location Cards List */}
      <div className="space-y-4">
        {filteredLocationGroups.map((group) => {
          const isExpanded = expandedLocations[group.locationName] ?? false;

          return (
            <div
              key={group.locationName}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Card Header Banner */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      group.locationType === 'COCO Store'
                        ? 'bg-emerald-600 text-white'
                        : group.locationType === 'Factory'
                        ? 'bg-amber-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {group.locationType === 'COCO Store' ? (
                      <Store className="w-5 h-5" />
                    ) : group.locationType === 'Factory' ? (
                      <Factory className="w-5 h-5" />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{group.locationName}</h3>
                      <LocationTypeBadge type={group.locationType} />
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <span className="font-medium text-slate-700">{group.assets.length} Total Devices Tagged</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">{group.inUseCount} In Use</span>
                      {group.maintenanceCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-700 font-medium">
                            {group.maintenanceCount} Under Maintenance
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onAddAssetToLocation(group.locationType, group.locationName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer border border-indigo-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Device Here</span>
                  </button>

                  <button
                    onClick={() => onFilterInventoryByLocation(group.locationName)}
                    title="View in full inventory table"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Table View</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => toggleExpand(group.locationName)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title={isExpanded ? 'Collapse equipment list' : 'Expand equipment list'}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Hardware Categories Distribution Summary */}
              <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium mr-1 text-[11px] uppercase tracking-wider">
                  Hardware Breakdown:
                </span>
                {Object.entries(group.categoryCounts).map(([cat, count]) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium text-xs shadow-2xs"
                  >
                    <CategoryIcon category={cat as AssetCategory} className="w-3.5 h-3.5 text-slate-500" />
                    <span>{cat}:</span>
                    <strong className="text-slate-900">{count}</strong>
                  </span>
                ))}
              </div>

              {/* Collapsible Asset Listing for this Location */}
              {isExpanded && (
                <div className="divide-y divide-slate-100 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Asset Tag & Device</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Sub-Location / Area</th>
                        <th className="px-4 py-2.5">IP Address</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5">Assigned Staff</th>
                        <th className="px-4 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {group.assets.map((asset) => {
                        const assignedEmp = asset.currentEmployeeId
                          ? employeeMap.get(asset.currentEmployeeId)
                          : null;

                        return (
                          <tr
                            key={asset.id}
                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            onClick={() => onSelectAsset(asset)}
                          >
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-900 text-white">
                                  {asset.assetTag}
                                </span>
                                <div>
                                  <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {asset.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    S/N: {asset.serialNumber}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <CategoryIcon category={asset.category} className="w-3.5 h-3.5 text-slate-500" />
                                <span>{asset.category}</span>
                              </div>
                            </td>

                            <td className="px-4 py-2.5 text-slate-600">
                              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                                {asset.subLocation || 'General Area'}
                              </span>
                            </td>

                            <td className="px-4 py-2.5">
                              {asset.ipAddress ? (
                                <span className="font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                                  <Wifi className="w-3 h-3 text-indigo-500" />
                                  {asset.ipAddress}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>

                            <td className="px-4 py-2.5">
                              <StatusBadge status={asset.status} />
                            </td>

                            <td className="px-4 py-2.5">
                              {assignedEmp ? (
                                <div className="text-slate-700">
                                  <span className="font-medium text-indigo-900">{assignedEmp.name}</span>
                                  <div className="text-[10px] text-slate-400">{assignedEmp.jobTitle}</div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Station / Shared Infrastructure</span>
                              )}
                            </td>

                            <td className="px-4 py-2.5 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectAsset(asset);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                              >
                                View Details
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
          );
        })}

        {filteredLocationGroups.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No matching locations found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting a different location filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
