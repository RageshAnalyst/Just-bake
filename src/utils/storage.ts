import { Asset, Employee } from '../types';
import { INITIAL_ASSETS, INITIAL_EMPLOYEES } from '../data/mockData';

const ASSETS_KEY = 'it_assets_inventory_data_v3';
const EMPLOYEES_KEY = 'it_assets_employees_data_v3';

export function loadStoredAssets(): Asset[] {
  try {
    const data = localStorage.getItem(ASSETS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse assets from localStorage', e);
  }
  return INITIAL_ASSETS;
}

export function saveStoredAssets(assets: Asset[]): void {
  try {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  } catch (e) {
    console.error('Failed to save assets to localStorage', e);
  }
}

export function loadStoredEmployees(): Employee[] {
  try {
    const data = localStorage.getItem(EMPLOYEES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse employees from localStorage', e);
  }
  return INITIAL_EMPLOYEES;
}

export function saveStoredEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error('Failed to save employees to localStorage', e);
  }
}

export function resetApplicationData(): { assets: Asset[]; employees: Employee[] } {
  localStorage.removeItem(ASSETS_KEY);
  localStorage.removeItem(EMPLOYEES_KEY);
  return {
    assets: INITIAL_ASSETS,
    employees: INITIAL_EMPLOYEES,
  };
}

export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function exportAssetsToCSV(assets: Asset[], employees: Employee[]): void {
  const employeeMap = new Map(employees.map((e) => [e.id, e]));

  const headers = [
    'Asset Tag',
    'Device Name',
    'Category',
    'Location Type',
    'Location Name',
    'Sub-Location / Area',
    'IP Address',
    'Status',
    'Condition',
    'Assigned To',
    'Manufacturer',
    'Model',
    'Serial Number',
    'Purchase Cost ($)',
    'Purchase Date',
    'Notes',
  ];

  const rows = assets.map((asset) => {
    const assignedEmp = asset.currentEmployeeId ? employeeMap.get(asset.currentEmployeeId) : null;
    return [
      asset.assetTag,
      `"${(asset.name || '').replace(/"/g, '""')}"`,
      asset.category,
      asset.locationType,
      `"${(asset.locationName || '').replace(/"/g, '""')}"`,
      `"${(asset.subLocation || '').replace(/"/g, '""')}"`,
      asset.ipAddress || '',
      asset.status,
      asset.condition,
      assignedEmp ? `"${assignedEmp.name}"` : 'Unassigned / Shared',
      asset.manufacturer,
      `"${(asset.model || '').replace(/"/g, '""')}"`,
      asset.serialNumber,
      asset.purchaseCost || 0,
      asset.purchaseDate || '',
      `"${(asset.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `asset_inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
