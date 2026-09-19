import React, { useState, useEffect } from 'react';
import { X, UserPlus, Laptop, CheckCircle2, MapPin } from 'lucide-react';
import { Asset, Employee } from '../types';

interface AssignDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  targetEmployee?: Employee | null;
  availableAssets: Asset[];
  employees: Employee[];
  onConfirmAssign: (assetId: string, employeeId: string, location: string, note: string) => void;
}

export function AssignDeviceModal({
  isOpen,
  onClose,
  asset,
  targetEmployee,
  availableAssets,
  employees,
  onConfirmAssign,
}: AssignDeviceModalProps) {
  if (!isOpen) return null;

  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [assignmentLocation, setAssignmentLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('Standard equipment handover.');

  useEffect(() => {
    if (asset) {
      setSelectedAssetId(asset.id);
    } else if (availableAssets.length > 0) {
      setSelectedAssetId(availableAssets[0].id);
    }

    if (targetEmployee) {
      setSelectedEmployeeId(targetEmployee.id);
      setAssignmentLocation(targetEmployee.location || 'HQ Office');
    } else if (employees.length > 0) {
      setSelectedEmployeeId(employees[0].id);
      setAssignmentLocation(employees[0].location || 'HQ Office');
    }
  }, [isOpen, asset, targetEmployee, availableAssets, employees]);

  const handleEmployeeChange = (empId: string) => {
    setSelectedEmployeeId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp && emp.location) {
      setAssignmentLocation(emp.location);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !selectedEmployeeId) {
      alert('Please select both a device and an employee.');
      return;
    }
    onConfirmAssign(selectedAssetId, selectedEmployeeId, assignmentLocation, notes);
    onClose();
  };

  const activeAsset = asset || availableAssets.find((a) => a.id === selectedAssetId);
  const activeEmp = employees.find((e) => e.id === selectedEmployeeId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assign Device to Employee</h3>
                <p className="text-xs text-slate-500">Record device custody handover and deploy hardware</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Device Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hardware Asset to Assign
              </label>
              {asset ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-mono text-xs">
                    <Laptop className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{asset.assetTag}</span>
                      <span className="text-xs font-semibold text-slate-800">{asset.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      S/N: {asset.serialNumber} • {asset.category}
                    </span>
                  </div>
                </div>
              ) : (
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Choose an Available In-Stock Device --</option>
                  {availableAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{a.assetTag}] {a.name} ({a.category} - {a.serialNumber})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Employee Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignee (Employee)
              </label>
              <select
                required
                value={selectedEmployeeId}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">-- Select Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.jobTitle} ({emp.department})
                  </option>
                ))}
              </select>

              {activeEmp && (
                <div className="mt-2 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-indigo-950">{activeEmp.name}</span>
                    <span className="text-indigo-600 block text-[11px]">{activeEmp.email}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{activeEmp.department}</span>
                </div>
              )}
            </div>

            {/* Deployment Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deployment Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={assignmentLocation}
                  onChange={(e) => setAssignmentLocation(e.target.value)}
                  placeholder="e.g. San Francisco HQ - Desk 4A or Remote - Chicago"
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Assignment Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Handover Notes / Ticket Reference
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Onboarding setup, JIRA-8402, MDM verified."
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
