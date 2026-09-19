export type AssetStatus = 'In Use' | 'In Stock' | 'Maintenance' | 'Decommissioned';

export type HealthCondition = 'Good' | 'Fair' | 'Damaged';

export type LocationType = 'COCO Store' | 'Factory' | 'Head Office' | 'Warehouse' | 'Other';

export type AssetCategory =
  | 'Laptop'
  | '2-in-1 PCs'
  | 'Desktops'
  | 'Printers'
  | 'Mobile Phones'
  | 'CCTV Camera'
  | 'IP Camera'
  | 'DVR / NVR'
  | 'Network Devices'
  | 'Other Peripheral';

export interface Asset {
  id: string;
  assetTag: string; // e.g. AST-1042
  serialNumber: string; // e.g. C02GL4P7MD6T
  name: string; // e.g. Dell OptiPlex 3090 / Hikvision 4MP Turret
  category: AssetCategory;
  locationType: LocationType; // 'COCO Store' | 'Factory' | 'Head Office' | 'Warehouse' | 'Other'
  locationName: string; // e.g. 'COCO Store #101 - Downtown', 'Factory - Plant 1 (Assembly)'
  subLocation?: string; // e.g. 'Cash Counter 1', 'Main Entry Gate', 'Manager Cabin', 'Packaging Bay'
  status: AssetStatus; // 'In Use' | 'In Stock' | 'Maintenance' | 'Decommissioned'
  condition: HealthCondition; // 'Good' | 'Fair' | 'Damaged'
  currentEmployeeId: string | null; // null if unassigned or location shared infrastructure
  ipAddress?: string; // Optional IP for cameras, NVRs, printers, network switches
  manufacturer: string;
  model: string;
  specifications?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  notes?: string;
  updatedAt: string;
}

export type Department =
  | 'Store Operations'
  | 'Plant & Production'
  | 'IT & Infrastructure'
  | 'Security & Surveillance'
  | 'Logistics & Dispatch'
  | 'Finance & Accounts'
  | 'Management';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  jobTitle: string;
  locationType?: LocationType;
  location: string;
  avatarColor: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export type ViewTab = 'inventory' | 'location_wise' | 'employees';

