import React from 'react';
import {
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Printer,
  Camera,
  Video,
  HardDrive,
  Network,
  Keyboard,
  Store,
  Factory,
  Building2,
  Package,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Archive,
  Radio,
} from 'lucide-react';
import { AssetCategory, AssetStatus, HealthCondition, LocationType } from '../types';

export function CategoryIcon({
  category,
  className = 'w-4 h-4',
}: {
  category: AssetCategory;
  className?: string;
}) {
  switch (category) {
    case 'Laptop':
      return <Laptop className={className} />;
    case '2-in-1 PCs':
      return <Tablet className={className} />;
    case 'Desktops':
      return <Monitor className={className} />;
    case 'Printers':
      return <Printer className={className} />;
    case 'Mobile Phones':
      return <Smartphone className={className} />;
    case 'CCTV Camera':
      return <Video className={className} />;
    case 'IP Camera':
      return <Camera className={className} />;
    case 'DVR / NVR':
      return <HardDrive className={className} />;
    case 'Network Devices':
      return <Network className={className} />;
    case 'Other Peripheral':
      return <Keyboard className={className} />;
    default:
      return <HardDrive className={className} />;
  }
}

export function StatusBadge({ status }: { status: AssetStatus }) {
  switch (status) {
    case 'In Use':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          In Use
        </span>
      );
    case 'In Stock':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
          In Stock
        </span>
      );
    case 'Maintenance':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Wrench className="w-3 h-3 text-amber-600" />
          Maintenance
        </span>
      );
    case 'Decommissioned':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <Archive className="w-3 h-3 text-slate-400" />
          Decommissioned
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
          {status}
        </span>
      );
  }
}

export function LocationTypeBadge({ type }: { type: LocationType }) {
  switch (type) {
    case 'COCO Store':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Store className="w-3 h-3 text-emerald-600" />
          COCO Store
        </span>
      );
    case 'Factory':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Factory className="w-3 h-3 text-amber-600" />
          Factory
        </span>
      );
    case 'Head Office':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <Building2 className="w-3 h-3 text-blue-600" />
          Head Office
        </span>
      );
    case 'Warehouse':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
          <Package className="w-3 h-3 text-purple-600" />
          Warehouse
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
          {type}
        </span>
      );
  }
}

export function ConditionBadge({ condition }: { condition: HealthCondition }) {
  switch (condition) {
    case 'Good':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
          Good
        </span>
      );
    case 'Fair':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Fair
        </span>
      );
    case 'Damaged':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3" />
          Damaged
        </span>
      );
    default:
      return null;
  }
}
