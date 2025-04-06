// Database integration module for PG&E Substation Operations AI Assistant

// Define the database structure with mock data
export const substationDatabase = {
  assets: {
    transformers: {
      "T-123": {
        health: {
          score: 92.5,
          lastDiagnostic: "2025-04-05",
          issues: []
        },
        maintenance: [
          {
            date: "2025-03-15",
            type: "Routine",
            details: "Oil sample analysis and filter change."
          },
          {
            date: "2024-11-22",
            type: "Repair",
            details: "Replaced gasket due to minor oil leak."
          }
        ],
        spareParts: {
          bushings: { count: 2, location: "Warehouse B" },
          oilFilters: { count: 10, location: "Warehouse B" }
        }
      },
      "T-789": {
        health: {
          score: 78.3,
          lastDiagnostic: "2025-03-29",
          issues: ["Elevated dissolved gas levels"]
        },
        inspections: [
          {
            date: "2025-04-01",
            type: "Infrared",
            inspector: "John Doe",
            findings: "Infrared imaging indicates potential hot spots around core components."
          }
        ]
      },
      "T-987": {
        spareParts: {
          bushings: { count: 5, location: "Warehouse A" }
        }
      }
    },
    breakers: {
      "B-456": {
        health: {
          score: 85.6,
          lastDiagnostic: "2025-03-25",
          issues: ["Slow closing time"]
        },
        workOrders: [
          {
            id: "WO-1234",
            status: "Open",
            details: "Investigate slow closing time reported during testing."
          }
        ],
        inspections: [
          {
            date: "2025-03-20",
            type: "Visual",
            inspector: "Jane Smith",
            findings: "Signs of wear on contacts, recommended for replacement within 3 months."
          }
        ],
        spareParts: {
          contacts: { count: 12, location: "Central Store" }
        }
      }
    }
  },
  substations: {
    "S-567": {
      scheduledMaintenance: [
        {
          date: "2025-04-11",
          status: "Scheduled",
          details: "Inspection and cleaning of electrical panels."
        }
      ],
      realTimeData: {
        load: { value: 75.5, timestamp: "9:00:00 AM" },
        voltage: { value: 11.5, timestamp: "9:00:00 AM" },
        temperature: { value: 65, timestamp: "9:00:00 AM" }
      }
    }
  },
  safety: {
    guidelines: [
      {
        topic: "Live-Line Maintenance",
        ppe: "Insulated gloves, arc flash suit, helmet",
        procedures: "Always de-energize equipment before performing maintenance. Follow NFPA 70E guidelines."
      },
      {
        topic: "Breaker Racking",
        ppe: "Hard hat, safety glasses, gloves",
        procedures: "Ensure lockout-tagout procedures are followed before racking. Review annual safety training."
      },
      {
        topic: "High Voltage Inspections",
        ppe: "Arc flash face shield, insulated gloves, FR clothing",
        procedures: "Keep minimum approach distances. Verify equipment is de-energized. Certification required."
      }
    ]
  }
};

// Function to extract intent and entities from user message
export function extractIntent(message: string): { intent: string, entities: any } {
  const message_lower = message.toLowerCase();
  
  // Extract intent and entities based on keywords in the message
  let intent = "unknown";
  const entities: any = {};
  
  // Asset Health
  if (message_lower.includes("health") || message_lower.includes("diagnostic") || message_lower.includes("condition")) {
    intent = "assetHealth";
    
    // Extract asset ID if present
    const transformerMatch = message_lower.match(/transformer\s+(t-\d+)/i);
    const breakerMatch = message_lower.match(/breaker\s+(b-\d+)/i);
    
    if (transformerMatch) {
      entities.assetType = "transformer";
      entities.assetId = transformerMatch[1].toUpperCase();
    } else if (breakerMatch) {
      entities.assetType = "breaker";
      entities.assetId = breakerMatch[1].toUpperCase();
    }
  }
  
  // Maintenance
  else if (message_lower.includes("maintenance") || message_lower.includes("scheduled") || 
           message_lower.includes("work order") || message_lower.includes("historical maintenance")) {
    intent = "maintenance";
    
    // Extract asset or substation ID if present
    const transformerMatch = message_lower.match(/transformer\s+(t-\d+)/i);
    const breakerMatch = message_lower.match(/breaker\s+(b-\d+)/i);
    const substationMatch = message_lower.match(/substation\s+(s-\d+)/i);
    
    if (transformerMatch) {
      entities.assetType = "transformer";
      entities.assetId = transformerMatch[1].toUpperCase();
    } else if (breakerMatch) {
      entities.assetType = "breaker";
      entities.assetId = breakerMatch[1].toUpperCase();
    } else if (substationMatch) {
      entities.assetType = "substation";
      entities.assetId = substationMatch[1].toUpperCase();
    }
    
    // Extract time frame if present
    if (message_lower.includes("next week")) {
      entities.timeFrame = "nextWeek";
    } else if (message_lower.includes("historical") || message_lower.includes("history")) {
      entities.timeFrame = "historical";
    }
  }
  
  // Inspections
  else if (message_lower.includes("inspection") || message_lower.includes("report")) {
    intent = "inspection";
    
    // Extract asset ID if present
    const transformerMatch = message_lower.match(/transformer\s+(t-\d+)/i);
    const breakerMatch = message_lower.match(/breaker\s+(b-\d+)/i);
    
    if (transformerMatch) {
      entities.assetType = "transformer";
      entities.assetId = transformerMatch[1].toUpperCase();
    } else if (breakerMatch) {
      entities.assetType = "breaker";
      entities.assetId = breakerMatch[1].toUpperCase();
    }
    
    // Extract inspection type if present
    if (message_lower.includes("infrared")) {
      entities.inspectionType = "infrared";
    } else if (message_lower.includes("visual")) {
      entities.inspectionType = "visual";
    }
  }
  
  // Real-time data
  else if (message_lower.includes("current") || message_lower.includes("load") || 
           message_lower.includes("voltage") || message_lower.includes("temperature") ||
           message_lower.includes("reading")) {
    intent = "realTimeData";
    
    // Extract substation ID if present
    const substationMatch = message_lower.match(/substation\s+(s-\d+)/i);
    if (substationMatch) {
      entities.substationId = substationMatch[1].toUpperCase();
    }
    
    // Extract data type if present
    if (message_lower.includes("load")) {
      entities.dataType = "load";
    } else if (message_lower.includes("voltage")) {
      entities.dataType = "voltage";
    } else if (message_lower.includes("temperature")) {
      entities.dataType = "temperature";
    }
  }
  
  // Safety guidelines
  else if (message_lower.includes("safety") || message_lower.includes("ppe") || 
           message_lower.includes("guidelines") || message_lower.includes("procedures")) {
    intent = "safetyGuidelines";
    
    // Extract specific safety topic
    if (message_lower.includes("live-line") || message_lower.includes("live line")) {
      entities.topic = "Live-Line Maintenance";
    } else if (message_lower.includes("breaker racking")) {
      entities.topic = "Breaker Racking";
    } else if (message_lower.includes("high voltage")) {
      entities.topic = "High Voltage Inspections";
    }
  }
  
  // Spare parts and inventory
  else if (message_lower.includes("spare") || message_lower.includes("parts") || 
           message_lower.includes("inventory") || message_lower.includes("stock") ||
           message_lower.includes("available")) {
    intent = "spareParts";
    
    // Extract asset ID if present
    const transformerMatch = message_lower.match(/transformer\s+(t-\d+)/i);
    const breakerMatch = message_lower.match(/breaker\s+(b-\d+)/i);
    
    if (transformerMatch) {
      entities.assetType = "transformer";
      entities.assetId = transformerMatch[1].toUpperCase();
    } else if (breakerMatch) {
      entities.assetType = "breaker";
      entities.assetId = breakerMatch[1].toUpperCase();
    }
    
    // Extract part type if present
    if (message_lower.includes("bushing")) {
      entities.partType = "bushings";
    } else if (message_lower.includes("contact")) {
      entities.partType = "contacts";
    } else if (message_lower.includes("oil filter")) {
      entities.partType = "oilFilters";
    }
  }
  
  return { intent, entities };
}

// Function to generate response based on intent and entities
export function generateDatabaseResponse(intent: string, entities: any): string {
  switch (intent) {
    case "assetHealth":
      return getAssetHealthResponse(entities);
    case "maintenance":
      return getMaintenanceResponse(entities);
    case "inspection":
      return getInspectionResponse(entities);
    case "realTimeData":
      return getRealTimeDataResponse(entities);
    case "safetyGuidelines":
      return getSafetyGuidelinesResponse(entities);
    case "spareParts":
      return getSparePartsResponse(entities);
    default:
      return getDefaultResponse();
  }
}

// Functions for generating specific responses

function getAssetHealthResponse(entities: any): string {
  if (entities.assetType === "transformer" && entities.assetId) {
    const transformer = substationDatabase.assets.transformers[entities.assetId];
    if (transformer && transformer.health) {
      const health = transformer.health;
      const issues = health.issues.length > 0 
        ? `Issues detected: ${health.issues.join(", ")}.` 
        : "No issues detected.";
      
      return `${entities.assetId} has a health score of ${health.score}. Last diagnostic on ${health.lastDiagnostic}. ${issues} Operating within normal parameters.`;
    }
  } else if (entities.assetType === "breaker" && entities.assetId) {
    const breaker = substationDatabase.assets.breakers[entities.assetId];
    if (breaker && breaker.health) {
      const health = breaker.health;
      const issues = health.issues.length > 0 
        ? `Issues detected: ${health.issues.join(", ")}.` 
        : "No issues detected.";
      
      return `${entities.assetId} has a health score of ${health.score}. Last diagnostic on ${health.lastDiagnostic}. ${issues}`;
    }
  }
  
  return "Asset health information not found. Please check the asset ID and try again.";
}

function getMaintenanceResponse(entities: any): string {
  if (entities.assetType === "transformer" && entities.assetId) {
    const transformer = substationDatabase.assets.transformers[entities.assetId];
    if (transformer && transformer.maintenance) {
      if (entities.timeFrame === "historical") {
        const maintenanceHistory = transformer.maintenance.map(m => 
          `${m.date} (${m.type}): ${m.details}`
        ).join("; ");
        
        return `Maintenance history for ${entities.assetId}: ${maintenanceHistory}`;
      }
    }
  } else if (entities.assetType === "breaker" && entities.assetId) {
    const breaker = substationDatabase.assets.breakers[entities.assetId];
    if (breaker && breaker.workOrders) {
      const workOrders = breaker.workOrders.map(wo => 
        `${wo.id} (${wo.status}): ${wo.details}`
      ).join("; ");
      
      return `Work orders for ${entities.assetId}: ${workOrders}`;
    }
  } else if (entities.assetType === "substation" && entities.assetId) {
    const substation = substationDatabase.substations[entities.assetId];
    if (substation && substation.scheduledMaintenance) {
      const maintenanceTasks = substation.scheduledMaintenance
        .filter(m => entities.timeFrame !== "nextWeek" || new Date(m.date) > new Date())
        .map(m => `${entities.assetId} has maintenance scheduled for ${m.date} (${m.status}). Details: ${m.details}`);
      
      if (maintenanceTasks.length > 0) {
        return `I found ${maintenanceTasks.length} scheduled maintenance tasks: ${maintenanceTasks.join("; ")}`;
      } else {
        return `No maintenance is currently scheduled for ${entities.assetId}${entities.timeFrame === "nextWeek" ? " next week" : ""}.`;
      }
    }
  }
  
  return "Maintenance information not found. Please check the asset ID and time frame.";
}

function getInspectionResponse(entities: any): string {
  if (entities.assetType === "transformer" && entities.assetId) {
    const transformer = substationDatabase.assets.transformers[entities.assetId];
    if (transformer && transformer.inspections) {
      const inspections = transformer.inspections.filter(i => 
        !entities.inspectionType || i.type.toLowerCase() === entities.inspectionType.toLowerCase()
      );
      
      if (inspections.length > 0) {
        const inspection = inspections[0]; // Get the most recent one
        return `${entities.assetId} ${inspection.type} inspection on ${inspection.date} by ${inspection.inspector}: ${inspection.findings}`;
      }
    }
  } else if (entities.assetType === "breaker" && entities.assetId) {
    const breaker = substationDatabase.assets.breakers[entities.assetId];
    if (breaker && breaker.inspections) {
      const inspections = breaker.inspections.filter(i => 
        !entities.inspectionType || i.type.toLowerCase() === entities.inspectionType.toLowerCase()
      );
      
      if (inspections.length > 0) {
        const inspection = inspections[0]; // Get the most recent one
        return `${entities.assetId} ${inspection.type} inspection on ${inspection.date} by ${inspection.inspector}: ${inspection.findings}`;
      }
    }
  }
  
  return "Inspection report not found. Please check the asset ID and inspection type.";
}

function getRealTimeDataResponse(entities: any): string {
  if (entities.substationId) {
    const substation = substationDatabase.substations[entities.substationId];
    if (substation && substation.realTimeData) {
      const data = substation.realTimeData;
      
      if (entities.dataType) {
        const dataPoint = data[entities.dataType];
        if (dataPoint) {
          return `Current ${entities.dataType} for ${entities.substationId}: ${dataPoint.value} as of ${dataPoint.timestamp}`;
        }
      } else {
        // Return all data points
        const dataPoints = Object.entries(data).map(([key, value]: [string, any]) => 
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.value} as of ${value.timestamp}`
        ).join(", ");
        
        return `Current readings for ${entities.substationId}: ${dataPoints}`;
      }
    }
  }
  
  return "Real-time data not available. Please check the substation ID.";
}

function getSafetyGuidelinesResponse(entities: any): string {
  const guidelines = substationDatabase.safety.guidelines;
  
  if (entities.topic) {
    const guideline = guidelines.find(g => g.topic === entities.topic);
    if (guideline) {
      return `For ${guideline.topic}, required PPE: ${guideline.ppe}. ${guideline.procedures}`;
    }
  } else {
    // Return all safety guidelines
    const allGuidelines = guidelines.map(g => 
      `For ${g.topic}, required PPE: ${g.ppe}. ${g.procedures}`
    ).join(" ");
    
    return `Here are ${guidelines.length} safety guidelines: ${allGuidelines}`;
  }
  
  return "Safety guidelines not found. Please specify a safety topic.";
}

function getSparePartsResponse(entities: any): string {
  if (entities.assetType === "transformer" && entities.assetId) {
    const transformer = substationDatabase.assets.transformers[entities.assetId];
    if (transformer && transformer.spareParts) {
      if (entities.partType && transformer.spareParts[entities.partType]) {
        const part = transformer.spareParts[entities.partType];
        const availability = part.count > 0 ? "In Stock" : "Out of Stock";
        return `${entities.partType.charAt(0).toUpperCase() + entities.partType.slice(1)} for ${entities.assetId}: ${part.count} available (${availability}) in ${part.location}`;
      } else {
        // Return all spare parts
        const parts = Object.entries(transformer.spareParts).map(([key, value]: [string, any]) => 
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.count} in ${value.location}`
        ).join(", ");
        
        return `Spare parts for ${entities.assetId}: ${parts}`;
      }
    }
  } else if (entities.assetType === "breaker" && entities.assetId) {
    const breaker = substationDatabase.assets.breakers[entities.assetId];
    if (breaker && breaker.spareParts) {
      if (entities.partType && breaker.spareParts[entities.partType]) {
        const part = breaker.spareParts[entities.partType];
        const availability = part.count > 0 ? "In Stock" : "Out of Stock";
        return `${entities.partType.charAt(0).toUpperCase() + entities.partType.slice(1)} for ${entities.assetId}: ${part.count} available (${availability}) in ${part.location}`;
      } else {
        // Return all spare parts
        const parts = Object.entries(breaker.spareParts).map(([key, value]: [string, any]) => 
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.count} in ${value.location}`
        ).join(", ");
        
        return `Spare parts for ${entities.assetId}: ${parts}`;
      }
    }
  }
  
  return "Spare parts information not found. Please check the asset ID and part type.";
}

function getDefaultResponse(): string {
  return "I understand you're looking for information about substation operations. Can you please specify what type of information you need? For example, you can ask about asset health, maintenance schedules, or safety guidelines.";
} 