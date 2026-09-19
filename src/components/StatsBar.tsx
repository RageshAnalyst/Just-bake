import React from 'react';
import {
  Boxes,
  Store,
  Factory,
  Camera,
  Monitor,
  CheckCircle2,
} from 'lucide-react';
import { Asset, LocationType, AssetCategory } from '../types';
import { formatCurrency } from '../utils/storage';

interface StatsBarProps {
  assets: Asset[];
  selectedLocationType: 'ALL' | LocationType;
  onSelectLocationType: (type: 'ALL' | LocationType) => void;
  selectedCategory: 'ALL' | AssetCategory | 'SURVEILLANCE' | 'COMPUTING';
  onSelectCategoryFilter: (filter: 'ALL' | AssetCategory | 'SURVEILLANCE' | 'COMPUTING') => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export function StatsBar({
  assets,
  selectedLocationType,
  onSelectLocationType,
  selectedCategory,
  onSelectCategoryFilter,
  selectedStatus,
  onSelectStatus,
}: StatsBarProps) {
  const totalAssets = assets.length;
  const totalValuation = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);

  const cocoStoreAssets = assets.filter((a) => a.locationType === 'COCO Store').length;
  const factoryAssets = assets.filter((a) => a.locationType === 'Factory').length;

  const surveillanceAssets = assets.filter(
    (a) => a.category === 'CCTV Camera' || a.category === 'IP Camera' || a.category === 'DVR / NVR'
  ).length;

  const computingAssets = assets.filter(
    (a) =>
      a.category === 'Laptop' ||
      a.category === '2-in-1 PCs' ||
      a.category === 'Desktops' ||
      a.category === 'Printers'
  ).length;

  const inUseCount = assets.filter((a) => a.status === 'In Use').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {/* 1. Total Assets */}
      <div
        onClick={() => {
          onSelectLocationType('ALL');
          onSelectCategoryFilter('ALL');
          onSelectStatus('ALL');
        }}
        className={`p-3.5 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
          selectedLocationType === 'ALL' && selectedCategory === 'ALL' && selectedStatus === 'ALL'
            ? 'ring-2 ring-indigo-500 border-indigo-300 shadow-xs'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Assets</span>
          <Boxes className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-slate-900">{totalAssets}</span>
          <span className="text-[11px] font-medium text-slate-500">{formatCurrency(totalValuation)}</span>
        </div>
      </div>

      {/* 2. COCO Stores */}
      <div
        onClick={() => onSelectLocationType('COCO Store')}
        className={`p-3.5 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
          selectedLocationType === 'COCO Store'
            ? 'ring-2 ring-emerald-500 border-emerald-300 shadow-xs bg-emerald-50/20'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-emerald-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">COCO Stores</span>
          <Store className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-emerald-950">{cocoStoreAssets}</span>
          <span className="text-[11px] font-medium text-emerald-700">Retail Assets</span>
        </div>
      </div>

      {/* 3. Factories */}
      <div
        onClick={() => onSelectLocationType('Factory')}
        className={`p-3.5 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
          selectedLocationType === 'Factory'
            ? 'ring-2 ring-amber-500 border-amber-300 shadow-xs bg-amber-50/20'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-amber-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Factories</span>
          <Factory className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-amber-950">{factoryAssets}</span>
          <span className="text-[11px] font-medium text-amber-700">Plant Hardware</span>
        </div>
      </div>

      {/* 4. Surveillance & Security */}
      <div
        onClick={() => onSelectCategoryFilter('SURVEILLANCE')}
        className={`p-3.5 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
          selectedCategory === 'SURVEILLANCE'
            ? 'ring-2 ring-purple-500 border-purple-300 shadow-xs bg-purple-50/20'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-purple-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Surveillance</span>
          <Camera className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-purple-950">{surveillanceAssets}</span>
          <span className="text-[11px] font-medium text-purple-700">CCTV / IP / NVR</span>
        </div>
      </div>

      {/* 5. Computing & Printers */}
      <div
        onClick={() => onSelectCategoryFilter('COMPUTING')}
        className={`p-3.5 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
          selectedCategory === 'COMPUTING'
            ? 'ring-2 ring-blue-500 border-blue-300 shadow-xs bg-blue-50/20'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-blue-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Computing & POS</span>
          <Monitor className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-blue-950">{computingAssets}</span>
          <span className="text-[11px] font-medium text-blue-700">PC / Tab / Printer</span>
        </div>
      </div>

      {/* 6. In Use Status */}
      <div
        onClick={() => onSelectStatus(selectedStatus === 'In Use' ? 'ALL' : 'In Use')}
        className={`p-3.5 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
          selectedStatus === 'In Use'
            ? 'ring-2 ring-teal-500 border-teal-300 shadow-xs bg-teal-50/20'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-teal-700 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Active In Use</span>
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-teal-950">{inUseCount}</span>
          <span className="text-[11px] font-medium text-teal-700">
            {totalAssets > 0 ? `${Math.round((inUseCount / totalAssets) * 100)}% Fleet` : '0%'}
          </span>
        </div>
      </div>
    </div>
  );
}
