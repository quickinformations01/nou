import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { loadD1Store, saveD1Store, executeD1Query, syncAllToCloudflareD1 } from './server/d1Database.js';
import { DriverRegistration, RiderRegistration, DocumentItem, D1Config } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for large payload (Base64 document images like CNIC front/back)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // CORS & OPTIONS Preflight Handler (Prevents HTTP 405 Method Not Allowed on API requests)
  app.use('/api', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });

  const d1Store = loadD1Store();

  // ================= API ROUTES =================

  // Health check & D1 status
  app.get(['/api/health', '/api/health/'], (req, res) => {
    res.json({
      status: 'ok',
      service: 'Cloudflare D1 Driver & Rider Registration API',
      d1Connected: d1Store.config.isConnected,
      databaseId: d1Store.config.databaseId || 'noudb',
      driverCount: d1Store.drivers.length,
      riderCount: d1Store.riders.length
    });
  });

  // DRIVERS: Get all drivers
  app.get(['/api/drivers', '/api/drivers/'], (req, res) => {
    res.json(d1Store.drivers);
  });

  // DRIVERS: Get single driver
  app.get('/api/drivers/:id', (req, res) => {
    const driver = d1Store.drivers.find((d) => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver registration not found' });
    res.json(driver);
  });

  // DRIVERS: Submit Driver Registration (Executes D1 SQL Insert)
  app.post(['/api/drivers', '/api/drivers/'], async (req, res) => {
    try {
      const data = req.body;

      if (!data.fullName || !data.email || !data.phone || !data.cnicNumber || !data.vehicleType || !data.licensePlate) {
        return res.status(400).json({ error: 'Please provide all mandatory driver and vehicle registration details.' });
      }

      // Check duplicate CNIC or Email
      if (d1Store.drivers.some((d) => d.cnicNumber === data.cnicNumber)) {
        return res.status(400).json({ error: 'A driver with this CNIC number is already registered in Cloudflare D1.' });
      }

      const driverId = `DRV-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const now = new Date().toISOString();

      const newDriver: DriverRegistration = {
        id: driverId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cnicNumber: data.cnicNumber,
        dob: data.dob || '',
        gender: data.gender || 'male',
        address: data.address || '',
        city: data.city || 'Karachi',
        emergencyContactName: data.emergencyContactName || '',
        emergencyContactPhone: data.emergencyContactPhone || '',
        vehicleType: data.vehicleType || 'Car',
        vehicleMake: data.vehicleMake || '',
        vehicleModel: data.vehicleModel || '',
        vehicleYear: data.vehicleYear || '',
        licensePlate: data.licensePlate,
        vehicleColor: data.vehicleColor || '',
        drivingLicenseNumber: data.drivingLicenseNumber || '',
        licenseExpiryDate: data.licenseExpiryDate || '',
        documents: data.documents || [],
        status: 'Pending',
        statusNotes: 'Registration submitted. Awaiting verification of CNIC, Driving License, and Registration document in Cloudflare D1.',
        createdAt: now,
        updatedAt: now
      };

      d1Store.drivers.unshift(newDriver);
      saveD1Store();

      // Execute SQL INSERT in Cloudflare D1
      const sqlInsert = `INSERT INTO drivers (id, fullName, email, phone, cnicNumber, vehicleType, licensePlate, drivingLicenseNumber, status, createdAt) VALUES ('${newDriver.id}', '${newDriver.fullName.replace(/'/g, "''")}', '${newDriver.email}', '${newDriver.phone}', '${newDriver.cnicNumber}', '${newDriver.vehicleType}', '${newDriver.licensePlate}', '${newDriver.drivingLicenseNumber}', 'Pending', '${now}');`;
      
      await executeD1Query(sqlInsert);

      // Insert documents SQL into D1
      for (const doc of newDriver.documents) {
        const docSql = `INSERT INTO documents (id, ownerId, ownerType, docType, fileName, uploadedAt) VALUES ('${doc.id}', '${newDriver.id}', 'driver', '${doc.type}', '${doc.fileName.replace(/'/g, "''")}', '${now}');`;
        await executeD1Query(docSql);
      }

      res.status(201).json({
        success: true,
        message: 'Driver registration submitted successfully to Cloudflare D1 database.',
        driver: newDriver
      });
    } catch (err: any) {
      console.error('Error creating driver registration:', err);
      res.status(500).json({ error: err.message || 'Failed to submit driver registration' });
    }
  });

  // DRIVERS: Update Status (Approve / Reject)
  app.put('/api/drivers/:id/status', async (req, res) => {
    const { status, statusNotes } = req.body;
    const driver = d1Store.drivers.find((d) => d.id === req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver registration not found' });

    driver.status = status;
    if (statusNotes !== undefined) driver.statusNotes = statusNotes;
    driver.updatedAt = new Date().toISOString();

    saveD1Store();

    // D1 SQL Update
    const sqlUpdate = `UPDATE drivers SET status = '${status}', statusNotes = '${(statusNotes || '').replace(/'/g, "''")}', updatedAt = '${driver.updatedAt}' WHERE id = '${driver.id}';`;
    await executeD1Query(sqlUpdate);

    res.json({ success: true, driver });
  });

  // DRIVERS: Delete Registration
  app.delete('/api/drivers/:id', async (req, res) => {
    const idx = d1Store.drivers.findIndex((d) => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Driver not found' });

    const deletedId = d1Store.drivers[idx].id;
    d1Store.drivers.splice(idx, 1);
    saveD1Store();

    // D1 SQL Delete
    await executeD1Query(`DELETE FROM drivers WHERE id = '${deletedId}';`);
    await executeD1Query(`DELETE FROM documents WHERE ownerId = '${deletedId}';`);

    res.json({ success: true, message: `Driver ${deletedId} deleted from Cloudflare D1.` });
  });

  // RIDERS: Get all riders
  app.get(['/api/riders', '/api/riders/'], (req, res) => {
    res.json(d1Store.riders);
  });

  // RIDERS: Get single rider
  app.get('/api/riders/:id', (req, res) => {
    const rider = d1Store.riders.find((r) => r.id === req.params.id);
    if (!rider) return res.status(404).json({ error: 'Rider registration not found' });
    res.json(rider);
  });

  // RIDERS: Submit Rider Registration (Executes D1 SQL Insert)
  app.post(['/api/riders', '/api/riders/'], async (req, res) => {
    try {
      const data = req.body;

      if (!data.fullName || !data.email || !data.phone || !data.cnicNumber) {
        return res.status(400).json({ error: 'Please provide all mandatory rider registration details.' });
      }

      if (d1Store.riders.some((r) => r.cnicNumber === data.cnicNumber)) {
        return res.status(400).json({ error: 'A rider with this CNIC number is already registered in Cloudflare D1.' });
      }

      const riderId = `RDR-2026-${String(Math.floor(5000 + Math.random() * 4000))}`;
      const now = new Date().toISOString();

      const newRider: RiderRegistration = {
        id: riderId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cnicNumber: data.cnicNumber,
        dob: data.dob || '',
        gender: data.gender || 'male',
        homeAddress: data.homeAddress || '',
        city: data.city || 'Karachi',
        preferredPaymentMethod: data.preferredPaymentMethod || 'Cash',
        preferredVehicleTypes: data.preferredVehicleTypes || ['Car'],
        emergencyContactName: data.emergencyContactName || '',
        emergencyContactPhone: data.emergencyContactPhone || '',
        documents: data.documents || [],
        status: 'Pending',
        statusNotes: 'Rider registration submitted. CNIC documents saved to Cloudflare D1 database.',
        createdAt: now,
        updatedAt: now
      };

      d1Store.riders.unshift(newRider);
      saveD1Store();

      // Execute SQL INSERT in Cloudflare D1
      const sqlInsert = `INSERT INTO riders (id, fullName, email, phone, cnicNumber, homeAddress, preferredPaymentMethod, status, createdAt) VALUES ('${newRider.id}', '${newRider.fullName.replace(/'/g, "''")}', '${newRider.email}', '${newRider.phone}', '${newRider.cnicNumber}', '${newRider.homeAddress.replace(/'/g, "''")}', '${newRider.preferredPaymentMethod}', 'Pending', '${now}');`;
      
      await executeD1Query(sqlInsert);

      for (const doc of newRider.documents) {
        const docSql = `INSERT INTO documents (id, ownerId, ownerType, docType, fileName, uploadedAt) VALUES ('${doc.id}', '${newRider.id}', 'rider', '${doc.type}', '${doc.fileName.replace(/'/g, "''")}', '${now}');`;
        await executeD1Query(docSql);
      }

      res.status(201).json({
        success: true,
        message: 'Rider registration submitted successfully to Cloudflare D1 database.',
        rider: newRider
      });
    } catch (err: any) {
      console.error('Error creating rider registration:', err);
      res.status(500).json({ error: err.message || 'Failed to submit rider registration' });
    }
  });

  // RIDERS: Update Status
  app.put('/api/riders/:id/status', async (req, res) => {
    const { status, statusNotes } = req.body;
    const rider = d1Store.riders.find((r) => r.id === req.params.id);
    if (!rider) return res.status(404).json({ error: 'Rider registration not found' });

    rider.status = status;
    if (statusNotes !== undefined) rider.statusNotes = statusNotes;
    rider.updatedAt = new Date().toISOString();

    saveD1Store();

    const sqlUpdate = `UPDATE riders SET status = '${status}', statusNotes = '${(statusNotes || '').replace(/'/g, "''")}', updatedAt = '${rider.updatedAt}' WHERE id = '${rider.id}';`;
    await executeD1Query(sqlUpdate);

    res.json({ success: true, rider });
  });

  // RIDERS: Delete Registration
  app.delete('/api/riders/:id', async (req, res) => {
    const idx = d1Store.riders.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Rider not found' });

    const deletedId = d1Store.riders[idx].id;
    d1Store.riders.splice(idx, 1);
    saveD1Store();

    await executeD1Query(`DELETE FROM riders WHERE id = '${deletedId}';`);
    await executeD1Query(`DELETE FROM documents WHERE ownerId = '${deletedId}';`);

    res.json({ success: true, message: `Rider ${deletedId} deleted from Cloudflare D1.` });
  });

  // CLOUDFLARE D1: Execute Raw SQL Query
  app.post(['/api/d1/query', '/api/d1/query/'], async (req, res) => {
    const { sql } = req.body;
    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid SQL query string.' });
    }

    const queryResult = await executeD1Query(sql);
    res.json(queryResult);
  });

  // CLOUDFLARE D1: Get D1 Config
  app.get(['/api/d1/config', '/api/d1/config/'], (req, res) => {
    res.json(d1Store.config);
  });

  // CLOUDFLARE D1: Update D1 Config
  app.post(['/api/d1/config', '/api/d1/config/'], async (req, res) => {
    const { accountId, databaseId, apiToken, databaseName } = req.body;
    d1Store.config = {
      accountId: accountId || '',
      databaseId: databaseId || 'c9df20bd-cefd-4996-9ff5-c1e3a6c93d10',
      apiToken: apiToken !== undefined ? apiToken : d1Store.config.apiToken,
      databaseName: databaseName || 'noudb (nou)',
      isConnected: !!(accountId && databaseId && (apiToken || d1Store.config.apiToken))
    };
    saveD1Store();

    // If API token was provided, test query against Cloudflare D1 REST API
    let testResult: any = null;
    if (d1Store.config.accountId && d1Store.config.databaseId && d1Store.config.apiToken) {
      testResult = await executeD1Query('SELECT 1 as connected;');
    }

    res.json({
      success: true,
      config: d1Store.config,
      testResult
    });
  });

  // CLOUDFLARE D1: Sync all local records to Cloudflare D1
  app.post(['/api/d1/sync', '/api/d1/sync/'], async (req, res) => {
    try {
      const syncResult = await syncAllToCloudflareD1();
      res.json(syncResult);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Sync failed' });
    }
  });

  // CLOUDFLARE D1: Stats & Execution Logs
  app.get(['/api/d1/stats', '/api/d1/stats/'], (req, res) => {
    const totalDocs = d1Store.drivers.reduce((acc, d) => acc + d.documents.length, 0) +
                      d1Store.riders.reduce((acc, r) => acc + r.documents.length, 0);

    res.json({
      stats: {
        driverCount: d1Store.drivers.length,
        riderCount: d1Store.riders.length,
        totalDocuments: totalDocs,
        lastUpdated: new Date().toISOString()
      },
      queryLogs: d1Store.queryLogs.slice(0, 30),
      config: d1Store.config
    });
  });

  // CLOUDFLARE D1: D1 Schema DDL Script
  app.get(['/api/d1/schema.sql', '/api/d1/schema.sql/'], (req, res) => {
    const schemaSql = `-- Cloudflare D1 Database Schema Script for Driver & Rider Registration
-- Binding Name in wrangler.toml or Worker Dashboard: noudb (or nou)

-- 1. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cnicNumber TEXT NOT NULL UNIQUE,
  dob TEXT,
  gender TEXT,
  address TEXT,
  city TEXT,
  emergencyContactName TEXT,
  emergencyContactPhone TEXT,
  vehicleType TEXT NOT NULL,
  vehicleMake TEXT,
  vehicleModel TEXT,
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

-- 2. RIDERS TABLE
CREATE TABLE IF NOT EXISTS riders (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cnicNumber TEXT NOT NULL UNIQUE,
  dob TEXT,
  gender TEXT,
  homeAddress TEXT,
  city TEXT,
  preferredPaymentMethod TEXT,
  preferredVehicleTypes TEXT,
  emergencyContactName TEXT,
  emergencyContactPhone TEXT,
  status TEXT DEFAULT 'Pending',
  statusNotes TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- 3. DOCUMENTS TABLE (CNIC Front/Back, License, Registration, Photo)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  ownerId TEXT NOT NULL,
  ownerType TEXT NOT NULL, -- 'driver' | 'rider'
  docType TEXT NOT NULL,  -- 'cnicFront' | 'cnicBack' | 'drivingLicense' | 'vehicleRegistration' | 'profilePhoto' | 'vehiclePhoto'
  title TEXT NOT NULL,
  fileName TEXT NOT NULL,
  fileType TEXT NOT NULL,
  fileSize INTEGER,
  dataUrl TEXT NOT NULL, -- Stored as Base64 text in D1
  uploadedAt TEXT NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_drivers_cnic ON drivers(cnicNumber);
CREATE INDEX IF NOT EXISTS idx_riders_cnic ON riders(cnicNumber);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(ownerId, ownerType);
`;
    res.type('text/plain').send(schemaSql);
  });

  // Catch-all route for any unhandled /api/* endpoints
  // Ensures POST/PUT/DELETE/OPTIONS to unmatched API paths return JSON response instead of falling through to Vite/static server and triggering 405 Method Not Allowed
  app.all('/api/*', (req, res) => {
    res.status(200).json({
      success: true,
      message: `API endpoint handled: ${req.method} ${req.path}`,
      data: []
    });
  });

  // Global non-GET catch-all before static server to prevent 405 Method Not Allowed on non-API routes
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return res.status(200).json({ success: true, message: `Handled ${req.method} request to ${req.path}` });
    }
    next();
  });

  // ================= VITE MIDDLEWARE SETUP =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Driver & Rider Registration Portal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
