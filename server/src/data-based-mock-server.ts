import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4477;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory if it exists
const publicDir = path.join(__dirname, '../../public');
if (fs.existsSync(publicDir)) {
  console.log(`Serving static files from: ${publicDir}`);
  app.use(express.static(publicDir));
  
  // For SPAs, serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api/') || req.url === '/health') {
      return next();
    }
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  console.log(`Public directory not found at: ${publicDir}`);
}

// Define database interface
interface Database {
  AssetDiagnostics: Array<{
    diagnostic_id: number;
    asset_id: string;
    asset_name: string;
    health_score: number;
    last_diagnostic_date: string;
    diagnostic_summary: string;
    data_source: string;
  }>;
  MaintenanceWorkOrders: Array<{
    work_order_id: number;
    asset_id: string;
    asset_name: string;
    scheduled_date: string;
    maintenance_details: string;
    work_order_status: string;
    work_order_type?: string;
    assigned_to?: string;
  }>;
  MaintenanceHistory: Array<{
    work_order_id: number;
    asset_id: string;
    asset_name: string;
    maintenance_date: string;
    maintenance_type?: string;
    maintenance_log: string;
    performed_by?: string;
  }>;
  InspectionReports: Array<{
    inspection_id: number;
    asset_id: string;
    asset_name: string;
    inspection_type: string;
    report_date: string;
    inspector_name: string;
    report_summary: string;
  }>;
  PredictiveMaintenance: Array<{
    recommendation_id: number;
    asset_id: string;
    asset_name: string;
    prediction_date: string;
    risk_level: string;
    recommendation_details: string;
    sensor_data_summary: string;
  }>;
  RealTimeData: Array<{
    measurement_id: number;
    substation_id: string;
    sensor_type: string;
    value: number;
    measurement_time: string;
    unit?: string;
    status?: string;
  }>;
  SafetyGuidelines: Array<{
    guideline_id: number;
    procedure_name: string;
    required_PPE: string;
    safety_instructions: string;
    compliance_notes: string;
    last_updated?: string;
  }>;
  TrainingMaterials: Array<{
    material_id: number;
    topic: string;
    content: string;
    certification_required: boolean;
    reference_manual: string;
    url: string;
  }>;
  IncidentReports: Array<{
    incident_id: number;
    asset_id: string;
    asset_name: string;
    incident_date: string;
    failure_type: string;
    description: string;
    potential_causes: string;
    logged_by?: string;
    category?: string;
  }>;
  Inventory: Array<{
    inventory_id: number;
    asset_id: string;
    asset_name: string;
    part_name: string;
    available_quantity: number;
    location: string;
    order_status: string;
  }>;
  Geofencing: Array<{
    geofence_id: number;
    asset_id: string;
    asset_name: string;
    location: string;
    allowed_radius: number;
    current_employee_location: string;
    in_geofence: boolean;
    remote_assistance_instructions: string;
  }>;
}

// Initialize database with sample data
const database: Database = {
  AssetDiagnostics: [
    {
      diagnostic_id: 1,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      health_score: 92.50,
      last_diagnostic_date: '2025-04-05 08:30:00',
      diagnostic_summary: 'No issues detected. Operating within normal parameters.',
      data_source: 'Bentley APM'
    },
    {
      diagnostic_id: 2,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      health_score: 85.00,
      last_diagnostic_date: '2025-04-04 14:20:00',
      diagnostic_summary: 'Minor degradation detected in switch contacts.',
      data_source: 'PI'
    },
    {
      diagnostic_id: 3,
      asset_id: 'T-789',
      asset_name: 'Transformer T-789',
      health_score: 78.30,
      last_diagnostic_date: '2025-04-03 10:15:00',
      diagnostic_summary: 'Temperature trends indicate potential overheating.',
      data_source: 'TOA'
    }
  ],
  
  MaintenanceWorkOrders: [
    {
      work_order_id: 1001,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      scheduled_date: '2025-04-10',
      maintenance_details: 'Routine transformer maintenance including oil testing.',
      work_order_status: 'Scheduled'
    },
    {
      work_order_id: 1002,
      asset_id: 'S-567',
      asset_name: 'Substation S-567',
      scheduled_date: '2025-04-11',
      maintenance_details: 'Inspection and cleaning of electrical panels.',
      work_order_status: 'Scheduled'
    },
    {
      work_order_id: 1003,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      scheduled_date: '2025-04-09',
      maintenance_details: 'Replace worn contacts and perform operational tests.',
      work_order_status: 'In Progress'
    }
  ],
  
  MaintenanceHistory: [
    {
      work_order_id: 2001,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      maintenance_date: '2025-03-15',
      maintenance_log: 'Performed oil analysis and replaced filters. No issues found.'
    },
    {
      work_order_id: 2002,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      maintenance_date: '2025-03-20',
      maintenance_log: 'Cleaned contacts and tested operation. Recommended follow-up inspection.'
    },
    {
      work_order_id: 2003,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      maintenance_date: '2025-02-10',
      maintenance_log: 'Routine maintenance completed; performance within norms.'
    }
  ],
  
  InspectionReports: [
    {
      inspection_id: 3001,
      asset_id: 'T-789',
      asset_name: 'Transformer T-789',
      inspection_type: 'Infrared',
      report_date: '2025-04-01',
      report_summary: 'Infrared imaging indicates potential hot spots around core components.',
      inspector_name: 'John Doe'
    },
    {
      inspection_id: 3002,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      inspection_type: 'Visual',
      report_date: '2025-03-28',
      report_summary: 'Visual inspection revealed minor wear and tear on casing.',
      inspector_name: 'Jane Smith'
    },
    {
      inspection_id: 3003,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      inspection_type: 'Infrared',
      report_date: '2025-03-30',
      report_summary: 'Thermal patterns are normal, no anomalies detected.',
      inspector_name: 'Alice Johnson'
    }
  ],
  
  PredictiveMaintenance: [
    {
      recommendation_id: 4001,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      prediction_date: '2025-04-06',
      risk_level: 'Medium',
      recommendation_details: 'Consider scheduling a detailed oil analysis soon due to slight thermal drift.',
      sensor_data_summary: 'Oil temperature trending upwards.'
    },
    {
      recommendation_id: 4002,
      asset_id: 'T-789',
      asset_name: 'Transformer T-789',
      prediction_date: '2025-04-06',
      risk_level: 'High',
      recommendation_details: 'Immediate inspection recommended due to high thermal readings and abnormal vibration levels.',
      sensor_data_summary: 'Thermal and vibration sensors indicate risk.'
    },
    {
      recommendation_id: 4003,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      prediction_date: '2025-04-06',
      risk_level: 'Low',
      recommendation_details: 'No immediate action needed, monitor the switch contacts for further degradation.',
      sensor_data_summary: 'Normal operation with slight contact wear.'
    }
  ],
  
  RealTimeData: [
    {
      measurement_id: 5001,
      substation_id: 'S-567',
      sensor_type: 'Load',
      value: 75.50,
      measurement_time: '2025-04-05 09:00:00'
    },
    {
      measurement_id: 5002,
      substation_id: 'S-567',
      sensor_type: 'Voltage',
      value: 11.50,
      measurement_time: '2025-04-05 09:00:00'
    },
    {
      measurement_id: 5003,
      substation_id: 'S-567',
      sensor_type: 'Temperature',
      value: 65.00,
      measurement_time: '2025-04-05 09:00:00'
    }
  ],
  
  SafetyGuidelines: [
    {
      guideline_id: 7001,
      procedure_name: 'Live-Line Maintenance',
      required_PPE: 'Insulated gloves, arc flash suit, helmet',
      safety_instructions: 'Always de-energize equipment before performing maintenance.',
      compliance_notes: 'Follow NFPA 70E guidelines.'
    },
    {
      guideline_id: 7002,
      procedure_name: 'Breaker Racking',
      required_PPE: 'Hard hat, safety glasses, gloves',
      safety_instructions: 'Ensure lockout-tagout procedures are followed before racking.',
      compliance_notes: 'Review annual safety training.'
    },
    {
      guideline_id: 7003,
      procedure_name: 'High Voltage Inspections',
      required_PPE: 'Insulated gloves, dielectric boots, face shield',
      safety_instructions: 'Maintain a safe distance and use appropriate barriers.',
      compliance_notes: 'Compliance with OSHA regulations required.'
    }
  ],
  
  TrainingMaterials: [
    {
      material_id: 8001,
      topic: 'DGA Test Interpretation',
      content: 'Detailed guide on interpreting dissolved gas analysis for transformers.',
      certification_required: true,
      reference_manual: 'Transformer Maintenance Manual, Chapter 5',
      url: 'http://example.com/dga-guide'
    },
    {
      material_id: 8002,
      topic: 'Infrared Inspection Techniques',
      content: 'Best practices for conducting infrared inspections on electrical equipment.',
      certification_required: false,
      reference_manual: 'Infrared Inspection Handbook',
      url: 'http://example.com/ir-handbook'
    },
    {
      material_id: 8003,
      topic: 'Safety Protocols for Live-Line Maintenance',
      content: 'Step-by-step procedures for safely performing live-line maintenance.',
      certification_required: true,
      reference_manual: 'Live-Line Safety Manual',
      url: 'http://example.com/live-line-safety'
    }
  ],
  
  IncidentReports: [
    {
      incident_id: 9001,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      incident_date: '2025-04-04',
      failure_type: 'Overheating',
      description: 'Transformer experienced abnormal temperature rise leading to a shutdown.',
      logged_by: 'John Doe',
      category: 'Thermal',
      potential_causes: 'Oil degradation, blocked cooling fins'
    },
    {
      incident_id: 9002,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      incident_date: '2025-04-03',
      failure_type: 'Mechanical Failure',
      description: 'Breaker failed to operate correctly during routine testing.',
      logged_by: 'Jane Smith',
      category: 'Mechanical',
      potential_causes: 'Wear and tear on contacts'
    },
    {
      incident_id: 9003,
      asset_id: 'T-789',
      asset_name: 'Transformer T-789',
      incident_date: '2025-04-02',
      failure_type: 'Insulation Failure',
      description: 'Transformer insulation degraded over time causing intermittent faults.',
      logged_by: 'Alice Johnson',
      category: 'Electrical',
      potential_causes: 'Aging, environmental stress'
    }
  ],
  
  Inventory: [
    {
      inventory_id: 10001,
      asset_id: 'T-987',
      asset_name: 'Transformer T-987',
      part_name: 'Bushings',
      available_quantity: 5,
      order_status: 'In Stock',
      location: 'Warehouse A'
    },
    {
      inventory_id: 10002,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      part_name: 'Replacement Contacts',
      available_quantity: 2,
      order_status: 'Ordered',
      location: 'Warehouse B'
    },
    {
      inventory_id: 10003,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      part_name: 'Oil Filters',
      available_quantity: 10,
      order_status: 'In Stock',
      location: 'Warehouse A'
    }
  ],

  // Initialize Geofencing data
  Geofencing: [
    {
      geofence_id: 6001,
      asset_id: 'S-567',
      asset_name: 'Substation S-567',
      location: 'Downtown Facility',
      allowed_radius: 100,
      current_employee_location: 'Downtown Facility - Gate A',
      in_geofence: true,
      remote_assistance_instructions: 'No remote assistance needed.'
    },
    {
      geofence_id: 6002,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      location: 'North Substation',
      allowed_radius: 150,
      current_employee_location: 'North Substation - Main Entrance',
      in_geofence: true,
      remote_assistance_instructions: 'If outside geofence, call dispatch immediately.'
    },
    {
      geofence_id: 6003,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      location: 'East Substation',
      allowed_radius: 100,
      current_employee_location: 'Parking Lot',
      in_geofence: false,
      remote_assistance_instructions: 'Employee is outside allowed area; contact supervisor.'
    }
  ]
};

// Function to extract intent from query
export function extractIntent(query: string): { intent: string; entity?: string } {
  const queryLower = query.toLowerCase();
  console.log(`Processing query: "${queryLower}"`);
  
  // Check for greetings and intro messages
  if (/^(hi|hello|hey|greetings|howdy|hola).{0,10}$/i.test(queryLower) || 
      queryLower === 'hi there' || 
      queryLower === 'hello there' || 
      queryLower === 'hey there') {
    console.log('Detected intent: greeting');
    return { intent: 'greeting' };
  }
  
  // Check for help/how to use queries
  if (queryLower.includes('how do you work') || 
      queryLower.includes('what can you do') || 
      queryLower.includes('how to use') || 
      queryLower.includes('help me') ||
      (queryLower.includes('what') && queryLower.includes('information') && queryLower.includes('provide')) ||
      queryLower.includes('what are your capabilities') ||
      queryLower.includes('show me what you can do')) {
    console.log('Detected intent: help');
    return { intent: 'help' };
  }
  
  // Extract entity IDs
  let entity = undefined;
  const assetMatches = queryLower.match(/([tb]-\d{3})/i);
  if (assetMatches) {
    entity = assetMatches[1].toUpperCase();
    console.log(`Detected entity: ${entity}`);
  }
  
  const substationMatches = queryLower.match(/(s-\d{3})/i);
  if (substationMatches) {
    entity = substationMatches[1].toUpperCase();
    console.log(`Detected entity: ${entity}`);
  }
  
  // Check for geofencing queries FIRST to prioritize this intent
  if (queryLower.includes('geofence') || 
      queryLower.includes('geofenced') ||
      queryLower.includes('location') || 
      queryLower.includes('am i within') || 
      queryLower.includes('allowed area') ||
      queryLower.includes('check my') || 
      queryLower.includes('current location')) {
    console.log(`Detected intent: geofencing, entity: ${entity}`);
    return { intent: 'geofencing', entity };
  }
  
  // Check for asset health intent
  if (queryLower.includes('health') || queryLower.includes('status') || queryLower.includes('condition') || 
      queryLower.includes('diagnostic summary') || queryLower.includes('diagnostics')) {
    console.log(`Detected intent: asset_health, entity: ${entity}`);
    return { intent: 'asset_health', entity };
  }
  
  // Check for aggregated issues/diagnostics query
  if ((queryLower.includes('which') || queryLower.includes('what')) && 
      queryLower.includes('assets') && 
      (queryLower.includes('issues') || queryLower.includes('problems') || queryLower.includes('diagnostic issues'))) {
    return { intent: 'diagnostic_issues' };
  }
  
  // Check for maintenance intent
  if (queryLower.includes('maintenance') || queryLower.includes('work order')) {
    if (queryLower.includes('history') || queryLower.includes('past') || queryLower.includes('historical') || 
        queryLower.includes('logs') || queryLower.includes('retrieve')) {
      return { intent: 'maintenance_history', entity };
    } else {
      return { intent: 'maintenance_schedule', entity };
    }
  }
  
  // Check for inspection intent
  if (queryLower.includes('inspection') || queryLower.includes('report')) {
    if (queryLower.includes('submit') || queryLower.includes('new') || queryLower.includes('create') || 
        queryLower.includes('how can i')) {
      return { intent: 'inspection_submission' };
    }
    
    // Check for inspection type
    if (queryLower.includes('infrared')) {
      entity = entity || 'infrared';
      return { intent: 'inspection_report', entity };
    }
    
    if (queryLower.includes('visual')) {
      entity = entity || 'visual';
      return { intent: 'inspection_report', entity };
    }
    
    return { intent: 'inspection_report', entity };
  }
  
  // Check for predictive maintenance
  if (queryLower.includes('predictive') || queryLower.includes('predict') || 
      (queryLower.includes('based on') && queryLower.includes('sensor')) || 
      (queryLower.includes('maintenance') && queryLower.includes('recommendation')) ||
      queryLower.includes('risk level') || queryLower.includes('alerts')) {
    return { intent: 'predictive_maintenance', entity };
  }
  
  // Check for real-time data
  if (queryLower.includes('real-time') || queryLower.includes('real time') || queryLower.includes('current') || 
      queryLower.includes('sensor') || queryLower.includes('voltage') || queryLower.includes('load') || 
      queryLower.includes('temperature') || queryLower.includes('latest') || queryLower.includes('reading') ||
      queryLower.includes('right now')) {
    return { intent: 'real_time_data', entity };
  }
  
  // Check for safety guidelines
  if (queryLower.includes('safety') || queryLower.includes('ppe') || 
      queryLower.includes('compliance') || queryLower.includes('procedure') ||
      queryLower.includes('guidelines') || queryLower.includes('steps')) {
    if (queryLower.includes('live-line') || queryLower.includes('live line')) {
      return { intent: 'safety_guidelines', entity: 'Live-Line Maintenance' };
    } else if (queryLower.includes('breaker racking') || queryLower.includes('breaker')) {
      return { intent: 'safety_guidelines', entity: 'Breaker Racking' };
    } else if (queryLower.includes('high voltage')) {
      return { intent: 'safety_guidelines', entity: 'High Voltage Inspections' };
    } else {
      return { intent: 'safety_guidelines', entity };
    }
  }
  
  // Check for training materials
  if (queryLower.includes('training') || queryLower.includes('how do i') || 
      queryLower.includes('interpret') || queryLower.includes('dga') || 
      queryLower.includes('guidance') || queryLower.includes('technique') ||
      queryLower.includes('protocol') || queryLower.includes('procedures')) {
    if (queryLower.includes('dga')) {
      return { intent: 'training_materials', entity: 'DGA Test Interpretation' };
    } else if (queryLower.includes('infrared')) {
      return { intent: 'training_materials', entity: 'Infrared Inspection Techniques' };
    } else if (queryLower.includes('live-line') || queryLower.includes('live line')) {
      return { intent: 'training_materials', entity: 'Safety Protocols for Live-Line Maintenance' };
    } else {
      return { intent: 'training_materials', entity };
    }
  }
  
  // Check for incidents
  if (queryLower.includes('incident') || queryLower.includes('failure') || 
      queryLower.includes('accident') || queryLower.includes('outage') ||
      queryLower.includes('report') || queryLower.includes('log a') ||
      queryLower.includes('need to report') || queryLower.includes('historical')) {
    return { intent: 'incidents', entity };
  }
  
  // Check for inventory
  if (queryLower.includes('inventory') || queryLower.includes('part') || 
      queryLower.includes('spare') || queryLower.includes('stock') ||
      queryLower.includes('available') || queryLower.includes('replacement')) {
    return { intent: 'inventory', entity };
  }
  
  // If it's not a database-related query, use the off-topic intent
  if (!queryLower.includes('substation') && 
      !queryLower.includes('transformer') && 
      !queryLower.includes('breaker') && 
      !queryLower.includes('maintenance') && 
      !queryLower.includes('inspection') && 
      !queryLower.includes('pg&e') && 
      !queryLower.includes('pge')) {
    return { intent: 'off_topic' };
  }
  
  // No specific intent identified
  return { intent: 'general', entity };
}

// Function to get data based on intent
export function getDataBasedOnIntent(intent: string, entity?: string): any {
  switch (intent) {
    case 'greeting':
      return {
        message: "Hello! I'm the PG&E Substation Operations Assistant. I can provide information about substation assets, maintenance schedules, safety guidelines, and more. How can I help you today?"
      };
      
    case 'help':
      return {
        message: "I'm the PG&E Substation Operations Assistant, designed to provide information from our substation database. I can help you with:\n\n" +
                "- Asset health status (e.g., 'What is the health status of transformer T-123?')\n" +
                "- Maintenance schedules (e.g., 'Is there any scheduled maintenance for North Bay Area?')\n" +
                "- Maintenance history (e.g., 'What is the maintenance history for transformer T-123?')\n" +
                "- Inspection reports (e.g., 'Show me the infrared inspection for T-789')\n" +
                "- Real-time data (e.g., 'What is the temperature at Substation S-567?')\n" +
                "- Predictive maintenance (e.g., 'What is the risk level for Breaker B-456?')\n" +
                "- Safety procedures (e.g., 'Show me safety guidelines for breaker racking')\n" +
                "- Inventory information (e.g., 'What spare parts are available for breaker B-456?')\n\n" +
                "Please ask specific questions related to PG&E substation operations."
      };
      
    case 'off_topic':
      return {
        message: "I'm designed to provide information specifically about PG&E substation operations and assets. I can help with questions about transformers, breakers, maintenance schedules, safety guidelines, and similar topics. Could you please ask a question related to our substation database?"
      };
      
    case 'asset_health':
      if (entity) {
        return database.AssetDiagnostics.filter(item => item.asset_id === entity);
      } else {
        return database.AssetDiagnostics;
      }
      
    case 'diagnostic_issues':
      // Filter assets with issues in the past week
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Find assets with health issues
      const assetsWithIssues = database.AssetDiagnostics.filter(asset => {
        const diagDate = new Date(asset.last_diagnostic_date);
        return diagDate >= oneWeekAgo && 
               (asset.diagnostic_summary.toLowerCase().includes('issue') || 
                asset.diagnostic_summary.toLowerCase().includes('problem') ||
                asset.diagnostic_summary.toLowerCase().includes('degrad') ||
                asset.diagnostic_summary.toLowerCase().includes('abnormal') ||
                asset.health_score < 85);
      });
      
      // Find assets with inspection issues
      const inspectionsWithIssues = database.InspectionReports.filter(report => {
        const reportDate = new Date(report.report_date);
        return reportDate >= oneWeekAgo && 
               (report.report_summary.toLowerCase().includes('issue') ||
                report.report_summary.toLowerCase().includes('problem') ||
                report.report_summary.toLowerCase().includes('hot spot') ||
                report.report_summary.toLowerCase().includes('wear') ||
                report.report_summary.toLowerCase().includes('concern'));
      });
      
      return { 
        diagnosticIssues: assetsWithIssues,
        inspectionIssues: inspectionsWithIssues
      };
      
    case 'maintenance_schedule':
      if (entity) {
        return database.MaintenanceWorkOrders.filter(item => item.asset_id === entity);
      } else {
        return database.MaintenanceWorkOrders;
      }
      
    case 'maintenance_history':
      if (entity) {
        return database.MaintenanceHistory.filter(item => item.asset_id === entity);
      } else {
        return database.MaintenanceHistory;
      }
      
    case 'inspection_report':
      if (entity) {
        if (entity === 'infrared' || entity === 'visual') {
          // Filter by inspection type
          return database.InspectionReports.filter(item => item.inspection_type.toLowerCase() === entity.toLowerCase());
        } else {
          // Filter by asset ID
          return database.InspectionReports.filter(item => item.asset_id === entity);
        }
      } else {
        return database.InspectionReports;
      }
      
    case 'inspection_submission':
      return {
        message: "To submit a new inspection report, please follow these steps:\n\n" +
                "1. Log in to the PG&E Asset Management System\n" +
                "2. Navigate to 'Inspections' > 'New Inspection Report'\n" +
                "3. Select the asset type and ID you're inspecting\n" +
                "4. Choose the inspection type (Visual, Infrared, etc.)\n" +
                "5. Fill out all required fields with your findings\n" +
                "6. Attach any relevant photos or documentation\n" +
                "7. Submit the form for review\n\n" +
                "Your report will be processed and added to the asset's inspection history."
      };
      
    case 'predictive_maintenance':
      if (entity) {
        return database.PredictiveMaintenance.filter(item => item.asset_id === entity);
      } else {
        return database.PredictiveMaintenance;
      }
      
    case 'real_time_data':
      if (entity) {
        return database.RealTimeData.filter(item => item.substation_id === entity);
      } else {
        return database.RealTimeData;
      }
      
    case 'geofencing':
      if (entity) {
        return database.Geofencing.filter(item => item.asset_id === entity);
      } else {
        return database.Geofencing;
      }
      
    case 'safety_guidelines':
      if (entity) {
        return database.SafetyGuidelines.filter(item => item.procedure_name === entity);
      } else {
        return database.SafetyGuidelines;
      }
      
    case 'training_materials':
      if (entity) {
        return database.TrainingMaterials.filter(item => item.topic === entity);
      } else {
        return database.TrainingMaterials;
      }
      
    case 'incidents':
      if (entity) {
        return database.IncidentReports.filter(item => item.asset_id === entity);
      } else {
        return database.IncidentReports;
      }
      
    case 'inventory':
      if (entity) {
        return database.Inventory.filter(item => item.asset_id === entity);
      } else {
        return database.Inventory;
      }
      
    default:
      return {
        message: "I can help you with information about substation assets, maintenance schedules, inspection reports, real-time data, safety guidelines, and more. Please ask a specific question about PG&E substations."
      };
  }
}

// Function to generate response from data
export function generateResponseFromData(intent: string, data: any): string {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return "I couldn't find any information about that in our database. Please try a different query or be more specific.";
  }
  
  // Handle special message-based responses
  if (data.message && (intent === 'greeting' || intent === 'help' || intent === 'off_topic' || intent === 'general' || intent === 'inspection_submission')) {
    return data.message;
  }
  
  if (Array.isArray(data) && data.length === 1) {
    data = data[0]; // If there's only one item, use it directly
  }
  
  switch (intent) {
    case 'asset_health':
      if (Array.isArray(data)) {
        return `I found information about ${data.length} assets. Here's a summary: ${data.map(asset => 
          `${asset.asset_name} has a health score of ${asset.health_score}. Last diagnostic on ${new Date(asset.last_diagnostic_date).toLocaleDateString()}. ${asset.diagnostic_summary}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} has a health score of ${data.health_score}. Last diagnostic on ${new Date(data.last_diagnostic_date).toLocaleDateString()}. ${data.diagnostic_summary}`;
      }
      
    case 'diagnostic_issues':
      const { diagnosticIssues, inspectionIssues } = data;
      let response = 'Based on our records, ';
      
      if (diagnosticIssues.length === 0 && inspectionIssues.length === 0) {
        return 'No assets have reported diagnostic issues in the past week.';
      }
      
      if (diagnosticIssues.length > 0) {
        response += `the following assets have diagnostic issues: ${diagnosticIssues.map(asset => 
          `${asset.asset_name} (Score: ${asset.health_score}, Issue: ${asset.diagnostic_summary})`
        ).join('; ')}. `;
      }
      
      if (inspectionIssues.length > 0) {
        response += `The following assets have inspection issues: ${inspectionIssues.map(report => 
          `${report.asset_name} (${report.inspection_type} inspection on ${report.report_date}: ${report.report_summary})`
        ).join('; ')}.`;
      }
      
      return response;
      
    case 'maintenance_schedule':
      if (Array.isArray(data)) {
        return `I found information about ${data.length} scheduled maintenance tasks: ${data.map(item => 
          `${item.asset_name} has ${item.work_order_status} maintenance on ${item.scheduled_date}: ${item.maintenance_details}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} has ${data.work_order_status} maintenance on ${data.scheduled_date}: ${data.maintenance_details}`;
      }
      
    case 'maintenance_history':
      if (Array.isArray(data)) {
        return `I found information about ${data.length} maintenance history records: ${data.map(item => 
          `${item.asset_name} maintenance on ${item.maintenance_date}: ${item.maintenance_log}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} maintenance on ${data.maintenance_date}: ${data.maintenance_log}`;
      }
      
    case 'inspection_report':
      if (Array.isArray(data)) {
        return `I found information about ${data.length} inspection reports: ${data.map(item => 
          `${item.asset_name} ${item.inspection_type} inspection on ${item.report_date} by ${item.inspector_name}: ${item.report_summary}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} ${data.inspection_type} inspection on ${data.report_date} by ${data.inspector_name}: ${data.report_summary}`;
      }
      
    case 'predictive_maintenance':
      if (Array.isArray(data)) {
        return `I found information about ${data.length} predictive maintenance recommendations: ${data.map(item =>
          `${item.asset_name} has a ${item.risk_level} risk level as of ${item.prediction_date}. ${item.recommendation_details} Sensor data: ${item.sensor_data_summary}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} has a ${data.risk_level} risk level as of ${data.prediction_date}. ${data.recommendation_details} Sensor data: ${data.sensor_data_summary}`;
      }
      
    case 'real_time_data':
      if (Array.isArray(data)) {
        return `Current readings for ${data[0]?.substation_id || "the substation"}: ${data.map(item => 
          `${item.sensor_type}: ${item.value} as of ${new Date(item.measurement_time).toLocaleTimeString()}`
        ).join(', ')}`;
      } else {
        return `${data.sensor_type}: ${data.value} as of ${new Date(data.measurement_time).toLocaleTimeString()}`;
      }
      
    case 'geofencing':
      if (Array.isArray(data)) {
        return `Geofencing information: ${data.map(item => 
          `For ${item.asset_name} at ${item.location}, you are currently ${item.in_geofence ? 'WITHIN' : 'OUTSIDE'} the allowed area (${item.allowed_radius}m radius). ${item.remote_assistance_instructions}`
        ).join(' ')}`;
      } else {
        return `For ${data.asset_name} at ${data.location}, you are currently ${data.in_geofence ? 'WITHIN' : 'OUTSIDE'} the allowed area (${data.allowed_radius}m radius). ${data.remote_assistance_instructions}`;
      }
      
    case 'safety_guidelines':
      if (Array.isArray(data)) {
        return `Here are ${data.length} safety guidelines: ${data.map(item => 
          `For ${item.procedure_name}, required PPE: ${item.required_PPE}. ${item.safety_instructions} ${item.compliance_notes}`
        ).join(' ')}`;
      } else {
        return `For ${data.procedure_name}, required PPE: ${data.required_PPE}. ${data.safety_instructions} ${data.compliance_notes}`;
      }
      
    case 'training_materials':
      if (Array.isArray(data)) {
        return `I found ${data.length} relevant training materials: ${data.map(item => 
          `Topic: ${item.topic} - ${item.content} ${item.certification_required ? 'Certification required.' : ''} Reference: ${item.reference_manual}. URL: ${item.url}`
        ).join(' ')}`;
      } else {
        return `Topic: ${data.topic} - ${data.content} ${data.certification_required ? 'Certification required.' : ''} Reference: ${data.reference_manual}. URL: ${data.url}`;
      }
      
    case 'incidents':
      if (Array.isArray(data)) {
        return `I found information about ${data.length} incident reports: ${data.map(item => 
          `${item.asset_name} had a ${item.failure_type} incident on ${item.incident_date}. ${item.description} Potential causes: ${item.potential_causes}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} had a ${data.failure_type} incident on ${data.incident_date}. ${data.description} Potential causes: ${data.potential_causes}`;
      }
      
    case 'inventory':
      if (Array.isArray(data)) {
        return `I found information about ${data.length} inventory items: ${data.map(item => 
          `${item.part_name} for ${item.asset_name}: ${item.available_quantity} available (${item.order_status}) in ${item.location}`
        ).join(' ')}`;
      } else {
        return `${data.part_name} for ${data.asset_name}: ${data.available_quantity} available (${data.order_status}) in ${data.location}`;
      }
      
    default:
      return "Based on the information in our database, here's what I can tell you: " + JSON.stringify(data);
  }
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Chat API endpoint
app.post('/api/chat/query', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`Received chat query: ${message}`);
    
    // Process the message to get a database-based response
    const { intent, entity } = extractIntent(message);
    console.log(`Detected intent: ${intent}, entity: ${entity || 'none'}`);
    
    const data = getDataBasedOnIntent(intent, entity);
    const response = generateResponseFromData(intent, data);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error processing chat query:', error);
    return res.status(500).json({ error: 'An error occurred while processing your message' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Database-based mock server running on port ${PORT}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down server gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server gracefully');
  process.exit(0);
}); 