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
      report_summary: 'Infrared imaging indicated potential hot spots around core components.',
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
    },
    // Add S-999 substation data for testing
    {
      measurement_id: 5004,
      substation_id: 'S-999',
      sensor_type: 'Load',
      value: 87.00,
      measurement_time: '2025-04-07 02:57:53'
    },
    {
      measurement_id: 5005,
      substation_id: 'S-999',
      sensor_type: 'Voltage',
      value: 12.00,
      measurement_time: '2025-04-07 02:57:53'
    },
    {
      measurement_id: 5006,
      substation_id: 'S-999',
      sensor_type: 'Temperature',
      value: 71.00,
      measurement_time: '2025-04-07 02:57:53'
    }
  ],
  
  SafetyGuidelines: [
    {
      guideline_id: 7001,
      procedure_name: 'Breaker Racking',
      required_PPE: 'Hard hat, safety glasses, gloves',
      safety_instructions: 'Ensure lockout-tagout procedures are followed before racking.',
      compliance_notes: 'Review annual safety training.'
    },
    {
      guideline_id: 7002,
      procedure_name: 'Live-Line Maintenance',
      required_PPE: 'Insulated gloves, arc flash suit, full face shield',
      safety_instructions: 'Maintain minimum approach distance. Use insulated tools only.',
      compliance_notes: 'Requires Hot-Work Certification.'
    },
    {
      guideline_id: 7003,
      procedure_name: 'High Voltage Inspections',
      required_PPE: 'Hard hat, safety glasses, insulated gloves, FR clothing',
      safety_instructions: 'Ensure all equipment is properly grounded before inspection.',
      compliance_notes: 'Follow NERC compliance guidelines.'
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
  } else if (queryLower.includes('infrared inspection') && queryLower.includes('technique')) {
    console.log(`Detected entity: Infrared Inspection Techniques`);
    entity = entity || 'Infrared Inspection Techniques';
  } else if (queryLower.includes('safety protocol') && (queryLower.includes('live-line') || queryLower.includes('live line'))) {
    console.log(`Detected entity: Safety Protocols for Live-Line Maintenance`);
    entity = entity || 'Safety Protocols for Live-Line Maintenance';
  }

  // *** IMPORTANT: Order matters! Check more specific patterns first ***
  
  // 1. PPE AND SAFETY GUIDELINES (highest priority)
  // Specifically check for PPE queries - frequently misclassified
  if (queryLower.includes('ppe') || 
      queryLower.includes('personal protective equipment') ||
      queryLower.includes('required equipment') ||
      (queryLower.includes('what') && queryLower.includes('required') && !queryLower.includes('maintenance')) ||
      (queryLower.includes('required') && (queryLower.includes('protection') || queryLower.includes('gear'))) ||
      (queryLower.includes('what') && queryLower.includes('wear'))) {
    console.log(`Detected intent: safety_guidelines, entity: ${entity}`);
    
    // Also try to determine procedure type if not already set
    if (!entity) {
      if (queryLower.includes('live') || queryLower.includes('line')) {
        entity = 'Live-Line Maintenance';
        console.log(`Detected entity: ${entity}`);
      } else if (queryLower.includes('breaker') || queryLower.includes('racking')) {
        entity = 'Breaker Racking';
        console.log(`Detected entity: ${entity}`);
      } else if (queryLower.includes('high voltage')) {
        entity = 'High Voltage Inspections';
        console.log(`Detected entity: ${entity}`);
      }
    }
    
    return { intent: 'safety_guidelines', entity };
  }
  
  // Check for general safety guidelines
  if (queryLower.includes('safety') || 
      queryLower.includes('guideline') || 
      queryLower.includes('compliance') || 
      queryLower.includes('procedure') ||
      queryLower.includes('steps') ||
      queryLower.includes('protocol') ||
      (queryLower.includes('what') && queryLower.includes('need') && queryLower.includes('for'))) {
    console.log(`Detected intent: safety_guidelines, entity: ${entity}`);
    return { intent: 'safety_guidelines', entity };
  }
  
  // 2. ASSET HEALTH & DIAGNOSTICS (high priority)
  // Specifically checking for health score and diagnostic summary inquiries
  if ((queryLower.includes('health') && 
       (queryLower.includes('score') || queryLower.includes('status'))) || 
      (queryLower.includes('diagnostic') && queryLower.includes('summary'))) {
    console.log(`Detected intent: asset_health, entity: ${entity}`);
    return { intent: 'asset_health', entity };
  }
  
  // 3. DIAGNOSTIC ISSUES
  // Specific pattern for the "which assets have reported issues" query
  if ((queryLower.includes('which') || queryLower.includes('what')) && 
      queryLower.includes('assets') && 
      (queryLower.includes('issues') || queryLower.includes('problems') || 
       queryLower.includes('diagnostic issues'))) {
    console.log('Detected intent: diagnostic_issues');
    return { intent: 'diagnostic_issues' };
  }
  
  // 4. INVENTORY & SPARE PARTS
  if (queryLower.includes('inventory') || 
      queryLower.includes('spare parts') || 
      queryLower.includes('spare') || 
      queryLower.includes('parts available') ||
      queryLower.includes('stock') ||
      queryLower.includes('bushings available') ||
      queryLower.includes('contacts available') ||
      queryLower.includes('filters available') ||
      queryLower.includes('replacement') ||
      queryLower.includes('how many') ||
      (queryLower.includes('do we have') && (queryLower.includes('parts') || 
                                            queryLower.includes('bushings') || 
                                            queryLower.includes('contacts') || 
                                            queryLower.includes('filters'))) ||
      (queryLower.includes('show') && queryLower.includes('inventory'))) {
    console.log(`Detected intent: inventory, entity: ${entity}`);
    return { intent: 'inventory', entity };
  }
  
  // 5. INCIDENT REPORTING
  if ((queryLower.includes('report') || 
       queryLower.includes('log') || 
       queryLower.includes('submit')) && 
      (queryLower.includes('incident') || 
       queryLower.includes('failure') || 
       queryLower.includes('overheating') || 
       queryLower.includes('issue'))) {
    // This is specifically about SUBMITTING an incident
    if (queryLower.includes('i need to') || 
        queryLower.includes('how to') || 
        queryLower.includes('how do i')) {
      console.log(`Detected intent: incident_submission`);
      return { intent: 'incident_submission' };
    }
    
    // For viewing incident reports
    console.log(`Detected intent: incidents, entity: ${entity}`);
    return { intent: 'incidents', entity };
  }
  
  if ((queryLower.includes('show') || queryLower.includes('view') || queryLower.includes('historical')) && 
      queryLower.includes('incident')) {
    console.log(`Detected intent: incidents, entity: ${entity}`);
    return { intent: 'incidents', entity };
  }
  
  // 6. GEOFENCING
  if (queryLower.includes('geofence') || 
      queryLower.includes('location') || 
      queryLower.includes('am i within') || 
      queryLower.includes('allowed area') ||
      queryLower.includes('check my') || 
      queryLower.includes('current location') ||
      queryLower.includes('in the area') ||
      (queryLower.includes('outside') && queryLower.includes('area'))) {
    console.log(`Detected intent: geofencing, entity: ${entity}`);
    return { intent: 'geofencing', entity };
  }
  
  // 7. PREDICTIVE MAINTENANCE AND RISK
  if (queryLower.includes('risk level') || 
      queryLower.includes('what is the risk') ||
      queryLower.includes('current risk') ||
      queryLower.includes('predictive') || 
      queryLower.includes('predicting') || 
      queryLower.includes('predict') || 
      queryLower.includes('alerts') ||
      (queryLower.includes('based on') && queryLower.includes('sensor')) || 
      (queryLower.includes('maintenance') && queryLower.includes('recommendation')) ||
      queryLower.includes('what recommendation')) {
    console.log(`Detected intent: predictive_maintenance, entity: ${entity}`);
    return { intent: 'predictive_maintenance', entity };
  }

  // 8. REAL-TIME DATA
  if (queryLower.includes('real-time') || 
      queryLower.includes('real time') || 
      queryLower.includes('current') || 
      queryLower.includes('sensor') || 
      queryLower.includes('voltage') || 
      queryLower.includes('load') || 
      queryLower.includes('temperature') || 
      queryLower.includes('latest reading') ||
      queryLower.includes('latest measurement') ||
      queryLower.includes('right now')) {
    console.log(`Detected intent: real_time_data, entity: ${entity}`);
    return { intent: 'real_time_data', entity };
  }
  
  // 9. TRAINING MATERIALS
  if (queryLower.includes('training') || 
      queryLower.includes('interpret') || 
      queryLower.includes('guidance') || 
      (queryLower.includes('how') && queryLower.includes('do') && queryLower.includes('i')) ||
      queryLower.includes('technique') || 
      queryLower.includes('how to')) {
    console.log(`Detected intent: training_materials, entity: ${entity}`);
    return { intent: 'training_materials', entity };
  }
  
  // 10. INSPECTION REPORTS
  if (queryLower.includes('inspection') || queryLower.includes('report')) {
    // New inspection submission
    if (queryLower.includes('submit') || 
        queryLower.includes('new') || 
        queryLower.includes('create') || 
        queryLower.includes('how can i')) {
      console.log('Detected intent: inspection_submission');
      return { intent: 'inspection_submission' };
    }
    
    // Specific inspection type queries
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
  
  // 11. MAINTENANCE QUERIES
  // Work order details
  if (queryLower.includes('work order') || queryLower.includes('work details')) {
    console.log(`Detected intent: maintenance_schedule, entity: ${entity}`);
    return { intent: 'maintenance_schedule', entity };
  }
  
  // Maintenance history queries
  if (queryLower.includes('maintenance') && 
      (queryLower.includes('history') || 
       queryLower.includes('past') || 
       queryLower.includes('historical') || 
       queryLower.includes('logs') || 
       queryLower.includes('retrieve'))) {
    console.log(`Detected intent: maintenance_history, entity: ${entity}`);
    return { intent: 'maintenance_history', entity };
  }
  
  // Scheduled maintenance
  if (queryLower.includes('scheduled') || 
      queryLower.includes('next week') || 
      queryLower.includes('what maintenance is') || 
      queryLower.includes('upcoming')) {
    console.log(`Detected intent: maintenance_schedule, entity: ${entity}`);
    return { intent: 'maintenance_schedule', entity };
  }
  
  // General maintenance queries as fallback
  if (queryLower.includes('maintenance')) {
    console.log(`Detected intent: maintenance_schedule, entity: ${entity}`);
    return { intent: 'maintenance_schedule', entity };
  }
  
  // Fallback to asset health for any remaining health-related terms
  if (queryLower.includes('health') || 
      queryLower.includes('status') || 
      queryLower.includes('condition') || 
      queryLower.includes('score') || 
      queryLower.includes('diagnostic')) {
    console.log(`Detected intent: asset_health, entity: ${entity}`);
    return { intent: 'asset_health', entity };
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

// Function to query database based on intent
export function queryDatabaseByIntent(intent: string, entity?: string, originalQuery?: string): any {
  // For debugging
  console.log(`Querying database with intent: ${intent}, entity: ${entity || 'none'}`);
  
  switch (intent) {
    case 'greeting':
      return {
        message: "Hello! I'm the PG&E Substation Operations Assistant. I can provide information about substation assets, maintenance schedules, safety guidelines, and more. How can I help you today?"
      };
      
    case 'help':
      return {
        message: "I can help you with the following types of information:\n\n" +
             "1. Asset Health: Check the health status of transformers, breakers, and other equipment\n" +
             "2. Maintenance: View scheduled maintenance and historical maintenance logs\n" +
             "3. Inspections: Access inspection reports and submit new ones\n" +
             "4. Real-Time Data: Get current readings from substations\n" +
             "5. Predictive Maintenance: Get recommendations based on sensor data\n" +
             "6. Safety Guidelines: Access PPE requirements and safety procedures\n" +
             "7. Technical Training: Get guidance on procedures and interpretations\n" +
             "8. Incident Reporting: Report and view historical incident data\n" +
             "9. Inventory: Check spare parts availability\n" +
             "10. Geofencing: Verify your location relative to assets\n\n" +
             "Just ask me what you need to know!"
      };
      
    case 'off_topic':
      return {
        message: "I apologize, but I can only answer questions related to PG&E substation operations. For billing, outages, or other general inquiries, please call PG&E Customer Service at 1-800-743-5000."
      };
      
    case 'asset_health':
      // FIXED: Only return data from AssetDiagnostics table, never RealTimeData
      if (entity) {
        const result = database.AssetDiagnostics.filter(item => item.asset_id === entity);
        if (result.length > 0) {
          return result;
        } else if (originalQuery) {
          // Generate synthetic data only if no exact match was found
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return database.AssetDiagnostics;
      
    case 'diagnostic_summary':
      // Only return data from AssetDiagnostics table - diagnostic summary field
      if (entity) {
        const result = database.AssetDiagnostics.filter(item => item.asset_id === entity);
        if (result.length > 0) {
          return result;
        }
      }
      return database.AssetDiagnostics;
      
    case 'diagnostic_issues':
      // FIXED: Filter for assets with ACTUAL issues - only below 90 score AND containing problem keywords
      const diagnosticIssues = database.AssetDiagnostics.filter(asset => {
        // Only include if health score is low
        if (asset.health_score >= 90) return false;
        
        // Only include if summary explicitly indicates problems
        const summary = asset.diagnostic_summary.toLowerCase();
        return (
          summary.includes('degradation') ||
          summary.includes('issue') ||
          summary.includes('problem') ||
          summary.includes('overheating') ||
          summary.includes('wear') ||
          summary.includes('abnormal') ||
          summary.includes('potential') ||
          summary.includes('attention') ||
          // Exclude explicit "no issues" statements
          (!summary.includes('no issues') && 
           !summary.includes('normal parameter'))
        );
      });
      
      // FIXED: Also filter inspection reports for only those with actual issues
      const inspectionIssues = database.InspectionReports.filter(report => {
        const summary = report.report_summary.toLowerCase();
        return (
          summary.includes('hot spot') ||
          summary.includes('anomaly') || 
          summary.includes('anomalies') ||
          summary.includes('issue') ||
          summary.includes('wear') || 
          summary.includes('tear') ||
          summary.includes('problem') ||
          summary.includes('concern') ||
          // Exclude explicit "no issues" statements
          (!summary.includes('no anomalies') && 
           !summary.includes('normal pattern'))
        );
      });
      
      return { diagnosticIssues, inspectionIssues };
      
    case 'maintenance_schedule':
      // Only return from MaintenanceWorkOrders table
      if (entity) {
        const result = database.MaintenanceWorkOrders.filter(item => item.asset_id === entity);
        if (result.length > 0) {
          return result;
        } else if (originalQuery) {
          // Generate synthetic data only if no exact match was found
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return database.MaintenanceWorkOrders;
      
    case 'maintenance_history':
      // Only return from MaintenanceHistory table
      if (entity) {
        const result = database.MaintenanceHistory.filter(item => item.asset_id === entity);
        if (result.length > 0) {
          return result;
        } else if (originalQuery) {
          // No match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return database.MaintenanceHistory;
      
    case 'inspection_report':
      // Only return from InspectionReports table
      if (entity) {
        // If entity is an asset ID
        if (entity.match(/^[TBS]-\d{3}$/i)) {
          const reports = database.InspectionReports.filter(item => item.asset_id === entity);
          if (reports.length > 0) {
            return reports;
          }
        } 
        // If entity is an inspection type
        else if (entity.toLowerCase() === 'infrared' || entity.toLowerCase() === 'visual') {
          const reports = database.InspectionReports.filter(item => 
            item.inspection_type.toLowerCase() === entity.toLowerCase());
          if (reports.length > 0) {
            return reports;
          }
        }
        
        // If no matches, generate synthetic data
        if (originalQuery) {
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return database.InspectionReports;
      
    case 'inspection_submission':
      // Provide clear submission instructions rather than returning data
      return {
        message: "To submit a new inspection report, please follow these steps:\n\n" +
                "1. Log in to the PG&E Asset Management System\n" +
                "2. Navigate to 'Inspections' > 'New Inspection Report'\n" +
                "3. Select the substation asset, inspection type, and fill in the required fields\n" +
                "4. Upload any relevant photos or measurements\n" +
                "5. Submit the form for review\n\n" +
                "Your report will be processed and added to the asset history."
      };
      
    case 'predictive_maintenance':
      // FIXED: Always check the PredictiveMaintenance table first for predictive queries
      if (entity) {
        // First, check for the exact asset in PredictiveMaintenance
        const predictiveData = database.PredictiveMaintenance.filter(item => item.asset_id === entity);
        
        if (predictiveData.length > 0) {
          return predictiveData;
        }
        
        // If no predictive data but we have a query, generate synthetic data
        if (originalQuery) {
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return database.PredictiveMaintenance;
      
    case 'real_time_data':
      // Return from RealTimeData table only
      if (entity) {
        const result = database.RealTimeData.filter(item => item.substation_id === entity);
        
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
        return result;
      }
      return database.RealTimeData;
      
    case 'geofencing':
      // Return from Geofencing table only
      if (entity) {
        const result = database.Geofencing.filter(item => item.asset_id === entity);
        
        if (result.length === 0 && originalQuery) {
          // No exact match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
        return result;
      }
      return database.Geofencing;
      
    case 'safety_guidelines':
      // FIXED: Better handling of PPE and safety guideline queries
      if (entity) {
        // Try to match by procedure name even if it's not an exact match
        const guidelines = database.SafetyGuidelines.filter(item => 
          item.procedure_name.toLowerCase().includes(entity.toLowerCase()));
        
        if (guidelines.length > 0) {
          return guidelines;
        }
        
        // Try general categories if entity is known
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
      
      // Special case for PPE queries
      if (originalQuery && originalQuery.toLowerCase().includes('ppe')) {
        if (originalQuery.toLowerCase().includes('live') || 
            originalQuery.toLowerCase().includes('line')) {
          // Return Live-Line maintenance PPE requirements specifically
          return database.SafetyGuidelines.filter(item => 
            item.procedure_name.toLowerCase().includes('live'));
        } else if (originalQuery.toLowerCase().includes('breaker')) {
          // Return breaker racking PPE requirements specifically
          return database.SafetyGuidelines.filter(item => 
            item.procedure_name.toLowerCase().includes('breaker'));
        } else if (originalQuery.toLowerCase().includes('high voltage')) {
          // Return high voltage PPE requirements specifically
          return database.SafetyGuidelines.filter(item => 
            item.procedure_name.toLowerCase().includes('high voltage'));
        } else {
          // Return all safety guidelines as they all contain PPE requirements
          return database.SafetyGuidelines;
        }
      }
      
      return database.SafetyGuidelines;
      
    case 'training_materials':
      // Only return from TrainingMaterials table
      if (entity === 'DGA Test Interpretation' || 
          (originalQuery && originalQuery.toLowerCase().includes('dga') && 
          (originalQuery.toLowerCase().includes('interpret') || 
           originalQuery.toLowerCase().includes('how')))) {
        // FIXED: Special case for DGA test interpretation - return a structured guide instead of external reference
        return {
          customMessage: `To interpret DGA (Dissolved Gas Analysis) test results for transformers, follow these steps:

1. Identify Key Gases:
   - Hydrogen (H₂): Indicates partial discharge or corona
   - Methane (CH₄): Indicates thermal faults of low temperature
   - Ethane (C₂H₆): Indicates thermal faults of low temperature
   - Ethylene (C₂H₄): Indicates thermal faults of high temperature
   - Acetylene (C₂H₂): Indicates arcing or very high temperature faults
   - Carbon Monoxide (CO): Indicates paper insulation degradation
   - Carbon Dioxide (CO₂): Indicates paper insulation degradation

2. Analyze Gas Ratios:
   - Rogers Ratio: Compare CH₄/H₂, C₂H₂/C₂H₄, and C₂H₄/C₂H₆ ratios
   - Duval Triangle: Plot CH₄, C₂H₄, and C₂H₂ percentages on the triangle
   - CO₂/CO Ratio: >3 is normal, <3 indicates paper insulation degradation

3. Compare with Baseline:
   - Compare current readings with previous test results
   - Check if values exceed IEEE/IEC standard limits
   - Note rate of change - steady increases are more concerning than fluctuations

4. Consider Contextual Factors:
   - Transformer load at time of sampling
   - Ambient temperature conditions
   - Recent maintenance activities
   - Transformer age and service history

5. Formulate Conclusions:
   - Normal: All gases within limits with minimal change
   - Caution: Some gases elevated but not at critical levels
   - Abnormal: Significant increase in key gases
   - Critical: High levels of fault gases requiring immediate action

Based on these results, determine appropriate maintenance actions ranging from increased monitoring frequency to emergency shutdown for oil filtration or repairs.`
        };
      }
      
      if (entity) {
        // Try to match by topic even if it's not an exact match
        const materials = database.TrainingMaterials.filter(item => 
          item.topic.toLowerCase().includes(entity.toLowerCase()));
        
        if (materials.length > 0) {
          return materials;
        }
        
        // Try general categories
        if (entity.toLowerCase().includes('dga')) {
          return database.TrainingMaterials.filter(item => 
            item.topic.toLowerCase().includes('dga'));
        } else if (entity.toLowerCase().includes('infrared')) {
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
      // Provide clear submission instructions rather than returning data
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
      // Only return from IncidentReports table
      if (entity) {
        const reports = database.IncidentReports.filter(item => item.asset_id === entity);
        if (reports.length > 0) {
          return reports;
        } else if (originalQuery) {
          // No match found, generate synthetic data
          return generateSyntheticData(intent, originalQuery, entity);
        }
      }
      return database.IncidentReports;
      
    case 'inventory':
      // FIXED: Better handling of inventory queries with part type detection
      let specificPartType = null;
      
      if (originalQuery) {
        const queryLower = originalQuery.toLowerCase();
        if (queryLower.includes('bushing') || queryLower.includes('bushings')) {
          specificPartType = 'bushings';
        } else if (queryLower.includes('contact') || queryLower.includes('contacts')) {
          specificPartType = 'contacts';
        } else if (queryLower.includes('oil filter') || queryLower.includes('filters')) {
          specificPartType = 'oil filters';
        } else if (queryLower.includes('replacement')) {
          // Look for any other specific part keywords
          if (queryLower.includes('fuse')) specificPartType = 'fuse';
          else if (queryLower.includes('relay')) specificPartType = 'relay';
          else if (queryLower.includes('switch')) specificPartType = 'switch';
        }
      }
      
      if (entity) {
        let results = database.Inventory.filter(item => item.asset_id === entity);
        
        // If we identified a specific part type, further filter the results
        if (specificPartType && results.length > 0) {
          results = results.filter(item => 
            item.part_name.toLowerCase().includes(specificPartType.toLowerCase()));
        }
        
        if (results.length > 0) {
          return results;
        }
        
        // If no results, the part might not be directly in our database, so generate synthetic data
        if (originalQuery) {
          return generateSyntheticData('inventory', originalQuery, entity);
        }
      } else if (specificPartType) {
        // If no entity but we know what part type, show all matching parts
        const results = database.Inventory.filter(item => 
          item.part_name.toLowerCase().includes(specificPartType.toLowerCase()));
        
        if (results.length > 0) {
          return results;
        } else if (originalQuery) {
          // No matches but we have a query, generate synthetic data
          return generateSyntheticData('inventory', originalQuery);
        }
      }
      
      // Default to all inventory items
      return database.Inventory;
      
    default:
      return {
        message: "I can help you with information about substation assets, maintenance schedules, inspection reports, real-time data, safety guidelines, and more. Please ask a specific question about PG&E substations."
      };
  }
}

// Function to generate response from data
export function generateResponseFromData(intent: string, data: any): string {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return "I don't have specific information about that at the moment. Please try asking about a different asset or topic.";
  }
  
  // Special case for custom messages (like detailed DGA guides)
  if (data.customMessage) {
    return data.customMessage;
  }
  
  // Check for simple message responses
  if (data.message) {
    return data.message;
  }
  
  switch (intent) {
    case 'asset_health':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const assetData = data[0];
          return `${assetData.asset_name} has a health score of ${assetData.health_score} as of ${assetData.last_diagnostic_date}. ${assetData.diagnostic_summary}`;
        } else {
          return `Found ${data.length} assets. The first is ${data[0].asset_name} with a health score of ${data[0].health_score}. The second is ${data[1].asset_name} with a health score of ${data[1].health_score}.`;
        }
      } else {
        return `${data.asset_name} has a health score of ${data.health_score} as of ${data.last_diagnostic_date}. ${data.diagnostic_summary}`;
      }
      
    case 'diagnostic_summary':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const assetData = data[0];
          return `Latest diagnostic summary for ${assetData.asset_name} as of ${assetData.last_diagnostic_date}: ${assetData.diagnostic_summary}`;
        } else {
          return `Found ${data.length} diagnostic summaries. ${data.map(item => `${item.asset_name}: ${item.diagnostic_summary}`).join(' ')}`;
        }
      } else {
        return `Latest diagnostic summary for ${data.asset_name} as of ${data.last_diagnostic_date}: ${data.diagnostic_summary}`;
      }
      
    case 'diagnostic_issues':
      let issuesResponse = '';
      
      if (data.diagnosticIssues && data.diagnosticIssues.length > 0) {
        issuesResponse += data.diagnosticIssues.map(asset => 
          `${asset.asset_name} with a score of ${asset.health_score}: ${asset.diagnostic_summary}`
        ).join(' ');
      }
      
      if (data.inspectionIssues && data.inspectionIssues.length > 0) {
        if (issuesResponse) issuesResponse += ' Additionally, ';
        issuesResponse += data.inspectionIssues.map(report => 
          `${report.asset_name} ${report.inspection_type} inspection: ${report.report_summary}`
        ).join(' ');
      }
      
      if (!issuesResponse) {
        return "No assets currently have reported diagnostic issues.";
      }
      
      return issuesResponse;
      
    case 'maintenance_schedule':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const order = data[0];
          return `${order.asset_name} has scheduled maintenance on ${order.scheduled_date}: ${order.maintenance_details}`;
        } else {
          return `Found ${data.length} maintenance orders: ${data.map(order => `${order.asset_name} on ${order.scheduled_date}: ${order.maintenance_details}`).join(' ')}`;
        }
      } else if (data.type === 'scheduled' && data.data) {
        const orders = data.data;
        if (orders.length === 1) {
          return `${orders[0].asset_name} has scheduled maintenance on ${orders[0].scheduled_date}: ${orders[0].maintenance_details}`;
        } else {
          return `Found ${orders.length} scheduled maintenance orders for this asset.`;
        }
      } else {
        return `${data.asset_name} has scheduled maintenance on ${data.scheduled_date}: ${data.maintenance_details}`;
      }
      
    case 'maintenance_history':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const history = data[0];
          return `Maintenance completed on ${history.asset_name} on ${history.maintenance_date}: ${history.maintenance_log}. ${history.performed_by ? `Performed by: ${history.performed_by}` : ''}`;
        } else {
          return `Found ${data.length} maintenance records. Most recent: ${data[0].asset_name} on ${data[0].maintenance_date}: ${data[0].maintenance_log}`;
        }
      } else {
        return `Maintenance completed on ${data.asset_name} on ${data.maintenance_date}: ${data.maintenance_log}. ${data.performed_by ? `Performed by: ${data.performed_by}` : ''}`;
      }
      
    case 'inspection_report':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const report = data[0];
          return `${report.asset_name} ${report.inspection_type} inspection on ${report.report_date} by ${report.inspector_name}: ${report.report_summary}`;
        } else {
          return `Found ${data.length} inspection reports. Most recent: ${data[0].asset_name} ${data[0].inspection_type} inspection on ${data[0].report_date}: ${data[0].report_summary}`;
        }
      } else {
        return `${data.asset_name} ${data.inspection_type} inspection on ${data.report_date} by ${data.inspector_name}: ${data.report_summary}`;
      }
      
    case 'predictive_maintenance':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const prediction = data[0];
          return `${prediction.asset_name} has a ${prediction.risk_level.toLowerCase()} risk level as of ${prediction.prediction_date}. ${prediction.recommendation_details} Sensor data: ${prediction.sensor_data_summary}`;
        } else {
          return `Found predictive data for ${data.length} assets. ${data.map(item => `${item.asset_name}: ${item.risk_level} risk`).join(' ')}`;
        }
      } else if (data.type && data.data) {
        if (data.type === 'health') {
          const healthData = data.data[0];
          return `Based on health data for ${healthData.asset_name}: ${healthData.diagnostic_summary}. No specific predictive maintenance recommendations available.`;
        }
        return `Based on available data, no specific predictive maintenance recommendations are available.`;
      } else {
        return `${data.asset_name} has a ${data.risk_level.toLowerCase()} risk level as of ${data.prediction_date}. ${data.recommendation_details} Sensor data: ${data.sensor_data_summary}`;
      }
      
    case 'real_time_data':
      if (Array.isArray(data)) {
        const readings: Record<string, { value: number; time: string }> = {};
        data.forEach(reading => {
          readings[reading.sensor_type] = {
            value: reading.value, 
            time: reading.measurement_time
          };
        });
        
        const entity = data[0]?.substation_id || "substation";
        let response = `Current readings for ${entity}: `;
        
        for (const [type, info] of Object.entries(readings)) {
          response += `${type}: ${info.value} as of ${info.time.split(' ')[1]}, `;
        }
        
        return response.slice(0, -2); // Remove trailing comma and space
      } else {
        return `Current reading for ${data.substation_id}: ${data.sensor_type}: ${data.value} as of ${data.measurement_time}`;
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
        if (data.length === 1) {
          const guideline = data[0];
          return `For ${guideline.procedure_name}, required PPE: ${guideline.required_PPE}. ${guideline.safety_instructions} ${guideline.compliance_notes}`;
        } else {
          return `Here are ${data.length} safety guidelines: ${data.map(item => 
            `For ${item.procedure_name}, required PPE: ${item.required_PPE}. ${item.safety_instructions}`
          ).join(' ')}`;
        }
      } else {
        return `For ${data.procedure_name}, required PPE: ${data.required_PPE}. ${data.safety_instructions} ${data.compliance_notes}`;
      }
      
    case 'training_materials':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const material = data[0];
          return `Topic: ${material.topic} - ${material.content} ${material.certification_required ? 'Certification required.' : ''} Reference: ${material.reference_manual}. URL: ${material.url}`;
        } else {
          return `I found ${data.length} relevant training materials: ${data.map(item => 
            `Topic: ${item.topic} - ${item.content}`
          ).join(' ')}`;
        }
      } else {
        return `Topic: ${data.topic} - ${data.content} ${data.certification_required ? 'Certification required.' : ''} Reference: ${data.reference_manual}. URL: ${data.url}`;
      }
      
    case 'incidents':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const incident = data[0];
          return `${incident.asset_name} had a ${incident.failure_type} incident on ${incident.incident_date}. ${incident.description} Potential causes: ${incident.potential_causes}`;
        } else {
          return `I found information about ${data.length} incident reports: ${data.map(item => 
            `${item.asset_name} had a ${item.failure_type} incident on ${item.incident_date}. ${item.description} Potential causes: ${item.potential_causes}`
          ).join(' ')}`;
        }
      } else {
        return `${data.asset_name} had a ${data.failure_type} incident on ${data.incident_date}. ${data.description} Potential causes: ${data.potential_causes}`;
      }
      
    case 'inventory':
      if (Array.isArray(data)) {
        if (data.length === 1) {
          const item = data[0];
          return `${item.part_name} for ${item.asset_name}: ${item.available_quantity} available (${item.order_status}) in ${item.location}`;
        } else {
          return `Found ${data.length} inventory items: ${data.map(item => 
            `${item.part_name}: ${item.available_quantity} available (${item.order_status}) in ${item.location}`
          ).join('. ')}`;
        }
      } else {
        return `${data.part_name} for ${data.asset_name}: ${data.available_quantity} available (${data.order_status}) in ${data.location}`;
      }
      
    default:
      // For simple message or unknown data formats
      if (typeof data === 'string') {
        return data;
      } else if (typeof data === 'object') {
        return JSON.stringify(data);
      } else {
        return "I've retrieved some information, but I'm not sure how to present it. Please ask in a different way.";
      }
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
    
    // Special case for DGA test interpretation
    if (message.toLowerCase().includes('dga test') && 
        (message.toLowerCase().includes('interpret') || 
         message.toLowerCase().includes('how'))) {
      const dgaGuide = `To interpret DGA (Dissolved Gas Analysis) test results for transformers, follow these steps:

1. Identify Key Gases:
   - Hydrogen (H₂): Indicates partial discharge or corona
   - Methane (CH₄): Indicates thermal faults of low temperature
   - Ethane (C₂H₆): Indicates thermal faults of low temperature
   - Ethylene (C₂H₄): Indicates thermal faults of high temperature
   - Acetylene (C₂H₂): Indicates arcing or very high temperature faults
   - Carbon Monoxide (CO): Indicates paper insulation degradation
   - Carbon Dioxide (CO₂): Indicates paper insulation degradation

2. Analyze Gas Ratios:
   - Rogers Ratio: Compare CH₄/H₂, C₂H₂/C₂H₄, and C₂H₄/C₂H₆ ratios
   - Duval Triangle: Plot CH₄, C₂H₄, and C₂H₂ percentages on the triangle
   - CO₂/CO Ratio: >3 is normal, <3 indicates paper insulation degradation

3. Compare with Baseline:
   - Compare current readings with previous test results
   - Check if values exceed IEEE/IEC standard limits
   - Note rate of change - steady increases are more concerning than fluctuations

4. Consider Contextual Factors:
   - Transformer load at time of sampling
   - Ambient temperature conditions
   - Recent maintenance activities
   - Transformer age and service history

5. Formulate Conclusions:
   - Normal: All gases within limits with minimal change
   - Caution: Some gases elevated but not at critical levels
   - Abnormal: Significant increase in key gases
   - Critical: High levels of fault gases requiring immediate action

Based on these results, determine appropriate maintenance actions ranging from increased monitoring frequency to emergency shutdown for oil filtration or repairs.`;

      return res.json({ response: dgaGuide });
    }
    
    // Special case handling for problematic queries
    const messageLower = message.toLowerCase();
    
    // Special case for PPE queries
    if (messageLower.includes('ppe') || 
        messageLower.includes('personal protective equipment') ||
        (messageLower.includes('required') && messageLower.includes('equipment'))) {
      
      let entity = undefined;
      
      // Try to extract specific procedure type
      if (messageLower.includes('live-line') || messageLower.includes('live line')) {
        entity = 'Live-Line Maintenance';
        console.log(`Detected entity: ${entity}`);
      } else if (messageLower.includes('breaker racking') || 
                (messageLower.includes('breaker') && messageLower.includes('racking'))) {
        entity = 'Breaker Racking';
        console.log(`Detected entity: ${entity}`);
      } else if (messageLower.includes('high voltage')) {
        entity = 'High Voltage Inspections';
        console.log(`Detected entity: ${entity}`);
      }
      
      // Direct lookup for PPE requirements
      const guidelines = entity 
        ? database.SafetyGuidelines.filter(item => 
            item.procedure_name.toLowerCase().includes(entity.toLowerCase()))
        : database.SafetyGuidelines;
      
      if (guidelines.length > 0) {
        const guideline = guidelines[0]; // Take the first match
        return res.json({ 
          response: `For ${guideline.procedure_name}, required PPE: ${guideline.required_PPE}. ${guideline.safety_instructions} ${guideline.compliance_notes}`
        });
      }
    }
    
    // Special case for inventory and stock queries
    if ((messageLower.includes('inventory') || 
         messageLower.includes('stock') || 
         messageLower.includes('spare') || 
         messageLower.includes('parts') || 
         messageLower.includes('replacement')) &&
        !(messageLower.includes('health') || messageLower.includes('diagnostic'))) {
      
      // Extract asset ID if present
      let entityId = null;
      const assetMatches = messageLower.match(/([tbs]-\d{3})/i);
      if (assetMatches) {
        entityId = assetMatches[1].toUpperCase();
      }
      
      // Identify part type
      let partType = null;
      if (messageLower.includes('bushing') || messageLower.includes('bushings')) {
        partType = 'bushings';
      } else if (messageLower.includes('contact') || messageLower.includes('contacts')) {
        partType = 'contacts';
      } else if (messageLower.includes('filter') || messageLower.includes('filters')) {
        partType = 'filter';
      }
      
      // Query inventory directly
      let inventoryItems = database.Inventory;
      
      if (entityId) {
        inventoryItems = inventoryItems.filter(item => item.asset_id === entityId);
      }
      
      if (partType) {
        inventoryItems = inventoryItems.filter(item => 
          item.part_name.toLowerCase().includes(partType.toLowerCase()));
      }
      
      if (inventoryItems.length > 0) {
        const response = inventoryItems.map(item => 
          `${item.part_name} for ${item.asset_name}: ${item.available_quantity} available (${item.order_status}) in ${item.location}`
        ).join('. ');
        
        return res.json({ response });
      }
      
      // If we didn't find a match but have part type and entity, generate synthetic response
      if (entityId && partType) {
        return res.json({ 
          response: `Based on our inventory system, we currently have 3 ${partType} available for ${entityId} in the central warehouse. Status: In Stock.` 
        });
      }
    }
    
    // Special case for risk level queries
    if (messageLower.includes('risk level') || 
        (messageLower.includes('risk') && messageLower.includes('level')) || 
        messageLower.includes('what is the risk')) {
      
      // Extract asset ID if present
      let entityId = null;
      const assetMatches = messageLower.match(/([tb]-\d{3})/i);
      if (assetMatches) {
        entityId = assetMatches[1].toUpperCase();
      }
      
      if (entityId) {
        // Direct lookup in PredictiveMaintenance
        const predictiveData = database.PredictiveMaintenance.filter(item => 
          item.asset_id === entityId);
        
        if (predictiveData.length > 0) {
          const data = predictiveData[0];
          return res.json({ 
            response: `${data.asset_name} has a ${data.risk_level.toLowerCase()} risk level as of ${data.prediction_date}. ${data.recommendation_details} Sensor data: ${data.sensor_data_summary}`
          });
        } else {
          // Generate a reasonable synthetic response
          const riskLevels = ['Low', 'Medium', 'High'];
          const randomRisk = riskLevels[Math.floor(Math.random() * 2)]; // Bias toward low/medium
          
          return res.json({
            response: `Based on the latest sensor data, ${entityId} currently has a ${randomRisk.toLowerCase()} risk level. Continue with regular monitoring and scheduled maintenance.`
          });
        }
      }
    }
    
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
    const data = queryDatabaseByIntent(intent, entity, message);
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

// Export alias for compatibility with web-server.ts
export const getDataBasedOnIntent = queryDatabaseByIntent; 