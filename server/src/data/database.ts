import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

// Database file path - use environment variable or default
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'substation.db');
const SQL_SCHEMA_PATH = path.join(__dirname, 'substation_db.sql');

let db: Database<sqlite3.Database> | null = null;

/**
 * Initialize the database
 */
export const initDatabase = async (): Promise<void> => {
  try {
    // Create database directory if it doesn't exist
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Open database connection
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    logger.info('Database connection established');

    // Check if database needs to be initialized with schema
    const tableCount = await db.get('SELECT count(*) as count FROM sqlite_master WHERE type="table"');
    
    if (tableCount.count === 0) {
      logger.info('Initializing database with schema and sample data');
      
      // Read and execute SQL schema file
      const sqlSchema = fs.readFileSync(SQL_SCHEMA_PATH, 'utf-8');
      const statements = sqlSchema.split(';').filter(stmt => stmt.trim());
      
      // Execute each SQL statement
      for (const stmt of statements) {
        if (stmt.trim()) {
          await db.exec(stmt + ';');
        }
      }
      
      logger.info('Database initialized successfully');
    } else {
      logger.info('Database already initialized');
    }
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Get database instance
 */
export const getDatabase = (): Database<sqlite3.Database> => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
    logger.info('Database connection closed');
  }
};

// Query functions for substation operations data

/**
 * Get asset health for a specific asset
 */
export const getAssetHealth = async (assetId: string): Promise<any> => {
  try {
    return await db?.get(
      'SELECT * FROM AssetDiagnostics WHERE asset_id = ?',
      [assetId]
    );
  } catch (error) {
    logger.error(`Error getting health data for asset ${assetId}:`, error);
    throw error;
  }
};

/**
 * Get scheduled maintenance for a substation or asset
 */
export const getScheduledMaintenance = async (location: string): Promise<any[]> => {
  try {
    return await db?.all(
      'SELECT * FROM MaintenanceWorkOrders WHERE asset_name LIKE ? AND work_order_status = "Scheduled"',
      [`%${location}%`]
    ) || [];
  } catch (error) {
    logger.error(`Error getting scheduled maintenance for ${location}:`, error);
    throw error;
  }
};

/**
 * Get maintenance history for an asset
 */
export const getMaintenanceHistory = async (assetId: string, limit: number = 5): Promise<any[]> => {
  try {
    return await db?.all(
      'SELECT * FROM MaintenanceHistory WHERE asset_id = ? ORDER BY maintenance_date DESC LIMIT ?',
      [assetId, limit]
    ) || [];
  } catch (error) {
    logger.error(`Error getting maintenance history for asset ${assetId}:`, error);
    throw error;
  }
};

/**
 * Get inspection reports for an asset
 */
export const getInspectionReports = async (assetId: string, inspectionType?: string): Promise<any[]> => {
  try {
    let query = 'SELECT * FROM InspectionReports WHERE asset_id = ?';
    const params: any[] = [assetId];
    
    if (inspectionType) {
      query += ' AND inspection_type = ?';
      params.push(inspectionType);
    }
    
    query += ' ORDER BY report_date DESC';
    
    return await db?.all(query, params) || [];
  } catch (error) {
    logger.error(`Error getting inspection reports for asset ${assetId}:`, error);
    throw error;
  }
};

/**
 * Get real-time data for a substation
 */
export const getRealTimeData = async (substationId: string): Promise<any[]> => {
  try {
    return await db?.all(
      'SELECT * FROM RealTimeData WHERE substation_id = ? ORDER BY measurement_time DESC',
      [substationId]
    ) || [];
  } catch (error) {
    logger.error(`Error getting real-time data for substation ${substationId}:`, error);
    throw error;
  }
};

/**
 * Get safety guidelines for a procedure
 */
export const getSafetyGuidelines = async (procedureName: string): Promise<any> => {
  try {
    return await db?.get(
      'SELECT * FROM SafetyGuidelines WHERE procedure_name LIKE ?',
      [`%${procedureName}%`]
    );
  } catch (error) {
    logger.error(`Error getting safety guidelines for ${procedureName}:`, error);
    throw error;
  }
};

/**
 * Get spare parts for an asset
 */
export const getSparePartsForAsset = async (assetId: string): Promise<any[]> => {
  try {
    return await db?.all(
      'SELECT * FROM Inventory WHERE asset_id = ?',
      [assetId]
    ) || [];
  } catch (error) {
    logger.error(`Error getting spare parts for asset ${assetId}:`, error);
    throw error;
  }
};

/**
 * Search by keyword across all tables
 */
export const searchByKeyword = async (keyword: string): Promise<any> => {
  const results: any = {};
  
  try {
    // Search in AssetDiagnostics
    results.assetDiagnostics = await db?.all(
      `SELECT * FROM AssetDiagnostics 
       WHERE asset_id LIKE ? OR asset_name LIKE ? OR diagnostic_summary LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    ) || [];
    
    // Search in MaintenanceWorkOrders
    results.maintenanceOrders = await db?.all(
      `SELECT * FROM MaintenanceWorkOrders 
       WHERE asset_id LIKE ? OR asset_name LIKE ? OR maintenance_details LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    ) || [];
    
    // Search in InspectionReports
    results.inspectionReports = await db?.all(
      `SELECT * FROM InspectionReports 
       WHERE asset_id LIKE ? OR asset_name LIKE ? OR report_summary LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    ) || [];
    
    // Search in PredictiveMaintenance
    results.predictiveMaintenance = await db?.all(
      `SELECT * FROM PredictiveMaintenance 
       WHERE asset_id LIKE ? OR asset_name LIKE ? OR recommendation_details LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    ) || [];
    
    // Search in Inventory
    results.inventory = await db?.all(
      `SELECT * FROM Inventory 
       WHERE asset_id LIKE ? OR asset_name LIKE ? OR part_name LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    ) || [];
    
    return results;
  } catch (error) {
    logger.error(`Error searching for keyword ${keyword}:`, error);
    throw error;
  }
};

export default {
  initDatabase,
  getDatabase,
  closeDatabase,
  getAssetHealth,
  getScheduledMaintenance,
  getMaintenanceHistory,
  getInspectionReports,
  getRealTimeData,
  getSafetyGuidelines,
  getSparePartsForAsset,
  searchByKeyword
}; 