import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, User } from 'lucide-react';
import { Employee, Department } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => void;
  initialEmployee?: Employee | null;
}

const DEPARTMENTS: Department[] = [
  'Store Operations',
  'Plant & Production',
  'IT & Infrastructure',
  'Security & Surveillance',
  'Logistics & Dispatch',
  'Finance & Accounts',
  'Management',
];

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-indigo-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-blue-600',
  'bg-teal-600',
  'bg-cyan-600',
  'bg-slate-700',
];

const COMMON_FACILITIES = [
  'COCO Store #101 - Downtown',
  'COCO Store #102 - Phoenix Metro',
  'Factory - Plant 1 (Assembly)',
  'Factory - Plant 2 (Packaging)',
  'Head Office - Main Office',
];

export function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  initialEmployee,
}: EmployeeModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Store Operations');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('COCO Store #101 - Downtown');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Terminated'>('Active');
  const [avatarColor, setAvatarColor] = useState('bg-indigo-600');

  useEffect(() => {
    if (initialEmployee) {
      setName(initialEmployee.name);
      setEmail(initialEmployee.email);
      setDepartment(initialEmployee.department);
      setJobTitle(initialEmployee.jobTitle);
      setLocation(initialEmployee.location);
      setStatus(initialEmployee.status);
      setAvatarColor(initialEmployee.avatarColor || 'bg-indigo-600');
    } else {
      setName('');
      setEmail('');
      setDepartment('Store Operations');
      setJobTitle('');
      setLocation('COCO Store #101 - Downtown');
      setStatus('Active');
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      setAvatarColor(randomColor);
    }
  }, [initialEmployee, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !jobTitle.trim()) {
      alert('Please fill in Name, Email, and Job Title.');
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      department,
      jobTitle: jobTitle.trim(),
      location: location.trim(),
      status,
      avatarColor,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              {initialEmployee ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialEmployee ? 'Edit Staff Profile' : 'Add New Staff Member'}
              </h3>
              <p className="text-xs text-slate-500">Assign to store, factory, or head office</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Singh"
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@enterprise.com"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Store Manager"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Facility / Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. COCO Store #101 - Downtown"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Facility buttons */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[11px] text-slate-500 font-medium">Quick Facility:</span>
            {COMMON_FACILITIES.map((fac) => (
              <button
                key={fac}
                type="button"
                onClick={() => setLocation(fac)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {fac}
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 -mx-6 -mb-6 mt-6">
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
              <span>{initialEmployee ? 'Save Profile' : 'Create Staff Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
