import React from 'react';
import {
  Boxes,
  MapPin,
  Users,
  Plus,
  Download,
  RotateCcw,
  Search,
} from 'lucide-react';
import { ViewTab } from '../types';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  assetCount: number;
  employeeCount: number;
  onNewAssetClick: () => void;
  onExportCsvClick: () => void;
  onResetDataClick: () => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
}

export function Navbar({
  currentTab,
  onTabChange,
  assetCount,
  employeeCount,
  onNewAssetClick,
  onExportCsvClick,
  onResetDataClick,
  globalSearch,
  onGlobalSearchChange,
}: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Boxes className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">IT Asset Manager</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Stores & Factories
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Hardware Inventory & Location Tagging</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex items-center flex-1 max-w-sm relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search tag, serial, CCTV, IP, location..."
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-export-csv"
              onClick={onExportCsvClick}
              title="Export inventory to CSV"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              id="btn-reset-demo"
              onClick={onResetDataClick}
              title="Reset to sample data"
              className="p-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-add-asset"
              onClick={onNewAssetClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Device</span>
            </button>
          </div>
        </div>

        {/* Simplified Navigation Tabs */}
        <div className="flex items-center gap-2 -mb-px border-t border-slate-100 pt-1 overflow-x-auto">
          <button
            id="tab-inventory"
            onClick={() => onTabChange('inventory')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'inventory'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>All Hardware</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-medium">
              {assetCount}
            </span>
          </button>

          <button
            id="tab-location-wise"
            onClick={() => onTabChange('location_wise')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'location_wise'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Location-wise View</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              COCO Stores & Factories
            </span>
          </button>

          <button
            id="tab-employees"
            onClick={() => onTabChange('employees')}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              currentTab === 'employees'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Allocations</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-medium">
              {employeeCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
