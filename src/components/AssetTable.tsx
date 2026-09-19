import React from 'react';
import {
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Wifi,
} from 'lucide-react';
import { Asset, Employee } from '../types';
import { CategoryIcon, StatusBadge, LocationTypeBadge, ConditionBadge } from './Badges';
import { formatCurrency, formatDate } from '../utils/storage';

interface AssetTableProps {
  assets: Asset[];
  employees: Employee[];
  onSelectAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
  sortField: 'assetTag' | 'name' | 'category' | 'locationName' | 'status' | 'purchaseCost';
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: 'assetTag' | 'name' | 'category' | 'locationName' | 'status' | 'purchaseCost') => void;
}

export function AssetTable({
  assets,
  employees,
  onSelectAsset,
  onEditAsset,
  onDeleteAsset,
  sortField,
  sortDirection,
  onSortChange,
}: AssetTableProps) {
  const employeeMap = new Map(employees.map((e) => [e.id, e]));

  const renderSortIndicator = (field: typeof sortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 group-hover:opacity-100" />;
    }
    return (
      <span className="text-indigo-600 font-bold text-xs">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-sm font-semibold text-slate-700">No hardware found matching your filters</p>
        <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms to see more inventory.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <tr>
              <th
                onClick={() => onSortChange('assetTag')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-1.5 group">
                  <span>Tag / Device</span>
                  {renderSortIndicator('assetTag')}
                </div>
              </th>

              <th
                onClick={() => onSortChange('category')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-1.5 group">
                  <span>Category</span>
                  {renderSortIndicator('category')}
                </div>
              </th>

              <th
                onClick={() => onSortChange('locationName')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-1.5 group">
                  <span>Location & Area</span>
                  {renderSortIndicator('locationName')}
                </div>
              </th>

              <th className="px-4 py-3">IP / Network</th>

              <th
                onClick={() => onSortChange('status')}
                className="px-4 py-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-1.5 group">
                  <span>Status</span>
                  {renderSortIndicator('status')}
                </div>
              </th>

              <th className="px-4 py-3">Condition</th>

              <th className="px-4 py-3">Assigned Custody</th>

              <th
                onClick={() => onSortChange('purchaseCost')}
                className="px-4 py-3 text-right cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5 group">
                  <span>Cost</span>
                  {renderSortIndicator('purchaseCost')}
                </div>
              </th>

              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-800">
            {assets.map((asset) => {
              const assignedEmp = asset.currentEmployeeId ? employeeMap.get(asset.currentEmployeeId) : null;

              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                >
                  {/* Tag & Device Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-900 text-white shadow-2xs shrink-0">
                        {asset.assetTag}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {asset.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          S/N: {asset.serialNumber} • {asset.manufacturer}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <CategoryIcon category={asset.category} className="w-3.5 h-3.5 text-slate-500" />
                      <span>{asset.category}</span>
                    </div>
                  </td>

                  {/* Location & Tagging */}
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <LocationTypeBadge type={asset.locationType} />
                        <span className="font-semibold text-slate-800">{asset.locationName}</span>
                      </div>
                      {asset.subLocation && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{asset.subLocation}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* IP / Network */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {asset.ipAddress ? (
                      <span className="font-mono text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-1 w-fit">
                        <Wifi className="w-3 h-3 text-indigo-500" />
                        {asset.ipAddress}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">N/A</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={asset.status} />
                  </td>

                  {/* Condition */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ConditionBadge condition={asset.condition} />
                  </td>

                  {/* Assigned Custody */}
                  <td className="px-4 py-3">
                    {assignedEmp ? (
                      <div>
                        <div className="font-semibold text-slate-900">{assignedEmp.name}</div>
                        <div className="text-[11px] text-slate-500">{assignedEmp.department}</div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Facility Shared Asset</span>
                    )}
                  </td>

                  {/* Cost */}
                  <td className="px-4 py-3 text-right font-medium text-slate-700 whitespace-nowrap">
                    {formatCurrency(asset.purchaseCost)}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectAsset(asset)}
                        title="View details"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditAsset(asset)}
                        title="Edit hardware"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove asset ${asset.assetTag} (${asset.name}) from inventory?`)) {
                            onDeleteAsset(asset.id);
                          }
                        }}
                        title="Delete asset"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
