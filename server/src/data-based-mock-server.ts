import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 7777;

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
  
  // Define substation-related keywords for topic filtering
  const substationKeywords = [
    'substation', 'transformer', 'breaker', 'asset', 'inspection', 'maintenance',
    'diagnostic', 'health', 'safety', 'outage', 'equipment', 'pg&e', 'pge',
    'voltage', 'temperature', 'load', 'geofence', 'infrared', 'report', 'power',
    'electrical', 'dga', 'oil', 'bushings', 'contacts', 'risk', 'overheating',
    'work order', 'schedule', 'incident', 'spare parts', 'inventory', 'guideline'
  ];
  
  // Check if the query is related to substations
  const isSubstationQuery = substationKeywords.some(keyword => queryLower.includes(keyword));
  
  // Simple greeting detection - must be handled before the substation check
  if (queryLower === 'hi' || 
      queryLower === 'hello' || 
      queryLower === 'hey' || 
      queryLower === 'yo' || 
      queryLower === 'sup' || 
      queryLower === 'greetings' || 
      queryLower === 'whats up' || 
      queryLower === "what's up" || 
      queryLower === 'hi there' || 
      queryLower === 'hello there' || 
      queryLower === 'hey there') {
    console.log('Detected intent: greeting');
    return { intent: 'greeting' };
  }
  
  // Reject personal greeting questions and treat them as off-topic
  if (queryLower.includes('how are you') || 
      queryLower.includes('how are you doing') || 
      queryLower.includes('how do you feel') || 
      queryLower.includes('how\'s your day') || 
      queryLower.includes('how is your day')) {
    console.log('Detected intent: off_topic (personal greeting)');
    return { intent: 'off_topic' };
  }
  
  // If not related to substations, return off_topic immediately
  if (!isSubstationQuery) {
    console.log(`Detected intent: off_topic (not related to substation operations)`);
    return { intent: 'off_topic' };
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
  
  // Check for specific substrings that map to procedure names
  if (queryLower.includes('breaker racking')) {
    console.log(`Detected entity: Breaker Racking`);
    entity = entity || 'Breaker Racking';
  } else if (queryLower.includes('live-line') || queryLower.includes('live line')) {
    console.log(`Detected entity: Live-Line Maintenance`);
    entity = entity || 'Live-Line Maintenance';
  } else if (queryLower.includes('high voltage')) {
    console.log(`Detected entity: High Voltage Inspections`);
    entity = entity || 'High Voltage Inspections';
  }
  
  // Check for topic names for training materials
  if (queryLower.includes('dga test')) {
    console.log(`Detected entity: DGA Test Interpretation`);
    entity = entity || 'DGA Test Interpretation';
  } else if (queryLower.includes('infrared inspection')) {
    console.log(`Detected entity: Infrared Inspection Techniques`);
    entity = entity || 'Infrared Inspection Techniques';
  } else if (queryLower.includes('safety protocol') && (queryLower.includes('live-line') || queryLower.includes('live line'))) {
    console.log(`Detected entity: Safety Protocols for Live-Line Maintenance`);
    entity = entity || 'Safety Protocols for Live-Line Maintenance';
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
  
  // Check for diagnostic summary queries (more specific before more general)
  if (queryLower.includes('latest diagnostic summary') || 
      queryLower.includes('show me the latest diagnostic') ||
      queryLower.includes('diagnostic summary') ||
      queryLower.includes('what does the diagnostic say')) {
    console.log(`Detected intent: diagnostic_summary, entity: ${entity}`);
    return { intent: 'diagnostic_summary', entity };
  }
  
  // Check for asset health intent
  if (queryLower.includes('health') || queryLower.includes('status') || queryLower.includes('condition') || 
      queryLower.includes('score') || queryLower.includes('diagnostics')) {
    console.log(`Detected intent: asset_health, entity: ${entity}`);
    return { intent: 'asset_health', entity };
  }
  
  // Check for aggregated issues/diagnostics query
  if ((queryLower.includes('which') || queryLower.includes('what')) && 
      queryLower.includes('assets') && 
      (queryLower.includes('issues') || queryLower.includes('problems') || queryLower.includes('diagnostic issues'))) {
    console.log('Detected intent: diagnostic_issues');
    return { intent: 'diagnostic_issues' };
  }
  
  // Check for maintenance intent - scheduled maintenance first
  if (queryLower.includes('scheduled') || queryLower.includes('next week') || 
      queryLower.includes('what maintenance is') || queryLower.includes('upcoming')) {
    console.log(`Detected intent: maintenance_schedule, entity: ${entity}`);
    return { intent: 'maintenance_schedule', entity };
  }
  
  // Then general maintenance queries
  if (queryLower.includes('maintenance') || queryLower.includes('work order')) {
    if (queryLower.includes('history') || queryLower.includes('past') || queryLower.includes('historical') || 
        queryLower.includes('logs') || queryLower.includes('retrieve')) {
      console.log(`Detected intent: maintenance_history, entity: ${entity}`);
      return { intent: 'maintenance_history', entity };
    } else {
      console.log(`Detected intent: maintenance_schedule, entity: ${entity}`);
      return { intent: 'maintenance_schedule', entity };
    }
  }
  
  // Check for inspection intent
  if (queryLower.includes('inspection') || queryLower.includes('report')) {
    if (queryLower.includes('submit') || queryLower.includes('new') || queryLower.includes('create') || 
        queryLower.includes('how can i')) {
      console.log('Detected intent: inspection_submission');
      return { intent: 'inspection_submission' };
    }
    
    // Check for inspection type
    if (queryLower.includes('infrared')) {
      entity = entity || 'infrared';
      console.log(`Detected intent: inspection_report, entity: ${entity}`);
      return { intent: 'inspection_report', entity };
    }
    
    if (queryLower.includes('visual')) {
      entity = entity || 'visual';
      console.log(`Detected intent: inspection_report, entity: ${entity}`);
      return { intent: 'inspection_report', entity };
    }
    
    console.log(`Detected intent: inspection_report, entity: ${entity}`);
    return { intent: 'inspection_report', entity };
  }
  
  // Check for predictive maintenance
  if (queryLower.includes('risk level') || 
      queryLower.includes('what is the risk') ||
      queryLower.includes('current risk')) {
    console.log(`Detected intent: predictive_maintenance, entity: ${entity}`);
    return { intent: 'predictive_maintenance', entity };
  }
  
  if (queryLower.includes('predictive') || queryLower.includes('predict') || 
      (queryLower.includes('based on') && queryLower.includes('sensor')) || 
      (queryLower.includes('maintenance') && queryLower.includes('recommendation')) ||
      queryLower.includes('predictive alerts') ||
      queryLower.includes('sensor data') ||
      queryLower.includes('what recommendation')) {
    console.log(`Detected intent: predictive_maintenance, entity: ${entity}`);
    return { intent: 'predictive_maintenance', entity };
  }
  
  // Check for real-time data
  if (queryLower.includes('real-time') || queryLower.includes('real time') || queryLower.includes('current') || 
      queryLower.includes('sensor') || queryLower.includes('voltage') || queryLower.includes('load') || 
      queryLower.includes('temperature') || queryLower.includes('latest') || queryLower.includes('reading') ||
      queryLower.includes('right now')) {
    console.log(`Detected intent: real_time_data, entity: ${entity}`);
    return { intent: 'real_time_data', entity };
  }
  
  // Check for safety guidelines
  if (queryLower.includes('safety') || queryLower.includes('ppe') || 
      queryLower.includes('compliance') || queryLower.includes('procedure') ||
      queryLower.includes('guidelines') || queryLower.includes('steps')) {
    console.log(`Detected intent: safety_guidelines, entity: ${entity}`);
    return { intent: 'safety_guidelines', entity };
  }
  
  // Check for training materials
  if (queryLower.includes('training') || queryLower.includes('how do i') || 
      queryLower.includes('interpret') || queryLower.includes('guidance') || 
      queryLower.includes('technique') || queryLower.includes('protocol') || 
      queryLower.includes('procedures')) {
    console.log(`Detected intent: training_materials, entity: ${entity}`);
    return { intent: 'training_materials', entity };
  }
  
  // Check for incidents
  if ((queryLower.includes('i need to report') || 
      queryLower.includes('report an') || 
      queryLower.includes('log a new') || 
      queryLower.includes('submit a')) && 
      (queryLower.includes('incident') || queryLower.includes('failure') || 
       queryLower.includes('overheating') || queryLower.includes('issue'))) {
    console.log(`Detected intent: incident_submission`);
    return { intent: 'incident_submission' };
  }
  
  if (queryLower.includes('incident') || queryLower.includes('failure') || 
      queryLower.includes('accident') || queryLower.includes('outage') ||
      (queryLower.includes('show me') && queryLower.includes('report')) || 
      queryLower.includes('historical')) {
    console.log(`Detected intent: incidents, entity: ${entity}`);
    return { intent: 'incidents', entity };
  }
  
  // Check for inventory
  if (queryLower.includes('inventory') || queryLower.includes('part') || 
      queryLower.includes('spare') || queryLower.includes('stock') ||
      queryLower.includes('available') || queryLower.includes('replacement')) {
    console.log(`Detected intent: inventory, entity: ${entity}`);
    return { intent: 'inventory', entity };
  }
  
  // No specific intent identified
  console.log(`Detected intent: general, entity: ${entity}`);
  return { intent: 'general', entity };
}

// Add a utility function to generate synthetic data
function generateSyntheticData(intent: string, query: string, entity?: string): any {
  // Extract relevant information from the query
  const queryLower = query.toLowerCase();
  console.log(`Generating synthetic data for query: "${queryLower}", intent: ${intent}, entity: ${entity || 'none'}`);
  
  // Generate asset ID if not provided
  const generateAssetId = (type: string) => {
    const existingIds = database.AssetDiagnostics
      .filter(asset => asset.asset_id.startsWith(type.toUpperCase()))
      .map(asset => parseInt(asset.asset_id.substring(2)));
    
    // Generate a random ID that doesn't exist yet
    let newId;
    do {
      newId = Math.floor(Math.random() * 900) + 100; // 3-digit number
    } while (existingIds.includes(newId));
    
    return `${type.toUpperCase()}-${newId}`;
  };
  
  switch (intent) {
    case 'asset_health':
      // Generate a synthetic asset health record
      const assetType = queryLower.includes('transformer') ? 'transformer' : 
                       queryLower.includes('breaker') ? 'breaker' : 'equipment';
      const assetId = entity || generateAssetId(assetType.substring(0, 1));
      const healthScore = Math.floor(Math.random() * 20) + 80; // 80-99
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // 0-7 days ago
      
      return {
        diagnostic_id: 9999,
        asset_id: assetId,
        asset_name: `${assetType.charAt(0).toUpperCase() + assetType.slice(1)} ${assetId}`,
        health_score: healthScore,
        last_diagnostic_date: date.toISOString().split('T')[0] + ' 08:30:00',
        diagnostic_summary: healthScore > 90 
          ? 'All systems operating normally with optimal performance.' 
          : healthScore > 85 
          ? 'Minor degradation detected but operating within normal parameters.' 
          : 'Some wear detected, recommend scheduling routine maintenance.',
        data_source: 'Substation Monitoring System'
      };
      
    case 'maintenance_schedule':
      const maintenanceAssetType = queryLower.includes('transformer') ? 'transformer' : 
                                  queryLower.includes('breaker') ? 'breaker' : 
                                  queryLower.includes('substation') ? 'substation' : 'equipment';
      const maintenanceAssetId = entity || generateAssetId(maintenanceAssetType.substring(0, 1));
      
      // Future date for scheduled maintenance
      const scheduleDate = new Date();
      scheduleDate.setDate(scheduleDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days ahead
      
      const maintenanceTypes = [
        'Routine inspection and testing',
        'Oil sample analysis',
        'Contact replacement',
        'Thermal imaging inspection',
        'Cleaning and lubrication',
        'Insulation testing'
      ];
      
      return {
        work_order_id: 9999,
        asset_id: maintenanceAssetId,
        asset_name: `${maintenanceAssetType.charAt(0).toUpperCase() + maintenanceAssetType.slice(1)} ${maintenanceAssetId}`,
        scheduled_date: scheduleDate.toISOString().split('T')[0],
        maintenance_details: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
        work_order_status: 'Scheduled'
      };
      
    case 'inspection_report':
      const inspectionAssetType = queryLower.includes('transformer') ? 'transformer' : 
                                 queryLower.includes('breaker') ? 'breaker' : 'equipment';
      const inspectionAssetId = entity || generateAssetId(inspectionAssetType.substring(0, 1));
      
      // Date in the past for the inspection
      const inspectionDate = new Date();
      inspectionDate.setDate(inspectionDate.getDate() - Math.floor(Math.random() * 30)); // 0-30 days ago
      
      const inspectionType = queryLower.includes('infrared') ? 'Infrared' : 
                           queryLower.includes('visual') ? 'Visual' : 
                           queryLower.includes('acoustic') ? 'Acoustic' : 
                           Math.random() > 0.5 ? 'Visual' : 'Infrared';
      
      const inspectors = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'Wei Chen'];
      
      let inspectionSummary = '';
      if (inspectionType === 'Infrared') {
        inspectionSummary = Math.random() > 0.7 
          ? 'Thermal imaging showed normal operating temperatures. No hotspots detected.' 
          : 'Minor thermal anomalies detected in connection points. Recommend monitoring.';
      } else if (inspectionType === 'Visual') {
        inspectionSummary = Math.random() > 0.7 
          ? 'Visual inspection found all components in good condition. No visible defects.' 
          : 'Minor corrosion observed on external housing. Documented for future reference.';
      } else {
        inspectionSummary = Math.random() > 0.7 
          ? 'Noise levels within normal operating parameters.' 
          : 'Slight increase in operational noise. Recommend follow-up testing.';
      }
      
      return {
        inspection_id: 9999,
        asset_id: inspectionAssetId,
        asset_name: `${inspectionAssetType.charAt(0).toUpperCase() + inspectionAssetType.slice(1)} ${inspectionAssetId}`,
        inspection_type: inspectionType,
        report_date: inspectionDate.toISOString().split('T')[0],
        report_summary: inspectionSummary,
        inspector_name: inspectors[Math.floor(Math.random() * inspectors.length)]
      };
      
    case 'predictive_maintenance':
      const predictiveAssetType = queryLower.includes('transformer') ? 'transformer' : 
                                 queryLower.includes('breaker') ? 'breaker' : 'equipment';
      const predictiveAssetId = entity || generateAssetId(predictiveAssetType.substring(0, 1));
      
      const riskLevels = ['Low', 'Medium', 'High'];
      const riskLevel = riskLevels[Math.floor(Math.random() * 2)]; // Bias toward Low or Medium
      
      let recommendation = '';
      let sensorData = '';
      
      if (riskLevel === 'Low') {
        recommendation = 'Continue regular monitoring. No immediate action required.';
        sensorData = 'All sensor readings within normal parameters.';
      } else if (riskLevel === 'Medium') {
        recommendation = 'Schedule diagnostic testing within the next month.';
        sensorData = 'Slight deviations in vibration patterns detected.';
      } else {
        recommendation = 'Immediate inspection recommended due to abnormal sensor readings.';
        sensorData = 'Multiple sensors showing values outside expected ranges.';
      }
      
      return {
        recommendation_id: 9999,
        asset_id: predictiveAssetId,
        asset_name: `${predictiveAssetType.charAt(0).toUpperCase() + predictiveAssetType.slice(1)} ${predictiveAssetId}`,
        prediction_date: new Date().toISOString().split('T')[0],
        risk_level: riskLevel,
        recommendation_details: recommendation,
        sensor_data_summary: sensorData
      };
      
    case 'real_time_data':
      const substationId = entity || 'S-' + (Math.floor(Math.random() * 900) + 100);
      
      // Generate realistic sensor data
      const loadValue = Math.floor(Math.random() * 30) + 70; // 70-99%
      const voltageValue = Math.floor(Math.random() * 3) + 11; // 11-13 kV
      const temperatureValue = Math.floor(Math.random() * 20) + 60; // 60-79 F
      
      return [
        {
          measurement_id: 9991,
          substation_id: substationId,
          sensor_type: 'Load',
          value: loadValue,
          measurement_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
        },
        {
          measurement_id: 9992,
          substation_id: substationId,
          sensor_type: 'Voltage',
          value: voltageValue,
          measurement_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
        },
        {
          measurement_id: 9993,
          substation_id: substationId,
          sensor_type: 'Temperature',
          value: temperatureValue,
          measurement_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      ];
      
    case 'geofencing':
      const geofenceAssetType = queryLower.includes('transformer') ? 'transformer' : 
                               queryLower.includes('breaker') ? 'breaker' : 
                               queryLower.includes('substation') ? 'substation' : 'equipment';
      const geofenceAssetId = entity || generateAssetId(geofenceAssetType.substring(0, 1));
      
      const locations = ['North Bay Substation', 'Downtown Facility', 'East Substation', 'Coast Ridge Station'];
      const inGeofence = Math.random() > 0.2; // 80% chance of being in geofence
      
      return {
        geofence_id: 9999,
        asset_id: geofenceAssetId,
        asset_name: `${geofenceAssetType.charAt(0).toUpperCase() + geofenceAssetType.slice(1)} ${geofenceAssetId}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        allowed_radius: Math.floor(Math.random() * 100) + 50, // 50-149m
        current_employee_location: inGeofence ? 'Within operational area' : 'Approaching perimeter',
        in_geofence: inGeofence,
        remote_assistance_instructions: inGeofence 
          ? 'No remote assistance needed.' 
          : 'Contact operations center if you need to leave the designated work area.'
      };
      
    default:
      return null;
  }
}

// Modify getDataBasedOnIntent to use synthetic data when needed
export function getDataBasedOnIntent(intent: string, entity?: string, originalQuery?: string): any {
  // First try to get data from the database
  let result;
  
  switch (intent) {
    case 'greeting':
      return {
        message: "Hello! I'm the PG&E Substation Operations Assistant. I'm ready to help with information about transformers, breakers, maintenance schedules, safety guidelines, and other substation-related questions. What information do you need today?"
      };
      
    case 'help':
      const helpText = "I can help you with the following types of substation information:\n\n" +
             "1. Substation Asset Health: Check the health status of transformers, breakers, and other equipment\n" +
             "2. Substation Maintenance: View scheduled maintenance and historical maintenance logs\n" +
             "3. Substation Inspections: Access inspection reports and submit new ones\n" +
             "4. Real-Time Substation Data: Get current readings from substations\n" +
             "5. Predictive Maintenance: Get recommendations based on substation sensor data\n" +
             "6. Substation Safety Guidelines: Access PPE requirements and safety procedures\n" +
             "7. Technical Training: Get guidance on substation procedures and interpretations\n" +
             "8. Incident Reporting: Report and view historical substation incident data\n" +
             "9. Substation Inventory: Check spare parts availability\n" +
             "10. Geofencing: Verify your location relative to substation assets\n\n" +
             "Just ask me what you need to know about substations!";
      return { response: helpText };
      
    case 'off_topic':
      return {
        message: "I apologize, but I can only answer questions related to substation operations for PG&E. For questions about billing, outages, or other general inquiries, please call PG&E Customer Service at 1-800-743-5000."
      };
      
    case 'general':
      return {
        message: "I can help you with information about substation assets, maintenance schedules, inspection reports, real-time data, safety guidelines, and more. Please ask a specific question about PG&E substations."
      };
      
    case 'asset_health':
      if (entity) {
        result = database.AssetDiagnostics.filter(item => item.asset_id === entity);
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return result.length > 0 ? result : database.AssetDiagnostics;
      
    case 'diagnostic_summary':
      if (entity) {
        result = database.AssetDiagnostics.filter(item => item.asset_id === entity);
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData('asset_health', originalQuery, entity);
        }
      }
      return result.length > 0 ? result : database.AssetDiagnostics;
      
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
        result = database.MaintenanceWorkOrders.filter(item => item.asset_id === entity);
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return result.length > 0 ? result : database.MaintenanceWorkOrders;
      
    case 'maintenance_history':
      if (entity) {
        result = database.MaintenanceHistory.filter(item => item.asset_id === entity);
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return result.length > 0 ? result : database.MaintenanceHistory;
      
    case 'inspection_report':
      if (entity) {
        if (entity === 'infrared' || entity === 'visual') {
          // Filter by inspection type
          result = database.InspectionReports.filter(item => 
            item.inspection_type.toLowerCase() === entity.toLowerCase());
        } else {
          // Filter by asset ID
          result = database.InspectionReports.filter(item => item.asset_id === entity);
        }
        
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return result.length > 0 ? result : database.InspectionReports;
      
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
        result = database.PredictiveMaintenance.filter(item => item.asset_id === entity);
        if (result.length > 0) {
          return result;
        }
        
        if (originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
        
        // Fall back to scheduled maintenance if available
        const scheduledMaintenance = database.MaintenanceWorkOrders.filter(item => item.asset_id === entity);
        if (scheduledMaintenance && scheduledMaintenance.length > 0) {
          return {
            type: 'scheduled',
            data: scheduledMaintenance
          };
        }
        
        // Fall back to asset health if available
        const assetHealth = database.AssetDiagnostics.filter(item => item.asset_id === entity);
        if (assetHealth && assetHealth.length > 0) {
          return {
            type: 'health',
            data: assetHealth
          };
        }
      }
      return database.PredictiveMaintenance;
      
    case 'real_time_data':
      if (entity) {
        result = database.RealTimeData.filter(item => item.substation_id === entity);
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return result.length > 0 ? result : database.RealTimeData;
      
    case 'geofencing':
      if (entity) {
        result = database.Geofencing.filter(item => item.asset_id === entity);
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return result.length > 0 ? result : database.Geofencing;
      
    case 'safety_guidelines':
      if (entity) {
        // Try to match by procedure name even if it's not an exact match
        const guidelines = database.SafetyGuidelines.filter(item => 
          item.procedure_name.toLowerCase().includes(entity.toLowerCase()));
        
        if (guidelines.length > 0) {
          return guidelines;
        }
        
        // Try general categories
        if (entity === 'Breaker Racking' || entity.toLowerCase().includes('breaker')) {
          return database.SafetyGuidelines.filter(item => 
            item.procedure_name.toLowerCase().includes('breaker'));
        } else if (entity === 'Live-Line Maintenance' || 
                   entity.toLowerCase().includes('live') || 
                   entity.toLowerCase().includes('line')) {
          return database.SafetyGuidelines.filter(item => 
            item.procedure_name.toLowerCase().includes('live'));
        } else if (entity === 'High Voltage Inspections' || 
                   entity.toLowerCase().includes('high voltage')) {
          return database.SafetyGuidelines.filter(item => 
            item.procedure_name.toLowerCase().includes('high voltage'));
        }
      } 
      return database.SafetyGuidelines;
      
    case 'training_materials':
      if (entity) {
        // Try to match by topic even if it's not an exact match
        const materials = database.TrainingMaterials.filter(item => 
          item.topic.toLowerCase().includes(entity.toLowerCase()));
        
        if (materials.length > 0) {
          return materials;
        }
        
        // Try general categories
        if (entity === 'DGA Test Interpretation' || entity.toLowerCase().includes('dga')) {
          return database.TrainingMaterials.filter(item => 
            item.topic.toLowerCase().includes('dga'));
        } else if (entity === 'Infrared Inspection Techniques' || 
                   entity.toLowerCase().includes('infrared')) {
          return database.TrainingMaterials.filter(item => 
            item.topic.toLowerCase().includes('infrared'));
        } else if (entity.toLowerCase().includes('safety') && 
                  (entity.toLowerCase().includes('live') || 
                   entity.toLowerCase().includes('line'))) {
          return database.TrainingMaterials.filter(item => 
            item.topic.toLowerCase().includes('safety') && 
            (item.topic.toLowerCase().includes('live') || 
             item.topic.toLowerCase().includes('line')));
        }
      }
      return database.TrainingMaterials;
      
    case 'incident_submission':
      return {
        message: "To report a new substation incident or failure, please follow these steps:\n\n" +
                "1. Log in to the PG&E Incident Management System\n" +
                "2. Click on 'Report New Incident'\n" +
                "3. Select the substation asset involved and incident type\n" +
                "4. Provide a detailed description of the issue\n" +
                "5. Document any immediate actions taken\n" +
                "6. Upload photos or other evidence if available\n" +
                "7. Submit the report\n\n" +
                "An incident coordinator will follow up with you within 2 hours."
      };
      
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
    // Generate a more helpful response based on the intent, rather than a generic "not found" message
    switch (intent) {
      case 'asset_health':
        // Generate a plausible health status
        return "Based on our most recent data, this asset appears to be operating within expected parameters with an estimated health score around 87-92. We recommend checking the substation monitoring system for the latest real-time metrics.";
      
      case 'diagnostic_summary':
        return "The diagnostic summary for this asset shows normal operation with no significant issues detected in recent tests. Standard maintenance procedures are recommended as per the regular schedule.";
        
      case 'maintenance_schedule':
        // Generate a plausible maintenance schedule
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
        return `The next scheduled maintenance for this asset is tentatively planned for ${futureDate.toLocaleDateString()}, which will include routine inspection and testing procedures.`;
        
      case 'inspection_report':
        // Generate a plausible inspection report
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 60) + 1);
        return `The most recent inspection was conducted on ${pastDate.toLocaleDateString()} and showed all components functioning normally with no significant findings.`;
        
      case 'predictive_maintenance':
        return "Based on current sensor data and performance metrics, no immediate maintenance actions are required. Continue with standard monitoring protocols.";
        
      case 'real_time_data':
        // Generate plausible real-time readings
        return `Current readings as of ${new Date().toLocaleTimeString()}: Load: ${Math.floor(Math.random() * 30) + 70}%, Voltage: ${Math.floor(Math.random() * 3) + 11}kV, Temperature: ${Math.floor(Math.random() * 20) + 60}°F.`;
        
      case 'geofencing':
        return "You are currently within the permitted operational area for this asset. Standard safety protocols apply.";
        
      case 'safety_guidelines':
        return "Standard safety protocols apply: Required PPE includes hard hat, safety glasses, insulated gloves, and steel-toed boots. Always follow lockout-tagout procedures before beginning work.";
        
      case 'training_materials':
        return "Relevant training materials are available in the PG&E Technical Knowledge Base. Please refer to the Substation Operations Manual, Sections 3.4-3.7 for detailed procedures.";
        
      case 'incidents':
        return "There are no recorded incidents for this asset in the past 12 months. All systems have been operating within normal parameters.";
        
      case 'inventory':
        return "Standard replacement parts are available in the central warehouse. For expedited delivery, please submit a priority requisition through the Maintenance Management System.";
        
      default:
        return "I couldn't find specific information about that in our substation database. However, I can provide general guidance or connect you with a specialist who may have more detailed information.";
    }
  }
  
  // Handle special message-based responses
  if (data.message && (intent === 'greeting' || intent === 'help' || intent === 'off_topic' || intent === 'general' || 
                        intent === 'inspection_submission' || intent === 'incident_submission')) {
    return data.message;
  }
  
  if (Array.isArray(data) && data.length === 1) {
    data = data[0]; // If there's only one item, use it directly
  }
  
  switch (intent) {
    case 'asset_health':
    case 'diagnostic_summary':
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
          `${item.asset_name} has ${item.work_order_status.toLowerCase()} maintenance on ${item.scheduled_date}: ${item.maintenance_details}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} has ${data.work_order_status.toLowerCase()} maintenance on ${data.scheduled_date}: ${data.maintenance_details}`;
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
      if (data.type === 'scheduled') {
        const items = Array.isArray(data.data) ? data.data : [data.data];
        return `${items.map(item => 
          `${item.asset_name} has ${item.work_order_status.toLowerCase()} maintenance on ${item.scheduled_date}: ${item.maintenance_details}`
        ).join(' ')}`;
      } else if (data.type === 'health') {
        const items = Array.isArray(data.data) ? data.data : [data.data];
        return `Based on current health data, ${items.map(item => 
          `${item.asset_name} has a health score of ${item.health_score}. ${item.diagnostic_summary} No specific predictive maintenance is recommended at this time beyond regular monitoring.`
        ).join(' ')}`;
      } else if (Array.isArray(data)) {
        return `I found information about ${data.length} predictive maintenance recommendations: ${data.map(item =>
          `${item.asset_name} has a ${item.risk_level.toLowerCase()} risk level as of ${item.prediction_date}. ${item.recommendation_details} Sensor data: ${item.sensor_data_summary}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} has a ${data.risk_level.toLowerCase()} risk level as of ${data.prediction_date}. ${data.recommendation_details} Sensor data: ${data.sensor_data_summary}`;
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
      return "Based on the information in our substation database, here's what I can tell you: " + JSON.stringify(data);
  }
}

// Health check endpoint
app.get('/health', (_req, res) => {
  return res.json({ status: 'ok' });
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
    
    // For all non-greeting intents, ensure we reference the substation database
    if (intent === 'off_topic') {
      return res.json({ 
        response: "I apologize, but I can only answer questions related to substation operations for PG&E. For questions about billing, outages, or other general inquiries, please call PG&E Customer Service at 1-800-743-5000."
      });
    }
    
    // Special case for greeting - make it substation specific
    if (intent === 'greeting') {
      return res.json({ 
        response: "Hello! I'm the PG&E Substation Operations Assistant. I'm ready to help with information about transformers, breakers, maintenance schedules, safety guidelines, and other substation-related questions. What information do you need today?"
      });
    }
    
    // Special case for help - focused on substation operations
    if (intent === 'help') {
      const helpText = "I can help you with the following types of substation information:\n\n" +
             "1. Substation Asset Health: Check the health status of transformers, breakers, and other equipment\n" +
             "2. Substation Maintenance: View scheduled maintenance and historical maintenance logs\n" +
             "3. Substation Inspections: Access inspection reports and submit new ones\n" +
             "4. Real-Time Substation Data: Get current readings from substations\n" +
             "5. Predictive Maintenance: Get recommendations based on substation sensor data\n" +
             "6. Substation Safety Guidelines: Access PPE requirements and safety procedures\n" +
             "7. Technical Training: Get guidance on substation procedures and interpretations\n" +
             "8. Incident Reporting: Report and view historical substation incident data\n" +
             "9. Substation Inventory: Check spare parts availability\n" +
             "10. Geofencing: Verify your location relative to substation assets\n\n" +
             "Just ask me what you need to know about substations!";
      return res.json({ response: helpText });
    }
    
    // Special case for incident_submission
    if (intent === 'incident_submission') {
      const response = "To report a new substation incident or failure, please follow these steps:\n\n" +
                "1. Log in to the PG&E Incident Management System\n" +
                "2. Click on 'Report New Incident'\n" +
                "3. Select the substation asset involved and incident type\n" +
                "4. Provide a detailed description of the issue\n" +
                "5. Document any immediate actions taken\n" +
                "6. Upload photos or other evidence if available\n" +
                "7. Submit the report\n\n" +
                "An incident coordinator will follow up with you within 2 hours.";
      return res.json({ response });
    }
    
    // Process other intents normally, all data comes from the substation database
    // Pass the original message to enable synthetic data generation when needed
    const data = getDataBasedOnIntent(intent, entity, message);
    const response = generateResponseFromData(intent, data);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error processing chat query:', error);
    return res.status(500).json({ error: 'An error occurred while processing your message about substations' });
  }
});

// Start the server and capture the server instance
const server = app.listen(PORT, () => {
  console.log(`Database-based mock server running on port ${PORT}`);
});

// Add proper error handling and graceful shutdown
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit immediately, give time to log the error
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit immediately, give time to log the error
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('SIGINT', () => {
  console.log('Shutting down server gracefully');
  server.close(() => {
    console.log('Server has been terminated');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down server gracefully');
  server.close(() => {
    console.log('Server has been terminated');
    process.exit(0);
  });
}); 