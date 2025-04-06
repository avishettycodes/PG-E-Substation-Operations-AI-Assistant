// Database Model Interfaces

// Asset Management
export interface Asset {
  id: string;
  name: string;
  type: string; // 'Transformer', 'Breaker', 'Switchgear', etc.
  location: string;
  substationId: string;
  installationDate: Date;
  manufacturer: string;
  model: string;
  serialNumber: string;
  status: 'Active' | 'Inactive' | 'Maintenance' | 'Decommissioned';
  lastInspectionDate: Date;
  nextScheduledMaintenance: Date;
  healthScore: number; // 0-100
  criticalityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

// Health Diagnostics
export interface HealthDiagnostic {
  id: string;
  assetId: string;
  timestamp: Date;
  source: string; // 'Bentley APM', 'PI', 'TOA', etc.
  healthScore: number;
  temperatureReading: number;
  vibrationLevel: number;
  oilQualityIndex: number;
  dissolvedGasAnalysis: {
    hydrogenPPM: number;
    methanePPM: number;
    ethanePPM: number;
    ethylenePPM: number;
    acetylenePPM: number;
    carbonMonoxidePPM: number;
    carbonDioxidePPM: number;
  };
  moistureContent: number;
  anomaliesDetected: string[];
  notes: string;
}

// Maintenance and Work Orders
export interface WorkOrder {
  id: string;
  assetId: string;
  type: 'Preventive' | 'Corrective' | 'Emergency' | 'Predictive';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  scheduledDate: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  assignedTechnicians: string[]; // Array of employee IDs
  requiredParts: string[]; // Array of part IDs
  requiredTools: string[];
  requiredPPE: string[];
  safetyProcedures: string[];
  notes: string;
  sourceSystem: string; // 'SAP', 'APM', etc.
}

// Maintenance History
export interface MaintenanceRecord {
  id: string;
  workOrderId: string;
  assetId: string;
  completionDate: Date;
  technicians: string[]; // Array of employee IDs
  workPerformed: string;
  findings: string;
  partsReplaced: string[];
  testResults: string;
  duration: number; // in hours
  images: string[]; // URLs to images
  documents: string[]; // URLs to documents
  followUpNeeded: boolean;
  followUpDetails?: string;
}

// Inspection Reports
export interface InspectionReport {
  id: string;
  assetId: string;
  inspectionType: 'Visual' | 'Infrared' | 'Ultrasonic' | 'Oil Analysis' | 'Other';
  inspectionDate: Date;
  inspector: string; // Employee ID
  findings: string;
  conditionRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  recommendations: string;
  images: string[]; // URLs to images
  documents: string[]; // URLs to documents
  followUpRequired: boolean;
  followUpDetails?: string;
  aiGeneratedSummary?: string;
}

// Real-time Sensor Data
export interface SensorData {
  id: string;
  assetId: string;
  timestamp: Date;
  sensorType: string;
  value: number;
  unit: string;
  status: 'Normal' | 'Warning' | 'Alarm';
  source: string; // 'PI', 'SCADA', etc.
}

// Predictive Maintenance Alerts
export interface PredictiveAlert {
  id: string;
  assetId: string;
  generatedDate: Date;
  predictedIssue: string;
  confidenceLevel: number; // 0-100
  recommendedAction: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dataSourcesUsed: string[];
  predictedFailureDate?: Date;
  status: 'New' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'False Alarm';
  resolutionNotes?: string;
}

// Safety and Compliance
export interface SafetyProcedure {
  id: string;
  title: string;
  applicableAssetTypes: string[];
  requiredPPE: string[];
  procedureSteps: string[];
  warningNotes: string[];
  regulatoryReferences: string[];
  lastUpdated: Date;
  approvedBy: string;
  documentUrl: string;
  relatedTraining: string[];
}

// Training and Knowledge Resources
export interface KnowledgeResource {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  applicableAssetTypes: string[];
  documentUrl?: string;
  videoUrl?: string;
  lastUpdated: Date;
  author: string;
  approved: boolean;
}

// Incident Reports
export interface IncidentReport {
  id: string;
  assetId: string;
  reportDate: Date;
  reportedBy: string; // Employee ID
  incidentDate: Date;
  incidentType: 'Equipment Failure' | 'Safety Incident' | 'Near Miss' | 'Other';
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  rootCause?: string;
  correctiveActions?: string[];
  status: 'New' | 'Under Investigation' | 'Resolved' | 'Closed';
  images: string[]; // URLs to images
  documents: string[]; // URLs to documents
  aiCategorization?: string;
  aiSuggestedCauses?: string[];
}

// Inventory and Spare Parts
export interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  applicableAssetTypes: string[];
  quantity: number;
  location: string;
  minimumStock: number;
  supplier: string;
  unitCost: number;
  lastRestockDate: Date;
  onOrder: boolean;
  estimatedArrival?: Date;
  sourceSystem: string; // 'SAP', etc.
}

// Substation Information
export interface Substation {
  id: string;
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  type: string;
  voltage: string;
  assets: string[]; // Array of asset IDs
  currentLoad?: number;
  capacity: number;
  status: 'Operational' | 'Partial Outage' | 'Full Outage' | 'Maintenance';
  geofenceRadius: number; // in meters
}

// Employee Information
export interface Employee {
  id: string;
  name: string;
  role: string;
  qualifications: string[];
  certifications: string[];
  contact: {
    email: string;
    phone: string;
  };
  authorized: boolean;
  authorizationLevel: string;
} 