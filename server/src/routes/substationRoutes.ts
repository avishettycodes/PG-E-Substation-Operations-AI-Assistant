import express, { Request, Response } from 'express';
import database from '../data/database';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * Get asset health data
 * GET /api/substation/asset/:assetId/health
 */
router.get('/asset/:assetId/health', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    logger.info(`Getting health data for asset: ${assetId}`);
    
    const healthData = await database.getAssetHealth(assetId);
    
    if (!healthData) {
      return res.status(404).json({ message: `No health data found for asset: ${assetId}` });
    }
    
    return res.json(healthData);
  } catch (error) {
    logger.error('Error retrieving asset health data:', error);
    return res.status(500).json({ message: 'Error retrieving asset health data', error });
  }
});

/**
 * Get scheduled maintenance
 * GET /api/substation/maintenance/scheduled/:location
 */
router.get('/maintenance/scheduled/:location', async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    logger.info(`Getting scheduled maintenance for: ${location}`);
    
    const scheduledMaintenance = await database.getScheduledMaintenance(location);
    
    return res.json(scheduledMaintenance);
  } catch (error) {
    logger.error('Error retrieving scheduled maintenance:', error);
    return res.status(500).json({ message: 'Error retrieving scheduled maintenance', error });
  }
});

/**
 * Get maintenance history for an asset
 * GET /api/substation/asset/:assetId/maintenance-history
 */
router.get('/asset/:assetId/maintenance-history', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    
    logger.info(`Getting maintenance history for asset: ${assetId}, limit: ${limit}`);
    
    const maintenanceHistory = await database.getMaintenanceHistory(assetId, limit);
    
    return res.json(maintenanceHistory);
  } catch (error) {
    logger.error('Error retrieving maintenance history:', error);
    return res.status(500).json({ message: 'Error retrieving maintenance history', error });
  }
});

/**
 * Get inspection reports for an asset
 * GET /api/substation/asset/:assetId/inspection-reports
 */
router.get('/asset/:assetId/inspection-reports', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    const { type } = req.query;
    
    logger.info(`Getting inspection reports for asset: ${assetId}, type: ${type || 'all'}`);
    
    const inspectionReports = await database.getInspectionReports(assetId, type as string);
    
    return res.json(inspectionReports);
  } catch (error) {
    logger.error('Error retrieving inspection reports:', error);
    return res.status(500).json({ message: 'Error retrieving inspection reports', error });
  }
});

/**
 * Get real-time data for a substation
 * GET /api/substation/:substationId/real-time-data
 */
router.get('/:substationId/real-time-data', async (req: Request, res: Response) => {
  try {
    const { substationId } = req.params;
    logger.info(`Getting real-time data for substation: ${substationId}`);
    
    const realTimeData = await database.getRealTimeData(substationId);
    
    return res.json(realTimeData);
  } catch (error) {
    logger.error('Error retrieving real-time data:', error);
    return res.status(500).json({ message: 'Error retrieving real-time data', error });
  }
});

/**
 * Get safety guidelines for a procedure
 * GET /api/substation/safety/:procedure
 */
router.get('/safety/:procedure', async (req: Request, res: Response) => {
  try {
    const { procedure } = req.params;
    logger.info(`Getting safety guidelines for procedure: ${procedure}`);
    
    const safetyGuidelines = await database.getSafetyGuidelines(procedure);
    
    if (!safetyGuidelines) {
      return res.status(404).json({ message: `No safety guidelines found for procedure: ${procedure}` });
    }
    
    return res.json(safetyGuidelines);
  } catch (error) {
    logger.error('Error retrieving safety guidelines:', error);
    return res.status(500).json({ message: 'Error retrieving safety guidelines', error });
  }
});

/**
 * Get spare parts for an asset
 * GET /api/substation/asset/:assetId/spare-parts
 */
router.get('/asset/:assetId/spare-parts', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    logger.info(`Getting spare parts for asset: ${assetId}`);
    
    const spareParts = await database.getSparePartsForAsset(assetId);
    
    return res.json(spareParts);
  } catch (error) {
    logger.error('Error retrieving spare parts:', error);
    return res.status(500).json({ message: 'Error retrieving spare parts', error });
  }
});

/**
 * Search across all substation data
 * GET /api/substation/search?keyword=...
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ message: 'Keyword parameter is required' });
    }
    
    logger.info(`Searching for keyword: ${keyword}`);
    
    const searchResults = await database.searchByKeyword(keyword);
    
    return res.json(searchResults);
  } catch (error) {
    logger.error('Error performing search:', error);
    return res.status(500).json({ message: 'Error performing search', error });
  }
});

export default router; 