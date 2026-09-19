import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  User,
  Wifi,
  Tag,
  Cpu,
  CheckCircle2,
  ArrowRightLeft,
} from 'lucide-react';
import { Asset, Employee, AssetStatus, HealthCondition } from '../types';
import { CategoryIcon, StatusBadge, LocationTypeBadge, ConditionBadge } from './Badges';
import { formatCurrency, formatDate } from '../utils/storage';

interface AssetDetailModalProps {
  asset: Asset | null;
  employees: Employee[];
  onClose: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  onUpdateStatus: (assetId: string, newStatus: AssetStatus) => void;
  onReassignEmployee: (assetId: string, employeeId: string | null) => void;
}

export function AssetDetailModal({
  asset,
  employees,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus,
  onReassignEmployee,
}: AssetDetailModalProps) {
  const [isReassigning, setIsReassigning] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');

  if (!asset) return null;

  const assignedEmployee = asset.currentEmployeeId
    ? employees.find((e) => e.id === asset.currentEmployeeId)
    : null;

  const handleSaveReassign = () => {
    onReassignEmployee(asset.id, selectedEmpId ? selectedEmpId : null);
    setIsReassigning(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <CategoryIcon category={asset.category} className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  {asset.assetTag}
                </span>
                <LocationTypeBadge type={asset.locationType} />
                <StatusBadge status={asset.status} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{asset.name}</h3>
              <p className="text-xs text-slate-500 font-mono">
                {asset.manufacturer} • {asset.model} • S/N: {asset.serialNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Location Tagging Box */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Location & Facility Placement
                </span>
              </div>
              <LocationTypeBadge type={asset.locationType} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
              <div>
                <span className="text-slate-500 font-medium">Facility Name:</span>
                <p className="font-semibold text-slate-900 text-sm">{asset.locationName}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Sub-Location / Area:</span>
                <p className="font-semibold text-slate-900 text-sm">
                  {asset.subLocation || 'General Station / Unspecified'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block">Hardware Category</span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <CategoryIcon category={asset.category} className="w-3.5 h-3.5 text-slate-600" />
                {asset.category}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block">Network / IP Address</span>
              <span className="text-xs font-mono font-bold text-indigo-700 mt-0.5 block truncate">
                {asset.ipAddress || 'Not Assigned / Offline'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block">Equipment Health</span>
              <div className="mt-0.5">
                <ConditionBadge condition={asset.condition} />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block">Purchase Cost</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                {formatCurrency(asset.purchaseCost)}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block">Procurement Date</span>
              <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                {formatDate(asset.purchaseDate)}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block">Operational Status</span>
              <div className="mt-0.5">
                <StatusBadge status={asset.status} />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          {asset.specifications && (
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-slate-500" /> Specifications & Features
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">{asset.specifications}</p>
            </div>
          )}

          {/* Custody / Staff Assignment */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" /> Device Custody & Assignment
              </span>

              {!isReassigning && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmpId(asset.currentEmployeeId || '');
                    setIsReassigning(true);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Change Assignment
                </button>
              )}
            </div>

            {isReassigning ? (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Employee or Mark as Location Shared Asset:
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full text-xs p-2 rounded-md bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Unassigned / Shared Facility Infrastructure</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.jobTitle} ({emp.location})
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReassigning(false)}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReassign}
                    className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Custody
                  </button>
                </div>
              </div>
            ) : assignedEmployee ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${assignedEmployee.avatarColor} text-white flex items-center justify-center font-bold text-xs`}
                  >
                    {assignedEmployee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{assignedEmployee.name}</h4>
                    <p className="text-xs text-slate-500">
                      {assignedEmployee.jobTitle} • {assignedEmployee.department}
                    </p>
                    <p className="text-[11px] text-slate-400">{assignedEmployee.email}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Assigned Custodian
                </span>
              </div>
            ) : (
              <div className="text-center py-2 text-slate-500 text-xs">
                This device is maintained as shared facility infrastructure (e.g. CCTV, NVR, router, or store POS).
              </div>
            )}
          </div>

          {/* Quick status change toggles */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 mr-1">Quick Status:</span>
            {(['In Use', 'In Stock', 'Maintenance', 'Decommissioned'] as AssetStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onUpdateStatus(asset.id, st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  asset.status === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Notes */}
          {asset.notes && (
            <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/70 text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">Deployment Notes:</span>
              <p>{asset.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove asset ${asset.assetTag} from inventory?`)) {
                onDelete(asset.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Device</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(asset);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Asset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
