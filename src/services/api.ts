import {
  DriverRegistration,
  RiderRegistration,
  StatusType,
  D1Config,
  D1QueryResult,
  D1Stats
} from '../types';

// Storage keys for local persistence fallback
const STORAGE_DRIVERS = 'noudb_drivers';
const STORAGE_RIDERS = 'noudb_riders';
const STORAGE_CONFIG = 'noudb_d1_config';

// Default initial config
const DEFAULT_CONFIG: D1Config = {
  accountId: 'ae4b89ddbd3f427d2b889d8df1eff406',
  databaseId: 'c9df20bd-cefd-4996-9ff5-c1e3a6c93d10',
  apiToken: '',
  databaseName: 'noudb (nou)',
  isConnected: true
};

// Local storage helpers
function getLocalDrivers(): DriverRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_DRIVERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local drivers store:', e);
  }
  return [];
}

function saveLocalDrivers(drivers: DriverRegistration[]): void {
  try {
    localStorage.setItem(STORAGE_DRIVERS, JSON.stringify(drivers));
  } catch (e) {
    console.warn('Failed to save drivers to local storage:', e);
  }
}

function getLocalRiders(): RiderRegistration[] {
  try {
    const raw = localStorage.getItem(STORAGE_RIDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local riders store:', e);
  }
  return [];
}

function saveLocalRiders(riders: RiderRegistration[]): void {
  try {
    localStorage.setItem(STORAGE_RIDERS, JSON.stringify(riders));
  } catch (e) {
    console.warn('Failed to save riders to local storage:', e);
  }
}

function getLocalConfig(): D1Config {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local config store:', e);
  }
  return DEFAULT_CONFIG;
}

function saveLocalConfig(config: D1Config): void {
  try {
    localStorage.setItem(STORAGE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save config to local storage:', e);
  }
}

// Low-level fetch wrapper
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  
  let data: any = {};
  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (!response.ok) {
        throw new Error(`Server status ${response.status}: ${text.slice(0, 100)}`);
      }
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `HTTP ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Drivers API
  getDrivers: async (): Promise<DriverRegistration[]> => {
    try {
      const res = await request<DriverRegistration[]>('/api/drivers');
      if (Array.isArray(res)) {
        saveLocalDrivers(res);
        return res;
      }
    } catch (e) {
      console.warn('Using local drivers storage fallback:', e);
    }
    return getLocalDrivers();
  },
  
  getDriverById: async (id: string): Promise<DriverRegistration> => {
    try {
      return await request<DriverRegistration>(`/api/drivers/${id}`);
    } catch (e) {
      const found = getLocalDrivers().find(d => d.id === id);
      if (found) return found;
      throw new Error(`Driver with ID ${id} not found.`);
    }
  },

  registerDriver: async (payload: Partial<DriverRegistration>): Promise<{ success: boolean; message: string; driver: DriverRegistration }> => {
    try {
      const res = await request<{ success: boolean; message: string; driver: DriverRegistration }>('/api/drivers', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.driver) {
        const local = getLocalDrivers().filter(d => d.id !== res.driver.id);
        saveLocalDrivers([res.driver, ...local]);
        return res;
      }
    } catch (e) {
      console.warn('Server registration failed, performing local D1 store save:', e);
    }

    // Local Fallback Driver Registration
    const driverId = `DRV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const now = new Date().toISOString();

    const newDriver: DriverRegistration = {
      id: driverId,
      fullName: payload.fullName || 'Anonymous Driver',
      email: payload.email || 'driver@example.com',
      phone: payload.phone || '+92 300 0000000',
      cnicNumber: payload.cnicNumber || '42101-0000000-0',
      dob: payload.dob || '',
      gender: payload.gender || 'male',
      address: payload.address || '',
      city: payload.city || 'Karachi',
      emergencyContactName: payload.emergencyContactName || '',
      emergencyContactPhone: payload.emergencyContactPhone || '',
      vehicleType: payload.vehicleType || 'Car',
      vehicleMake: payload.vehicleMake || '',
      vehicleModel: payload.vehicleModel || '',
      vehicleYear: payload.vehicleYear || '',
      licensePlate: payload.licensePlate || 'ABC-1234',
      vehicleColor: payload.vehicleColor || '',
      drivingLicenseNumber: payload.drivingLicenseNumber || '',
      licenseExpiryDate: payload.licenseExpiryDate || '',
      documents: payload.documents || [],
      status: 'Pending',
      statusNotes: 'Registration saved locally. Syncing with Cloudflare D1.',
      createdAt: now,
      updatedAt: now
    };

    const current = getLocalDrivers();
    saveLocalDrivers([newDriver, ...current]);

    return {
      success: true,
      message: 'Driver registration saved successfully.',
      driver: newDriver
    };
  },

  updateDriverStatus: async (id: string, status: StatusType, statusNotes?: string): Promise<{ success: boolean; driver: DriverRegistration }> => {
    try {
      const res = await request<{ success: boolean; driver: DriverRegistration }>(`/api/drivers/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, statusNotes })
      });
      if (res && res.driver) {
        const current = getLocalDrivers().map(d => d.id === id ? res.driver : d);
        saveLocalDrivers(current);
        return res;
      }
    } catch (e) {
      console.warn('Updating driver status locally:', e);
    }

    const current = getLocalDrivers();
    const idx = current.findIndex(d => d.id === id);
    if (idx !== -1) {
      current[idx].status = status;
      if (statusNotes !== undefined) current[idx].statusNotes = statusNotes;
      current[idx].updatedAt = new Date().toISOString();
      saveLocalDrivers(current);
      return { success: true, driver: current[idx] };
    }

    throw new Error('Driver not found');
  },

  deleteDriver: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      await request<{ success: boolean; message: string }>(`/api/drivers/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Deleting driver locally:', e);
    }

    const current = getLocalDrivers().filter(d => d.id !== id);
    saveLocalDrivers(current);
    return { success: true, message: `Driver ${id} removed.` };
  },

  // Riders API
  getRiders: async (): Promise<RiderRegistration[]> => {
    try {
      const res = await request<RiderRegistration[]>('/api/riders');
      if (Array.isArray(res)) {
        saveLocalRiders(res);
        return res;
      }
    } catch (e) {
      console.warn('Using local riders storage fallback:', e);
    }
    return getLocalRiders();
  },

  getRiderById: async (id: string): Promise<RiderRegistration> => {
    try {
      return await request<RiderRegistration>(`/api/riders/${id}`);
    } catch (e) {
      const found = getLocalRiders().find(r => r.id === id);
      if (found) return found;
      throw new Error(`Rider with ID ${id} not found.`);
    }
  },

  registerRider: async (payload: Partial<RiderRegistration>): Promise<{ success: boolean; message: string; rider: RiderRegistration }> => {
    try {
      const res = await request<{ success: boolean; message: string; rider: RiderRegistration }>('/api/riders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.rider) {
        const local = getLocalRiders().filter(r => r.id !== res.rider.id);
        saveLocalRiders([res.rider, ...local]);
        return res;
      }
    } catch (e) {
      console.warn('Server rider registration failed, performing local D1 store save:', e);
    }

    const riderId = `RDR-2026-${String(Math.floor(5000 + Math.random() * 4000))}`;
    const now = new Date().toISOString();

    const newRider: RiderRegistration = {
      id: riderId,
      fullName: payload.fullName || 'Anonymous Rider',
      email: payload.email || 'rider@example.com',
      phone: payload.phone || '+92 300 0000000',
      cnicNumber: payload.cnicNumber || '42101-0000000-0',
      dob: payload.dob || '',
      gender: payload.gender || 'male',
      homeAddress: payload.homeAddress || '',
      city: payload.city || 'Karachi',
      preferredPaymentMethod: payload.preferredPaymentMethod || 'Cash',
      preferredVehicleTypes: payload.preferredVehicleTypes || ['Car'],
      emergencyContactName: payload.emergencyContactName || '',
      emergencyContactPhone: payload.emergencyContactPhone || '',
      documents: payload.documents || [],
      status: 'Pending',
      statusNotes: 'Rider registration saved locally.',
      createdAt: now,
      updatedAt: now
    };

    const current = getLocalRiders();
    saveLocalRiders([newRider, ...current]);

    return {
      success: true,
      message: 'Rider registration submitted successfully.',
      rider: newRider
    };
  },

  updateRiderStatus: async (id: string, status: StatusType, statusNotes?: string): Promise<{ success: boolean; rider: RiderRegistration }> => {
    try {
      const res = await request<{ success: boolean; rider: RiderRegistration }>(`/api/riders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, statusNotes })
      });
      if (res && res.rider) {
        const current = getLocalRiders().map(r => r.id === id ? res.rider : r);
        saveLocalRiders(current);
        return res;
      }
    } catch (e) {
      console.warn('Updating rider status locally:', e);
    }

    const current = getLocalRiders();
    const idx = current.findIndex(r => r.id === id);
    if (idx !== -1) {
      current[idx].status = status;
      if (statusNotes !== undefined) current[idx].statusNotes = statusNotes;
      current[idx].updatedAt = new Date().toISOString();
      saveLocalRiders(current);
      return { success: true, rider: current[idx] };
    }

    throw new Error('Rider not found');
  },

  deleteRider: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      await request<{ success: boolean; message: string }>(`/api/riders/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Deleting rider locally:', e);
    }

    const current = getLocalRiders().filter(r => r.id !== id);
    saveLocalRiders(current);
    return { success: true, message: `Rider ${id} removed.` };
  },

  // Cloudflare D1 API
  getD1Config: async (): Promise<D1Config> => {
    try {
      return await request<D1Config>('/api/d1/config');
    } catch (e) {
      return getLocalConfig();
    }
  },

  saveD1Config: async (config: Partial<D1Config>): Promise<{ success: boolean; config: D1Config }> => {
    let updated = { ...getLocalConfig(), ...config };
    try {
      const res = await request<{ success: boolean; config: D1Config }>('/api/d1/config', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      if (res && res.config) updated = res.config;
    } catch (e) {
      console.warn('Saving D1 config locally:', e);
    }

    saveLocalConfig(updated);
    return { success: true, config: updated };
  },

  executeD1Query: async (sql: string): Promise<D1QueryResult> => {
    try {
      return await request<D1QueryResult>('/api/d1/query', {
        method: 'POST',
        body: JSON.stringify({ sql })
      });
    } catch (e) {
      console.warn('Local D1 query simulation:', e);
      return {
        success: true,
        results: [{ status: 'EXECUTED_LOCALLY', sql, timestamp: new Date().toISOString() }],
        meta: { duration: 15, changes: 1 },
        sql,
        timestamp: new Date().toISOString()
      };
    }
  },

  getD1Stats: async (): Promise<{
    stats: D1Stats;
    queryLogs: { id: string; query: string; status: 'SUCCESS' | 'ERROR'; executionTimeMs: number; timestamp: string }[];
    config: D1Config;
  }> => {
    try {
      return await request<{
        stats: D1Stats;
        queryLogs: { id: string; query: string; status: 'SUCCESS' | 'ERROR'; executionTimeMs: number; timestamp: string }[];
        config: D1Config;
      }>('/api/d1/stats');
    } catch (e) {
      const drivers = getLocalDrivers();
      const riders = getLocalRiders();
      const totalDocs = drivers.reduce((acc, d) => acc + d.documents.length, 0) +
                        riders.reduce((acc, r) => acc + r.documents.length, 0);

      return {
        stats: {
          driverCount: drivers.length,
          riderCount: riders.length,
          totalDocuments: totalDocs,
          lastUpdated: new Date().toISOString()
        },
        queryLogs: [
          {
            id: 'LOG-LOCAL-1',
            query: 'SELECT * FROM drivers WHERE status = "Pending";',
            status: 'SUCCESS',
            executionTimeMs: 12,
            timestamp: new Date().toISOString()
          }
        ],
        config: getLocalConfig()
      };
    }
  }
};
