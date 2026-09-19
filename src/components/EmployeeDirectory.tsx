import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  MapPin,
  Briefcase,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  Store,
  Factory,
  Building2,
  Plus,
} from 'lucide-react';
import { Asset, Employee, Department } from '../types';
import { CategoryIcon, StatusBadge, LocationTypeBadge } from './Badges';

interface EmployeeDirectoryProps {
  employees: Employee[];
  assets: Asset[];
  onAssignToEmployee: (employee: Employee) => void;
  onUnassignAsset: (assetId: string) => void;
  onSelectAsset: (asset: Asset) => void;
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
}

const DEPARTMENTS: ('ALL' | Department)[] = [
  'ALL',
  'Store Operations',
  'Plant & Production',
  'IT & Infrastructure',
  'Security & Surveillance',
  'Logistics & Dispatch',
  'Finance & Accounts',
  'Management',
];

export function EmployeeDirectory({
  employees,
  assets,
  onAssignToEmployee,
  onUnassignAsset,
  onSelectAsset,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
}: EmployeeDirectoryProps) {
  const [selectedDept, setSelectedDept] = useState<'ALL' | Department>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Group assets by employee ID
  const assetsByEmployee = new Map<string, Asset[]>();
  for (const asset of assets) {
    if (asset.currentEmployeeId) {
      const existing = assetsByEmployee.get(asset.currentEmployeeId) || [];
      existing.push(asset);
      assetsByEmployee.set(asset.currentEmployeeId, existing);
    }
  }

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.jobTitle.toLowerCase().includes(q) ||
      emp.location.toLowerCase().includes(q);

    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Filter & Add Staff Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Department:</span>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept === 'ALL' ? `All Staff (${employees.length})` : dept}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={onAddEmployee}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => {
          const assignedAssets = assetsByEmployee.get(employee.id) || [];

          return (
            <div
              key={employee.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Employee Info Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${employee.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-2xs`}
                    >
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{employee.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{employee.jobTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditEmployee(employee)}
                      title="Edit employee"
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${employee.name} from staff directory?`)) {
                          onDeleteEmployee(employee.id);
                        }
                      }}
                      title="Delete employee"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Badges & Meta */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-700 truncate">{employee.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500 font-mono text-[11px] truncate">{employee.email}</span>
                  </div>
                </div>

                {/* Assigned Hardware Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Assigned Devices ({assignedAssets.length})
                    </span>

                    <button
                      onClick={() => onAssignToEmployee(employee)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Assign Device</span>
                    </button>
                  </div>

                  {assignedAssets.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                      {assignedAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs hover:bg-slate-100 transition-colors"
                        >
                          <div
                            onClick={() => onSelectAsset(asset)}
                            className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                          >
                            <CategoryIcon category={asset.category} className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            <div className="truncate">
                              <span className="font-mono font-bold text-[10px] px-1 py-0.2 rounded bg-slate-800 text-white mr-1.5">
                                {asset.assetTag}
                              </span>
                              <span className="font-medium text-slate-800 text-xs truncate">
                                {asset.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => onUnassignAsset(asset.id)}
                              title="Unassign device"
                              className="text-[10px] px-1.5 py-0.5 font-medium text-slate-500 hover:text-rose-600 hover:bg-white rounded transition-colors cursor-pointer"
                            >
                              Release
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                      No personal hardware assigned
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
