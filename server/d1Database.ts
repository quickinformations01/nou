import fs from 'fs';
import path from 'path';
import { DriverRegistration, RiderRegistration, DocumentItem, D1Config, D1QueryResult } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const D1_FILE = path.join(DATA_DIR, 'd1_store.json');

export interface D1StoreSchema {
  config: D1Config;
  drivers: DriverRegistration[];
  riders: RiderRegistration[];
  queryLogs: { id: string; query: string; status: 'SUCCESS' | 'ERROR'; executionTimeMs: number; timestamp: string }[];
}

let d1Instance: D1StoreSchema | null = null;

function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial seed records for testing
const initialDrivers: DriverRegistration[] = [
  {
    id: 'DRV-2026-1001',
    fullName: 'Mohammad Tariq Khan',
    email: 'tariq.khan@gmail.com',
    phone: '+92 300 1234567',
    cnicNumber: '42101-1234567-1',
    dob: '1992-04-12',
    gender: 'male',
    address: 'House 42, Block 5, Gulshan-e-Iqbal',
    city: 'Karachi',
    emergencyContactName: 'Rashid Khan (Brother)',
    emergencyContactPhone: '+92 301 9876543',
    vehicleType: 'Car',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla GLi',
    vehicleYear: '2020',
    licensePlate: 'KHI-9921',
    vehicleColor: 'Silver White',
    drivingLicenseNumber: 'KHI-DL-882194',
    licenseExpiryDate: '2028-10-15',
    status: 'Approved',
    statusNotes: 'CNIC, License, and Vehicle Registration verified by regional desk.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    documents: [
      {
        id: 'doc-drv-1-cnic-f',
        type: 'cnicFront',
        title: 'CNIC Front',
        fileName: 'tariq_cnic_front.jpg',
        fileType: 'image/jpeg',
        fileSize: 245000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%231e293b"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="40" y="60" fill="%2338bdf8" font-family="sans-serif" font-size="20" font-weight="bold">NATIONAL IDENTITY CARD</text><text x="40" y="100" fill="%2394a3b8" font-size="14">NAME: Mohammad Tariq Khan</text><text x="40" y="130" fill="%2394a3b8" font-size="14">CNIC: 42101-1234567-1</text><text x="40" y="160" fill="%2394a3b8" font-size="14">DOB: 12.04.1992</text><rect x="420" y="80" width="120" height="150" fill="%23334155" rx="8"/><text x="440" y="160" fill="%23e2e8f0" font-size="12">PHOTO</text><text x="40" y="320" fill="%230284c7" font-size="12" font-family="monospace">STORED IN CLOUDFLARE D1 DATABASE</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'doc-drv-1-cnic-b',
        type: 'cnicBack',
        title: 'CNIC Back',
        fileName: 'tariq_cnic_back.jpg',
        fileType: 'image/jpeg',
        fileSize: 210000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%231e293b"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="40" y="60" fill="%2338bdf8" font-family="sans-serif" font-size="18" font-weight="bold">CNIC BACK ADDRESS & CHIP</text><text x="40" y="110" fill="%2394a3b8" font-size="13">PRESENT ADDRESS: House 42, Block 5, Gulshan-e-Iqbal, Karachi</text><text x="40" y="150" fill="%2394a3b8" font-size="13">PERMANENT ADDRESS: House 42, Block 5, Gulshan-e-Iqbal, Karachi</text><rect x="40" y="200" width="100" height="70" fill="%23e2e8f0" rx="6"/><text x="50" y="240" fill="%230f172a" font-size="12" font-weight="bold">CHIP</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'doc-drv-1-lic',
        type: 'drivingLicense',
        title: 'Driving License',
        fileName: 'tariq_license.jpg',
        fileType: 'image/jpeg',
        fileSize: 310000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%23064e3b"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%23022c22" stroke="%2334d399" stroke-width="2"/><text x="40" y="60" fill="%2334d399" font-family="sans-serif" font-size="20" font-weight="bold">DRIVING LICENSE - LTV / CAR</text><text x="40" y="110" fill="%23a7f3d0" font-size="14">LICENSE NO: KHI-DL-882194</text><text x="40" y="140" fill="%23a7f3d0" font-size="14">HOLDER: Mohammad Tariq Khan</text><text x="40" y="170" fill="%23a7f3d0" font-size="14">EXPIRY: 15 OCT 2028</text><rect x="420" y="80" width="120" height="150" fill="%23065f46" rx="8"/><text x="435" y="160" fill="%23ecfdf5" font-size="12">DRIVER PIC</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'doc-drv-1-reg',
        type: 'vehicleRegistration',
        title: 'Vehicle Registration',
        fileName: 'corolla_smartcard.jpg',
        fileType: 'image/jpeg',
        fileSize: 280000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%23312e81"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%231e1b4b" stroke="%23818cf8" stroke-width="2"/><text x="40" y="60" fill="%23818cf8" font-family="sans-serif" font-size="20" font-weight="bold">VEHICLE REGISTRATION SMART CARD</text><text x="40" y="110" fill="%23c7d2fe" font-size="14">REGISTRATION NO: KHI-9921</text><text x="40" y="140" fill="%23c7d2fe" font-size="14">MAKE & MODEL: Toyota Corolla GLi 2020</text><text x="40" y="170" fill="%23c7d2fe" font-size="14">ENGINE NO: 1NZ-FE-772910</text><text x="40" y="200" fill="%23c7d2fe" font-size="14">CHASSIS NO: NZE170-881923</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ]
  },
  {
    id: 'DRV-2026-1002',
    fullName: 'Usman Ali Shah',
    email: 'usman.shah@hotmail.com',
    phone: '+92 321 4455667',
    cnicNumber: '35202-9876543-3',
    dob: '1995-11-20',
    gender: 'male',
    address: 'Street 12, Johar Town, Phase 2',
    city: 'Lahore',
    emergencyContactName: 'Fatima Shah (Wife)',
    emergencyContactPhone: '+92 321 8877665',
    vehicleType: 'Motorbike',
    vehicleMake: 'Honda',
    vehicleModel: 'CG 125',
    vehicleYear: '2023',
    licensePlate: 'LEO-4412',
    vehicleColor: 'Red',
    drivingLicenseNumber: 'LHR-DL-554123',
    licenseExpiryDate: '2027-05-30',
    status: 'Pending',
    statusNotes: 'Awaiting admin document verification for CNIC back.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    documents: [
      {
        id: 'doc-drv-2-cnic-f',
        type: 'cnicFront',
        title: 'CNIC Front',
        fileName: 'usman_cnic_f.jpg',
        fileType: 'image/jpeg',
        fileSize: 195000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%231e293b"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="40" y="60" fill="%2338bdf8" font-family="sans-serif" font-size="20" font-weight="bold">NATIONAL IDENTITY CARD</text><text x="40" y="100" fill="%2394a3b8" font-size="14">NAME: Usman Ali Shah</text><text x="40" y="130" fill="%2394a3b8" font-size="14">CNIC: 35202-9876543-3</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'doc-drv-2-lic',
        type: 'drivingLicense',
        title: 'Driving License',
        fileName: 'usman_lic.jpg',
        fileType: 'image/jpeg',
        fileSize: 220000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%23064e3b"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%23022c22" stroke="%2334d399" stroke-width="2"/><text x="40" y="60" fill="%2334d399" font-family="sans-serif" font-size="20" font-weight="bold">DRIVING LICENSE - MOTORCYCLE</text><text x="40" y="110" fill="%23a7f3d0" font-size="14">LICENSE NO: LHR-DL-554123</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ]
  }
];

const initialRiders: RiderRegistration[] = [
  {
    id: 'RDR-2026-5001',
    fullName: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@gmail.com',
    phone: '+92 333 7788990',
    cnicNumber: '61101-5544332-2',
    dob: '1998-09-05',
    gender: 'female',
    homeAddress: 'House 14, Street 8, F-8/3',
    city: 'Islamabad',
    preferredPaymentMethod: 'Digital Wallet',
    preferredVehicleTypes: ['Car', 'SUV'],
    emergencyContactName: 'Dr. Tariq Siddiqui (Father)',
    emergencyContactPhone: '+92 333 1122334',
    status: 'Approved',
    statusNotes: 'Rider profile & CNIC documents verified.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    documents: [
      {
        id: 'doc-rdr-1-cnic-f',
        type: 'cnicFront',
        title: 'CNIC Front',
        fileName: 'ayesha_cnic_front.jpg',
        fileType: 'image/jpeg',
        fileSize: 205000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%231e293b"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="40" y="60" fill="%2338bdf8" font-family="sans-serif" font-size="20" font-weight="bold">RIDER NATIONAL IDENTITY CARD</text><text x="40" y="100" fill="%2394a3b8" font-size="14">NAME: Ayesha Siddiqui</text><text x="40" y="130" fill="%2394a3b8" font-size="14">CNIC: 61101-5544332-2</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        id: 'doc-rdr-1-cnic-b',
        type: 'cnicBack',
        title: 'CNIC Back',
        fileName: 'ayesha_cnic_back.jpg',
        fileType: 'image/jpeg',
        fileSize: 198000,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="100%" height="100%" fill="%231e293b"/><rect x="20" y="20" width="560" height="340" rx="16" fill="%230f172a" stroke="%2338bdf8" stroke-width="2"/><text x="40" y="60" fill="%2338bdf8" font-family="sans-serif" font-size="18" font-weight="bold">RIDER CNIC BACK ADDRESS</text><text x="40" y="110" fill="%2394a3b8" font-size="13">ADDRESS: F-8/3, Islamabad</text></svg>',
        uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ]
  }
];

export function loadD1Store(): D1StoreSchema {
  if (d1Instance) return d1Instance;
  ensureDataDirExists();

  if (fs.existsSync(D1_FILE)) {
    try {
      const data = fs.readFileSync(D1_FILE, 'utf-8');
      d1Instance = JSON.parse(data);
      if (d1Instance) {
        if (!d1Instance.config.accountId && process.env.CLOUDFLARE_D1_ACCOUNT_ID) {
          d1Instance.config.accountId = process.env.CLOUDFLARE_D1_ACCOUNT_ID;
        }
        if (!d1Instance.config.databaseId && process.env.CLOUDFLARE_D1_DATABASE_ID) {
          d1Instance.config.databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
        }
        if (!d1Instance.config.apiToken && process.env.CLOUDFLARE_D1_API_TOKEN) {
          d1Instance.config.apiToken = process.env.CLOUDFLARE_D1_API_TOKEN;
        }
        if (process.env.CLOUDFLARE_D1_API_TOKEN) {
          d1Instance.config.apiToken = process.env.CLOUDFLARE_D1_API_TOKEN;
        }
        d1Instance.config.isConnected = !!(d1Instance.config.accountId && d1Instance.config.apiToken);
      }
      console.log('Cloudflare D1 Local Store loaded.');
      return d1Instance!;
    } catch (err) {
      console.error('Error reading d1_store.json, creating new store:', err);
    }
  }

  const defaultConfig: D1Config = {
    accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID || '',
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || '',
    apiToken: process.env.CLOUDFLARE_D1_API_TOKEN || '',
    databaseName: 'noudb (nou)',
    isConnected: !!(process.env.CLOUDFLARE_D1_ACCOUNT_ID || process.env.CLOUDFLARE_D1_API_TOKEN)
  };

  d1Instance = {
    config: defaultConfig,
    drivers: initialDrivers,
    riders: initialRiders,
    queryLogs: [
      {
        id: `qlog-init-1`,
        query: `CREATE TABLE IF NOT EXISTS drivers (id TEXT PRIMARY KEY, fullName TEXT, email TEXT, phone TEXT, cnicNumber TEXT, vehicleType TEXT, licensePlate TEXT, drivingLicenseNumber TEXT, status TEXT, createdAt TEXT);`,
        status: 'SUCCESS',
        executionTimeMs: 12,
        timestamp: new Date().toISOString()
      },
      {
        id: `qlog-init-2`,
        query: `CREATE TABLE IF NOT EXISTS riders (id TEXT PRIMARY KEY, fullName TEXT, email TEXT, phone TEXT, cnicNumber TEXT, homeAddress TEXT, preferredPaymentMethod TEXT, status TEXT, createdAt TEXT);`,
        status: 'SUCCESS',
        executionTimeMs: 9,
        timestamp: new Date().toISOString()
      },
      {
        id: `qlog-init-3`,
        query: `CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, ownerId TEXT, ownerType TEXT, docType TEXT, fileName TEXT, dataUrl TEXT, uploadedAt TEXT);`,
        status: 'SUCCESS',
        executionTimeMs: 14,
        timestamp: new Date().toISOString()
      }
    ]
  };

  saveD1Store();
  return d1Instance;
}

export function saveD1Store(): void {
  if (!d1Instance) return;
  ensureDataDirExists();
  try {
    fs.writeFileSync(D1_FILE, JSON.stringify(d1Instance, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving d1_store.json:', err);
  }
}

let schemaInitialized = false;

export async function initCloudflareD1Schema(): Promise<void> {
  if (schemaInitialized) return;
  const store = loadD1Store();
  if (!store.config.accountId || !store.config.databaseId || !store.config.apiToken) return;

  schemaInitialized = true;

  const ddlQueries = [
    `CREATE TABLE IF NOT EXISTS drivers (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      cnicNumber TEXT NOT NULL,
      dob TEXT,
      gender TEXT,
      address TEXT,
      city TEXT,
      emergencyContactName TEXT,
      emergencyContactPhone TEXT,
      vehicleType TEXT,
      vehicleMake TEXT,
      vehicleModel TEXT,
      vehicleYear TEXT,
      licensePlate TEXT,
      vehicleColor TEXT,
      drivingLicenseNumber TEXT,
      licenseExpiryDate TEXT,
      status TEXT DEFAULT 'Pending',
      statusNotes TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS riders (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      cnicNumber TEXT NOT NULL,
      dob TEXT,
      gender TEXT,
      homeAddress TEXT,
      city TEXT,
      preferredPaymentMethod TEXT,
      preferredVehicleTypes TEXT,
      emergencyContactName TEXT,
      emergencyContactPhone TEXT,
      status TEXT DEFAULT 'Approved',
      statusNotes TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      ownerId TEXT,
      ownerType TEXT,
      docType TEXT,
      fileName TEXT,
      dataUrl TEXT,
      uploadedAt TEXT
    );`
  ];

  for (const sql of ddlQueries) {
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${store.config.accountId}/d1/database/${store.config.databaseId}/query`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${store.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
      });
    } catch (e) {
      console.warn('Failed to auto-init Cloudflare D1 schema:', e);
    }
  }
}

/**
 * Executes a raw SQL query against Cloudflare D1 REST API if credentials exist,
 * or simulates D1 SQL execution locally.
 */
export async function executeD1Query(sql: string, params: any[] = []): Promise<D1QueryResult> {
  const store = loadD1Store();
  const startTime = Date.now();

  // Ensure tables exist on Cloudflare D1
  if (store.config.accountId && store.config.databaseId && store.config.apiToken) {
    await initCloudflareD1Schema();
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${store.config.accountId}/d1/database/${store.config.databaseId}/query`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${store.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, params })
      });

      const responseText = await response.text();
      let data: any = null;
      if (responseText && responseText.trim().length > 0) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.warn('Non-JSON response from Cloudflare API:', responseText.slice(0, 100));
        }
      }

      const duration = Date.now() - startTime;

      if (data && data.success && data.result && data.result[0]) {
        const queryRes = data.result[0];
        store.queryLogs.unshift({
          id: `qlog-${Date.now()}`,
          query: sql,
          status: 'SUCCESS',
          executionTimeMs: duration,
          timestamp: new Date().toISOString()
        });
        saveD1Store();

        return {
          success: true,
          results: queryRes.results || [],
          meta: queryRes.meta,
          sql,
          timestamp: new Date().toISOString()
        };
      } else {
        const errorMsg = data?.errors?.[0]?.message || (data ? JSON.stringify(data) : responseText.slice(0, 150)) || 'Cloudflare D1 API Query Failed';
        store.queryLogs.unshift({
          id: `qlog-${Date.now()}`,
          query: sql,
          status: 'ERROR',
          executionTimeMs: duration,
          timestamp: new Date().toISOString()
        });
        saveD1Store();

        return {
          success: false,
          error: errorMsg,
          sql,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err: any) {
      console.warn('Direct Cloudflare D1 API call failed, falling back to local D1 engine:', err.message);
    }
  }

  // Local D1 SQL parser & execution simulation
  const duration = Date.now() - startTime;
  const upperSql = sql.trim().toUpperCase();

  let results: any[] = [];
  let changes = 0;

  if (upperSql.startsWith('SELECT')) {
    if (upperSql.includes('FROM DRIVERS')) {
      results = store.drivers;
    } else if (upperSql.includes('FROM RIDERS')) {
      results = store.riders;
    } else if (upperSql.includes('FROM DOCUMENTS')) {
      results = store.drivers.flatMap((d) => d.documents).concat(store.riders.flatMap((r) => r.documents));
    } else {
      results = [
        { d1_version: 'Cloudflare D1 (SQLite 3.42.0)', status: 'ACTIVE', database_id: store.config.databaseId || 'noudb' }
      ];
    }
  } else if (upperSql.startsWith('INSERT') || upperSql.startsWith('UPDATE') || upperSql.startsWith('DELETE') || upperSql.startsWith('CREATE')) {
    changes = 1;
  }

  const servedByReason = !store.config.apiToken
    ? 'Local Store (Missing API Token - Provide API Token in D1 Settings)'
    : 'Local Store (Cloudflare API Call Exception)';

  store.queryLogs.unshift({
    id: `qlog-${Date.now()}`,
    query: sql,
    status: 'SUCCESS',
    executionTimeMs: duration,
    timestamp: new Date().toISOString()
  });
  saveD1Store();

  return {
    success: true,
    results,
    meta: {
      duration,
      changes,
      served_by: servedByReason
    },
    sql,
    timestamp: new Date().toISOString()
  };
}

/**
 * Bulk syncs all local drivers, riders, and documents from memory to Cloudflare D1 Database REST API.
 */
export async function syncAllToCloudflareD1(): Promise<{
  success: boolean;
  syncedDrivers: number;
  syncedRiders: number;
  syncedDocuments: number;
  errors: string[];
}> {
  const store = loadD1Store();
  if (!store.config.accountId || !store.config.databaseId || !store.config.apiToken) {
    throw new Error('Cloudflare D1 credentials missing. Please set Account ID, Database ID, and API Token in D1 Console Settings.');
  }

  await initCloudflareD1Schema();

  let syncedDrivers = 0;
  let syncedRiders = 0;
  let syncedDocuments = 0;
  const errors: string[] = [];

  // Sync drivers
  for (const driver of store.drivers) {
    const sql = `INSERT OR REPLACE INTO drivers (
      id, fullName, email, phone, cnicNumber, dob, gender, address, city,
      emergencyContactName, emergencyContactPhone, vehicleType, vehicleMake, vehicleModel,
      vehicleYear, licensePlate, vehicleColor, drivingLicenseNumber, licenseExpiryDate,
      status, statusNotes, createdAt, updatedAt
    ) VALUES (
      '${driver.id}', '${driver.fullName.replace(/'/g, "''")}', '${driver.email.replace(/'/g, "''")}', '${driver.phone}', '${driver.cnicNumber}',
      '${driver.dob || ''}', '${driver.gender || ''}', '${(driver.address || '').replace(/'/g, "''")}', '${(driver.city || '').replace(/'/g, "''")}',
      '${(driver.emergencyContactName || '').replace(/'/g, "''")}', '${driver.emergencyContactPhone || ''}', '${driver.vehicleType || ''}',
      '${(driver.vehicleMake || '').replace(/'/g, "''")}', '${(driver.vehicleModel || '').replace(/'/g, "''")}', '${driver.vehicleYear || ''}',
      '${driver.licensePlate || ''}', '${driver.vehicleColor || ''}', '${driver.drivingLicenseNumber || ''}', '${driver.licenseExpiryDate || ''}',
      '${driver.status || 'Pending'}', '${(driver.statusNotes || '').replace(/'/g, "''")}', '${driver.createdAt}', '${driver.updatedAt}'
    );`;

    const res = await executeD1Query(sql);
    if (res.success) {
      syncedDrivers++;
    } else {
      errors.push(`Driver ${driver.id}: ${res.error}`);
    }

    for (const doc of driver.documents) {
      const docSql = `INSERT OR REPLACE INTO documents (id, ownerId, ownerType, docType, fileName, uploadedAt) VALUES ('${doc.id}', '${driver.id}', 'driver', '${doc.type}', '${doc.fileName.replace(/'/g, "''")}', '${doc.uploadedAt}');`;
      const docRes = await executeD1Query(docSql);
      if (docRes.success) syncedDocuments++;
    }
  }

  // Sync riders
  for (const rider of store.riders) {
    const sql = `INSERT OR REPLACE INTO riders (
      id, fullName, email, phone, cnicNumber, dob, gender, homeAddress, city,
      preferredPaymentMethod, preferredVehicleTypes, emergencyContactName, emergencyContactPhone,
      status, statusNotes, createdAt, updatedAt
    ) VALUES (
      '${rider.id}', '${rider.fullName.replace(/'/g, "''")}', '${rider.email.replace(/'/g, "''")}', '${rider.phone}', '${rider.cnicNumber}',
      '${rider.dob || ''}', '${rider.gender || ''}', '${(rider.homeAddress || '').replace(/'/g, "''")}', '${(rider.city || '').replace(/'/g, "''")}',
      '${rider.preferredPaymentMethod || 'Cash'}', '${JSON.stringify(rider.preferredVehicleTypes || [])}',
      '${(rider.emergencyContactName || '').replace(/'/g, "''")}', '${rider.emergencyContactPhone || ''}',
      '${rider.status || 'Pending'}', '${(rider.statusNotes || '').replace(/'/g, "''")}', '${rider.createdAt}', '${rider.updatedAt}'
    );`;

    const res = await executeD1Query(sql);
    if (res.success) {
      syncedRiders++;
    } else {
      errors.push(`Rider ${rider.id}: ${res.error}`);
    }

    for (const doc of rider.documents) {
      const docSql = `INSERT OR REPLACE INTO documents (id, ownerId, ownerType, docType, fileName, uploadedAt) VALUES ('${doc.id}', '${rider.id}', 'rider', '${doc.type}', '${doc.fileName.replace(/'/g, "''")}', '${doc.uploadedAt}');`;
      const docRes = await executeD1Query(docSql);
      if (docRes.success) syncedDocuments++;
    }
  }

  return {
    success: errors.length === 0,
    syncedDrivers,
    syncedRiders,
    syncedDocuments,
    errors
  };
}

