import database from '../data/database';
import { logger } from '../utils/logger';

/**
 * NLP Service for analyzing user queries related to PG&E Substation Operations
 */
class NLPService {
  /**
   * Process a natural language query and return relevant data
   */
  async processQuery(query: string): Promise<any> {
    try {
      logger.info(`Processing query: ${query}`);
      
      // Extract entities and intents from the query
      const { intent, entities } = this.extractEntitiesAndIntent(query);
      
      logger.info(`Extracted intent: ${intent}, entities:`, entities);
      
      // Based on intent and entities, fetch appropriate data
      const result = await this.fetchDataBasedOnIntent(intent, entities);
      
      return {
        query,
        intent,
        entities,
        result
      };
    } catch (error) {
      logger.error('Error processing NLP query:', error);
      throw error;
    }
  }

  /**
   * Extract entities and intents from a natural language query
   * This is a simple implementation and could be replaced with a more sophisticated NLP solution
   */
  private extractEntitiesAndIntent(query: string): { intent: string; entities: any } {
    // Normalize query
    const normalizedQuery = query.toLowerCase();
    
    // Default values
    let intent = 'unknown';
    const entities: any = {};

    // Check for asset health and diagnostics
    if (normalizedQuery.includes('health') || normalizedQuery.includes('status') || normalizedQuery.includes('condition')) {
      intent = 'assetHealth';
      
      // Extract asset ID
      const assetMatch = normalizedQuery.match(/(?:transformer|breaker|asset|equipment)\s*([a-z]-\d+|\w+-\d+)/i);
      if (assetMatch) {
        entities.assetId = assetMatch[1];
      }
    }
    
    // Check for maintenance and work orders
    else if (normalizedQuery.includes('maintenance') || normalizedQuery.includes('work order') || normalizedQuery.includes('scheduled')) {
      if (normalizedQuery.includes('history') || normalizedQuery.includes('past') || normalizedQuery.includes('previous')) {
        intent = 'maintenanceHistory';
        
        // Extract asset ID
        const assetMatch = normalizedQuery.match(/(?:transformer|breaker|asset|equipment)\s*([a-z]-\d+|\w+-\d+)/i);
        if (assetMatch) {
          entities.assetId = assetMatch[1];
        }
        
        // Extract limit
        const limitMatch = normalizedQuery.match(/(?:last|past|recent)\s*(\d+)/i);
        if (limitMatch) {
          entities.limit = parseInt(limitMatch[1]);
        }
      } else {
        intent = 'scheduledMaintenance';
        
        // Extract location or asset
        const locationMatch = normalizedQuery.match(/(?:for|at|in)\s+([a-z]-\d+|[a-zA-Z\s]+(?:substation|facility|location))/i);
        if (locationMatch) {
          entities.location = locationMatch[1];
        }
      }
    }
    
    // Check for inspection reports
    else if (normalizedQuery.includes('inspection') || normalizedQuery.includes('report')) {
      intent = 'inspectionReports';
      
      // Extract asset ID
      const assetMatch = normalizedQuery.match(/(?:transformer|breaker|asset|equipment)\s*([a-z]-\d+|\w+-\d+)/i);
      if (assetMatch) {
        entities.assetId = assetMatch[1];
      }
      
      // Extract inspection type
      if (normalizedQuery.includes('infrared')) {
        entities.inspectionType = 'Infrared';
      } else if (normalizedQuery.includes('visual')) {
        entities.inspectionType = 'Visual';
      } else if (normalizedQuery.includes('ultrasonic')) {
        entities.inspectionType = 'Ultrasonic';
      } else if (normalizedQuery.includes('oil')) {
        entities.inspectionType = 'Oil Analysis';
      }
    }
    
    // Check for real-time data
    else if (normalizedQuery.includes('real-time') || normalizedQuery.includes('current') || 
             normalizedQuery.includes('load') || normalizedQuery.includes('temperature') || 
             normalizedQuery.includes('voltage')) {
      intent = 'realTimeData';
      
      // Extract substation ID
      const substationMatch = normalizedQuery.match(/(?:substation|station)\s*([a-z]-\d+|\w+-\d+)/i);
      if (substationMatch) {
        entities.substationId = substationMatch[1];
      }
    }
    
    // Check for safety guidelines
    else if (normalizedQuery.includes('safety') || normalizedQuery.includes('ppe') || 
             normalizedQuery.includes('procedure') || normalizedQuery.includes('protocol')) {
      intent = 'safetyGuidelines';
      
      // Extract procedure
      if (normalizedQuery.includes('live-line')) {
        entities.procedure = 'Live-Line Maintenance';
      } else if (normalizedQuery.includes('breaker racking')) {
        entities.procedure = 'Breaker Racking';
      } else if (normalizedQuery.includes('high voltage')) {
        entities.procedure = 'High Voltage Inspections';
      }
    }
    
    // Check for spare parts
    else if (normalizedQuery.includes('spare') || normalizedQuery.includes('part') || 
             normalizedQuery.includes('inventory') || normalizedQuery.includes('available')) {
      intent = 'spareParts';
      
      // Extract asset ID
      const assetMatch = normalizedQuery.match(/(?:transformer|breaker|asset|equipment)\s*([a-z]-\d+|\w+-\d+)/i);
      if (assetMatch) {
        entities.assetId = assetMatch[1];
      }
    }
    
    // If no specific intent was detected, treat as a general search
    else {
      intent = 'generalSearch';
      
      // Extract keywords - simple approach, just take the main nouns
      const keywords = normalizedQuery.match(/\b(transformer|breaker|substation|maintenance|inspection|safety|part|temperature|voltage|load)\b/gi);
      if (keywords && keywords.length > 0) {
        entities.keywords = keywords.join(' ');
      } else {
        // If no specific keywords, use the entire query
        entities.keywords = normalizedQuery;
      }
    }
    
    return { intent, entities };
  }

  /**
   * Fetch data from the database based on the identified intent and entities
   */
  private async fetchDataBasedOnIntent(intent: string, entities: any): Promise<any> {
    switch (intent) {
      case 'assetHealth':
        if (entities.assetId) {
          return await database.getAssetHealth(entities.assetId);
        }
        break;
        
      case 'scheduledMaintenance':
        if (entities.location) {
          return await database.getScheduledMaintenance(entities.location);
        }
        break;
        
      case 'maintenanceHistory':
        if (entities.assetId) {
          const limit = entities.limit || 5;
          return await database.getMaintenanceHistory(entities.assetId, limit);
        }
        break;
        
      case 'inspectionReports':
        if (entities.assetId) {
          return await database.getInspectionReports(entities.assetId, entities.inspectionType);
        }
        break;
        
      case 'realTimeData':
        if (entities.substationId) {
          return await database.getRealTimeData(entities.substationId);
        }
        break;
        
      case 'safetyGuidelines':
        if (entities.procedure) {
          return await database.getSafetyGuidelines(entities.procedure);
        }
        break;
        
      case 'spareParts':
        if (entities.assetId) {
          return await database.getSparePartsForAsset(entities.assetId);
        }
        break;
        
      case 'generalSearch':
        if (entities.keywords) {
          return await database.searchByKeyword(entities.keywords);
        }
        break;
        
      default:
        // For unknown intents, perform a general search
        if (entities.keywords) {
          return await database.searchByKeyword(entities.keywords);
        }
        break;
    }
    
    return { message: 'No relevant data found for this query' };
  }

  /**
   * Generate a natural language response based on the query results
   */
  generateResponse(queryResults: any): string {
    const { intent, result } = queryResults;
    
    // If no results found, return a friendly message
    if (!result || (Array.isArray(result) && result.length === 0) || 
        (typeof result === 'object' && Object.keys(result).length === 0)) {
      return "I couldn't find any information related to your query. Could you please provide more details or try a different question?";
    }
    
    switch (intent) {
      case 'assetHealth':
        return `The current health score for ${result.asset_name} is ${result.health_score}. Last diagnostic was performed on ${new Date(result.last_diagnostic_date).toLocaleDateString()}. ${result.diagnostic_summary}`;
        
      case 'scheduledMaintenance':
        if (Array.isArray(result) && result.length > 0) {
          const maintenanceList = result.map((item: any) => 
            `${item.asset_name}: ${item.maintenance_details} scheduled for ${new Date(item.scheduled_date).toLocaleDateString()}`
          ).join('\n');
          return `Here are the scheduled maintenance activities:\n${maintenanceList}`;
        } else {
          return "No scheduled maintenance found for this location.";
        }
        
      case 'maintenanceHistory':
        if (Array.isArray(result) && result.length > 0) {
          const historyList = result.map((item: any) => 
            `${new Date(item.maintenance_date).toLocaleDateString()}: ${item.maintenance_log}`
          ).join('\n');
          return `Here are the past maintenance records:\n${historyList}`;
        } else {
          return "No maintenance history found for this asset.";
        }
        
      case 'inspectionReports':
        if (Array.isArray(result) && result.length > 0) {
          const reportsList = result.map((item: any) => 
            `${item.inspection_type} inspection on ${new Date(item.report_date).toLocaleDateString()} by ${item.inspector_name}: ${item.report_summary}`
          ).join('\n');
          return `Here are the inspection reports:\n${reportsList}`;
        } else {
          return "No inspection reports found for this asset.";
        }
        
      case 'realTimeData':
        if (Array.isArray(result) && result.length > 0) {
          const dataList = result.map((item: any) => 
            `${item.sensor_type}: ${item.value} ${item.sensor_type === 'Load' ? '%' : item.sensor_type === 'Voltage' ? 'kV' : '°F'}`
          ).join('\n');
          return `Here is the current status of the substation:\n${dataList}\nLast updated: ${new Date(result[0].measurement_time).toLocaleString()}`;
        } else {
          return "No real-time data available for this substation.";
        }
        
      case 'safetyGuidelines':
        if (result) {
          return `Safety guidelines for ${result.procedure_name}:\nRequired PPE: ${result.required_PPE}\nInstructions: ${result.safety_instructions}\nCompliance notes: ${result.compliance_notes}`;
        } else {
          return "No safety guidelines found for this procedure.";
        }
        
      case 'spareParts':
        if (Array.isArray(result) && result.length > 0) {
          const partsList = result.map((item: any) => 
            `${item.part_name}: ${item.available_quantity} units available (${item.order_status}) at ${item.location}`
          ).join('\n');
          return `Here are the spare parts available:\n${partsList}`;
        } else {
          return "No spare parts information found for this asset.";
        }
        
      case 'generalSearch':
        // For general search, we need to summarize results from multiple tables
        let response = "Here's what I found:\n";
        let foundResults = false;
        
        if (result.assetDiagnostics && result.assetDiagnostics.length > 0) {
          foundResults = true;
          response += `\nAsset Diagnostics: ${result.assetDiagnostics.length} results found`;
        }
        
        if (result.maintenanceOrders && result.maintenanceOrders.length > 0) {
          foundResults = true;
          response += `\nMaintenance Work Orders: ${result.maintenanceOrders.length} results found`;
        }
        
        if (result.inspectionReports && result.inspectionReports.length > 0) {
          foundResults = true;
          response += `\nInspection Reports: ${result.inspectionReports.length} results found`;
        }
        
        if (result.predictiveMaintenance && result.predictiveMaintenance.length > 0) {
          foundResults = true;
          response += `\nPredictive Maintenance Recommendations: ${result.predictiveMaintenance.length} results found`;
        }
        
        if (result.inventory && result.inventory.length > 0) {
          foundResults = true;
          response += `\nInventory Items: ${result.inventory.length} results found`;
        }
        
        if (!foundResults) {
          response = "I couldn't find any specific information related to your query.";
        }
        
        return response;
        
      default:
        return "I found some information that might be relevant to your query, but I'm not sure how to interpret it. Please try being more specific.";
    }
  }
}

// Export an instance of the NLP service
const nlpServiceInstance = new NLPService();
export default nlpServiceInstance; 