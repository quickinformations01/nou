export type RegistrationType = 'driver' | 'rider';

export type StatusType = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface DocumentItem {
  id: string;
  type: 'cnicFront' | 'cnicBack' | 'drivingLicense' | 'vehicleRegistration' | 'profilePhoto' | 'vehiclePhoto';
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string; // Base64 representation stored in D1 database
  uploadedAt: string;
}

export interface DriverRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cnicNumber: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  vehicleType: 'Car' | 'Motorbike' | 'Auto Rickshaw' | 'Van/Cargo' | 'SUV';
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  vehicleColor: string;
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  documents: DocumentItem[];
  status: StatusType;
  statusNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiderRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cnicNumber: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  homeAddress: string;
  city: string;
  preferredPaymentMethod: 'Cash' | 'Digital Wallet' | 'Credit/Debit Card';
  preferredVehicleTypes: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  documents: DocumentItem[];
  status: StatusType;
  statusNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface D1Config {
  accountId: string;
  databaseId: string;
  apiToken: string;
  databaseName: string;
  isConnected: boolean;
}

export interface D1QueryResult {
  success: boolean;
  results?: any[];
  meta?: {
    duration?: number;
    changes?: number;
    last_row_id?: number;
    served_by?: string;
  };
  error?: string;
  sql?: string;
  timestamp?: string;
}

export interface D1Stats {
  driverCount: number;
  riderCount: number;
  totalDocuments: number;
  lastUpdated: string;
}
