import {
  DriverRegistration,
  RiderRegistration,
  StatusType,
  D1Config,
  D1QueryResult,
  D1Stats
} from '../types';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    
    let data: any = {};
    if (text && text.trim().length > 0) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}: ${text.slice(0, 100)}`);
        }
        throw new Error(`Invalid JSON response from ${url}`);
      }
    }

    if (!response.ok) {
      if (response.status === 405) {
        throw new Error(`HTTP 405 Method Not Allowed on ${url}. Please verify request method ${options.method || 'GET'}.`);
      }
      throw new Error(data?.error || data?.message || `Server request failed with status ${response.status}`);
    }

    return data as T;
  } catch (err: any) {
    console.error(`API Request Error [${options.method || 'GET'} ${url}]:`, err);
    throw err;
  }
}

export const api = {
  // Drivers API
  getDrivers: () => request<DriverRegistration[]>('/api/drivers'),
  
  getDriverById: (id: string) => request<DriverRegistration>(`/api/drivers/${id}`),

  registerDriver: (payload: Partial<DriverRegistration>) =>
    request<{ success: boolean; message: string; driver: DriverRegistration }>('/api/drivers', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateDriverStatus: (id: string, status: StatusType, statusNotes?: string) =>
    request<{ success: boolean; driver: DriverRegistration }>(`/api/drivers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, statusNotes })
    }),

  deleteDriver: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/drivers/${id}`, {
      method: 'DELETE'
    }),

  // Riders API
  getRiders: () => request<RiderRegistration[]>('/api/riders'),

  getRiderById: (id: string) => request<RiderRegistration>(`/api/riders/${id}`),

  registerRider: (payload: Partial<RiderRegistration>) =>
    request<{ success: boolean; message: string; rider: RiderRegistration }>('/api/riders', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateRiderStatus: (id: string, status: StatusType, statusNotes?: string) =>
    request<{ success: boolean; rider: RiderRegistration }>(`/api/riders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, statusNotes })
    }),

  deleteRider: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/riders/${id}`, {
      method: 'DELETE'
    }),

  // Cloudflare D1 API
  getD1Config: () => request<D1Config>('/api/d1/config'),

  saveD1Config: (config: Partial<D1Config>) =>
    request<{ success: boolean; config: D1Config }>('/api/d1/config', {
      method: 'POST',
      body: JSON.stringify(config)
    }),

  executeD1Query: (sql: string) =>
    request<D1QueryResult>('/api/d1/query', {
      method: 'POST',
      body: JSON.stringify({ sql })
    }),

  getD1Stats: () =>
    request<{
      stats: D1Stats;
      queryLogs: { id: string; query: string; status: 'SUCCESS' | 'ERROR'; executionTimeMs: number; timestamp: string }[];
      config: D1Config;
    }>('/api/d1/stats')
};
