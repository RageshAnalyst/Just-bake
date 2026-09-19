import React from 'react';
import {
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Edit2,
  Trash2,
  Wifi,
  Tag,
} from 'lucide-react';
import { Asset, Employee } from '../types';
import { CategoryIcon, StatusBadge, LocationTypeBadge, ConditionBadge } from './Badges';
import { formatCurrency } from '../utils/storage';

interface AssetCardsProps {
  assets: Asset[];
  employees: Employee[];
  onSelectAsset: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
}

export function AssetCards({
  assets,
  employees,
  onSelectAsset,
  onEditAsset,
  onDeleteAsset,
}: AssetCardsProps) {
  const employeeMap = new Map(employees.map((e) => [e.id, e]));

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-sm font-semibold text-slate-700">No hardware found</p>
        <p className="text-xs text-slate-500 mt-1">Try resetting filters or adding new devices.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => {
        const assignedEmployee = asset.currentEmployeeId
          ? employeeMap.get(asset.currentEmployeeId)
          : null;

        return (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            className="bg-white rounded-xl border border-slate-200 p-4.5 hover:border-indigo-400 hover:shadow-sm transition-all duration-150 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Header: Category Icon, Tag & Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <CategoryIcon category={asset.category} className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white shadow-2xs">
                      {asset.assetTag}
                    </span>
                    <span className="ml-2 text-xs font-semibold text-slate-500">{asset.category}</span>
                  </div>
                </div>

                <StatusBadge status={asset.status} />
              </div>

              {/* Asset Name & Details */}
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                {asset.name}
              </h4>
              <p className="text-xs text-slate-500 font-mono mb-3">
                {asset.manufacturer} • {asset.model}
              </p>

              {/* Location Tagging Details Box */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 truncate">{asset.locationName}</span>
                  <LocationTypeBadge type={asset.locationType} />
                </div>

                {asset.subLocation && (
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Area: {asset.subLocation}</span>
                  </div>
                )}

                {asset.ipAddress && (
                  <div className="text-[11px] text-indigo-700 flex items-center gap-1.5 font-mono">
                    <Wifi className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>IP: {asset.ipAddress}</span>
                  </div>
                )}
              </div>

              {/* Condition & Assignment */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Health:</span>
                  <ConditionBadge condition={asset.condition} />
                </div>

                <div className="text-right">
                  {assignedEmployee ? (
                    <span className="font-semibold text-indigo-900 text-xs">
                      👤 {assignedEmployee.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">Shared Asset</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-bold text-slate-900">{formatCurrency(asset.purchaseCost)}</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSelectAsset(asset)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => onEditAsset(asset)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${asset.assetTag}?`)) {
                      onDeleteAsset(asset.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
