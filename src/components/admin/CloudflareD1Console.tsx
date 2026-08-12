import React, { useEffect, useState } from 'react';
import {
  Database,
  Terminal,
  Play,
  Settings,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Copy,
  Clock,
  Key,
  Layers,
  Sparkles,
  Server,
  RefreshCw,
  Table
} from 'lucide-react';
import { api } from '../../services/api';
import { D1Config, D1QueryResult, D1Stats } from '../../types';

export const CloudflareD1Console: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'query' | 'settings' | 'logs' | 'schema'>('query');

  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM drivers;');
  const [queryResult, setQueryResult] = useState<D1QueryResult | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const [d1Config, setD1Config] = useState<D1Config>({
    accountId: '',
    databaseId: 'noudb',
    apiToken: '',
    connected: false,
    mode: 'simulation'
  });

  const [d1Stats, setD1Stats] = useState<D1Stats | null>(null);
  const [queryLogs, setQueryLogs] = useState<any[]>([]);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const fetchD1Info = async () => {
    try {
      const statsRes = await api.getD1Stats();
      setD1Config(statsRes.config);
      setD1Stats(statsRes.stats);
      setQueryLogs(statsRes.queryLogs);
    } catch (err) {
      console.error('Failed to load D1 info:', err);
    }
  };

  useEffect(() => {
    fetchD1Info();
  }, []);

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return;
    setQueryLoading(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      const res = await api.executeD1Query(sqlQuery);
      setQueryResult(res);
      fetchD1Info(); // refresh logs & stats
    } catch (err: any) {
      setQueryError(err.message || 'Execution failed');
    } finally {
      setQueryLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setConfigSuccess(null);
    try {
      const res = await api.saveD1Config(d1Config);
      setD1Config(res.config);
      setConfigSuccess('Cloudflare D1 connection configuration saved successfully!');
      fetchD1Info();
    } catch (err: any) {
      alert(err.message || 'Failed to save D1 configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const schemaSqlCode = `-- Cloudflare D1 Database Schema for Driver & Rider Portal
-- Database Name: noudb / nou

CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cnicNumber TEXT NOT NULL UNIQUE,
  dob TEXT,
  gender TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  emergencyContactName TEXT,
  emergencyContactPhone TEXT,
  vehicleType TEXT NOT NULL,
  vehicleMake TEXT NOT NULL,
  vehicleModel TEXT NOT NULL,
  vehicleYear TEXT,
  licensePlate TEXT NOT NULL,
  vehicleColor TEXT,
  drivingLicenseNumber TEXT NOT NULL,
  licenseExpiryDate TEXT,
  status TEXT DEFAULT 'Pending',
  statusNotes TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS riders (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cnicNumber TEXT NOT NULL UNIQUE,
  dob TEXT,
  gender TEXT,
  homeAddress TEXT NOT NULL,
  city TEXT NOT NULL,
  preferredPaymentMethod TEXT,
  preferredVehicleTypes TEXT,
  emergencyContactName TEXT,
  emergencyContactPhone TEXT,
  status TEXT DEFAULT 'Approved',
  statusNotes TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  entityId TEXT NOT NULL,
  entityType TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  fileName TEXT NOT NULL,
  fileType TEXT NOT NULL,
  fileSize INTEGER NOT NULL,
  dataUrl TEXT NOT NULL,
  uploadedAt TEXT NOT NULL
);
`;

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(schemaSqlCode);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Cloudflare D1 Console</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1 ${
                    d1Config.mode === 'cloudflare_api'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  <Server className="w-3 h-3" />
                  {d1Config.mode === 'cloudflare_api' ? 'Real Cloudflare API' : 'D1 Local Store Simulation'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Database: <span className="font-mono text-sky-400">{d1Config.databaseId || 'noudb'}</span> • SQL Engine for Drivers, Riders & CNIC Documents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchD1Info}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
            </button>
          </div>
        </div>

        {/* Database Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">drivers Count:</span>
            <span className="font-mono font-bold text-sky-400 ml-2">{d1Stats?.driverCount || 0}</span>
          </div>
          <div>
            <span className="text-slate-400">riders Count:</span>
            <span className="font-mono font-bold text-purple-400 ml-2">{d1Stats?.riderCount || 0}</span>
          </div>
          <div>
            <span className="text-slate-400">documents Count:</span>
            <span className="font-mono font-bold text-emerald-400 ml-2">{d1Stats?.documentCount || 0}</span>
          </div>
          <div>
            <span className="text-slate-400">Total D1 Size:</span>
            <span className="font-mono font-bold text-amber-400 ml-2">
              {((d1Stats?.totalSizeKb || 0) / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveSubTab('query')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeSubTab === 'query'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" /> SQL Query Runner
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeSubTab === 'settings'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" /> Cloudflare Credentials
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeSubTab === 'logs'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" /> Query Audit Logs ({queryLogs.length})
        </button>

        <button
          onClick={() => setActiveSubTab('schema')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeSubTab === 'schema'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" /> D1 schema.sql
        </button>
      </div>

      {/* SUBTAB 1: SQL QUERY RUNNER */}
      {activeSubTab === 'query' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500" /> Execute SQL Statement on D1
              </h3>

              {/* Sample Queries dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Quick Query:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) setSqlQuery(e.target.value);
                  }}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
                >
                  <option value="SELECT * FROM drivers;">SELECT * FROM drivers;</option>
                  <option value="SELECT * FROM riders;">SELECT * FROM riders;</option>
                  <option value="SELECT id, entityId, type, title, fileName FROM documents;">SELECT * FROM documents;</option>
                  <option value="SELECT city, COUNT(*) as driverCount FROM drivers GROUP BY city;">Drivers grouped by City</option>
                  <option value="SELECT status, COUNT(*) as count FROM drivers GROUP BY status;">Drivers grouped by Status</option>
                </select>
              </div>
            </div>

            {/* Editor Area */}
            <div className="relative">
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={4}
                className="w-full p-4 font-mono text-xs bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter SQL Query (e.g. SELECT * FROM drivers;)"
              />
              <button
                onClick={handleRunQuery}
                disabled={queryLoading || !sqlQuery.trim()}
                className="absolute right-3 bottom-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
              >
                {queryLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Run Query
                  </>
                )}
              </button>
            </div>

            {queryError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-mono">{queryError}</span>
              </div>
            )}
          </div>

          {/* Query Results Display */}
          {queryResult && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-emerald-500" /> Query Results
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-mono font-semibold">
                    {queryResult.results.length} rows returned
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Execution Duration: <span className="text-amber-400 font-bold">{queryResult.meta.durationMs} ms</span>
                </div>
              </div>

              {queryResult.results.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Query executed successfully. 0 rows returned.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[400px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono font-bold">
                        {Object.keys(queryResult.results[0]).map((col) => (
                          <th key={col} className="p-2.5 border-b border-slate-200 dark:border-slate-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                      {queryResult.results.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          {Object.entries(row).map(([k, v], cellIdx) => (
                            <td key={cellIdx} className="p-2.5 text-slate-800 dark:text-slate-200 max-w-xs truncate">
                              {typeof v === 'string' && v.startsWith('data:image')
                                ? '[Base64 Document Image]'
                                : String(v ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CLOUDFLARE CREDENTIALS CONFIG */}
      {activeSubTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" /> Cloudflare D1 Connection Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure Cloudflare REST API credentials to execute queries on a live Cloudflare D1 instance instead of local simulation mode.
            </p>
          </div>

          {configSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{configSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cloudflare Account ID
                </label>
                <input
                  type="text"
                  value={d1Config.accountId}
                  onChange={(e) => setD1Config({ ...d1Config, accountId: e.target.value })}
                  placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  D1 Database ID or Name
                </label>
                <input
                  type="text"
                  value={d1Config.databaseId}
                  onChange={(e) => setD1Config({ ...d1Config, databaseId: e.target.value })}
                  placeholder="noudb or nou"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cloudflare API Token
                </label>
                <input
                  type="password"
                  value={d1Config.apiToken}
                  onChange={(e) => setD1Config({ ...d1Config, apiToken: e.target.value })}
                  placeholder="v1.0-..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingConfig}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20"
              >
                {savingConfig ? 'Saving Settings...' : 'Save D1 Connection Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 3: QUERY AUDIT LOGS */}
      {activeSubTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Recent D1 Query Executions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="p-3">Time</th>
                  <th className="p-3">SQL Statement</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                {queryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400">
                      No query execution logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  queryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 text-slate-900 dark:text-slate-100 max-w-md truncate">{log.query}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-400">{log.executionTimeMs} ms</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SCHEMA EXPORTER */}
      {activeSubTab === 'schema' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-500" /> Cloudflare D1 schema.sql File
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Run this SQL script in Cloudflare CLI using <code className="text-amber-500 font-mono">wrangler d1 execute noudb --file=schema.sql</code>
              </p>
            </div>

            <button
              onClick={copySchemaToClipboard}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedSchema ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedSchema ? 'Copied!' : 'Copy SQL'}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">
            {schemaSqlCode}
          </pre>
        </div>
      )}
    </div>
  );
};
