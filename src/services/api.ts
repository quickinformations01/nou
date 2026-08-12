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

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected server error occurred.');
  }

  return data as T;
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
