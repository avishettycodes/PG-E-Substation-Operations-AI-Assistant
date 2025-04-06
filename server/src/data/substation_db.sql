-- PG&E Substation Operations Assistant Database Schema

-- Create tables for storing substation operations data

-- 1. Asset Health & Diagnostics Inquiry
CREATE TABLE IF NOT EXISTS AssetDiagnostics (
    diagnostic_id INTEGER PRIMARY KEY,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    health_score REAL NOT NULL,
    last_diagnostic_date DATETIME NOT NULL,
    diagnostic_summary TEXT NOT NULL,
    data_source TEXT NOT NULL
);

-- 2. Maintenance & Work Order Assistance
CREATE TABLE IF NOT EXISTS MaintenanceWorkOrders (
    work_order_id INTEGER PRIMARY KEY,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    maintenance_details TEXT NOT NULL,
    work_order_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS MaintenanceHistory (
    history_id INTEGER PRIMARY KEY,
    work_order_id INTEGER,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_log TEXT NOT NULL,
    FOREIGN KEY (work_order_id) REFERENCES MaintenanceWorkOrders(work_order_id)
);

-- 3. Inspection Report Lookup & Submission
CREATE TABLE IF NOT EXISTS InspectionReports (
    inspection_id INTEGER PRIMARY KEY,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    inspection_type TEXT NOT NULL,
    report_date DATE NOT NULL,
    report_summary TEXT NOT NULL,
    inspector_name TEXT NOT NULL
);

-- 4. Predictive Maintenance Recommendations
CREATE TABLE IF NOT EXISTS PredictiveMaintenance (
    recommendation_id INTEGER PRIMARY KEY,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    prediction_date DATE NOT NULL,
    risk_level TEXT NOT NULL,
    recommendation_details TEXT NOT NULL,
    sensor_data_summary TEXT NOT NULL
);

-- 5. Real-time Data Query from PI & SCADA
CREATE TABLE IF NOT EXISTS RealTimeData (
    data_id INTEGER PRIMARY KEY,
    substation_id TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value REAL NOT NULL,
    measurement_time DATETIME NOT NULL
);

-- 6. Geofencing & Remote Assistance
CREATE TABLE IF NOT EXISTS Geofencing (
    geofence_id INTEGER PRIMARY KEY,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    location TEXT NOT NULL,
    allowed_radius INTEGER NOT NULL,
    current_employee_location TEXT NOT NULL,
    in_geofence BOOLEAN NOT NULL,
    remote_assistance_instructions TEXT NOT NULL
);

-- 7. Compliance & Safety Guidance
CREATE TABLE IF NOT EXISTS SafetyGuidelines (
    guideline_id INTEGER PRIMARY KEY,
    procedure_name TEXT NOT NULL,
    required_PPE TEXT NOT NULL,
    safety_instructions TEXT NOT NULL,
    compliance_notes TEXT NOT NULL
);

-- 8. Training & Knowledge Assistance
CREATE TABLE IF NOT EXISTS TrainingMaterials (
    training_id INTEGER PRIMARY KEY,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    certification_required BOOLEAN NOT NULL,
    reference_manual TEXT NOT NULL,
    url TEXT NOT NULL
);

-- 9. Incident & Failure Reporting
CREATE TABLE IF NOT EXISTS IncidentReports (
    incident_id INTEGER PRIMARY KEY,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    incident_date DATE NOT NULL,
    failure_type TEXT NOT NULL,
    description TEXT NOT NULL,
    logged_by TEXT NOT NULL,
    category TEXT NOT NULL,
    potential_causes TEXT NOT NULL
);

-- 10. Inventory & Spare Parts Lookup
CREATE TABLE IF NOT EXISTS Inventory (
    part_id INTEGER PRIMARY KEY,
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    part_name TEXT NOT NULL,
    available_quantity INTEGER NOT NULL,
    order_status TEXT NOT NULL,
    location TEXT NOT NULL
);

-- Insert sample data

-- 1. Asset Health & Diagnostics Inquiry
INSERT INTO AssetDiagnostics (diagnostic_id, asset_id, asset_name, health_score, last_diagnostic_date, diagnostic_summary, data_source) VALUES
(1, 'T-123', 'Transformer T-123', 92.50, '2025-04-05 08:30:00', 'No issues detected. Operating within normal parameters.', 'Bentley APM'),
(2, 'B-456', 'Breaker B-456', 85.00, '2025-04-04 14:20:00', 'Minor degradation detected in switch contacts.', 'PI'),
(3, 'T-789', 'Transformer T-789', 78.30, '2025-04-03 10:15:00', 'Temperature trends indicate potential overheating.', 'TOA');

-- 2. Maintenance & Work Order Assistance
INSERT INTO MaintenanceWorkOrders (work_order_id, asset_id, asset_name, scheduled_date, maintenance_details, work_order_status) VALUES
(1001, 'T-123', 'Transformer T-123', '2025-04-10', 'Routine transformer maintenance including oil testing.', 'Scheduled'),
(1002, 'S-567', 'Substation S-567', '2025-04-11', 'Inspection and cleaning of electrical panels.', 'Scheduled'),
(1003, 'B-456', 'Breaker B-456', '2025-04-09', 'Replace worn contacts and perform operational tests.', 'In Progress');

-- Historical Maintenance Logs for Work Orders
INSERT INTO MaintenanceHistory (history_id, work_order_id, asset_id, asset_name, maintenance_date, maintenance_log) VALUES
(2001, 1001, 'T-123', 'Transformer T-123', '2025-03-15', 'Performed oil analysis and replaced filters. No issues found.'),
(2002, 1003, 'B-456', 'Breaker B-456', '2025-03-20', 'Cleaned contacts and tested operation. Recommended follow-up inspection.'),
(2003, 1001, 'T-123', 'Transformer T-123', '2025-02-10', 'Routine maintenance completed; performance within norms.');

-- 3. Inspection Report Lookup & Submission
INSERT INTO InspectionReports (inspection_id, asset_id, asset_name, inspection_type, report_date, report_summary, inspector_name) VALUES
(3001, 'T-789', 'Transformer T-789', 'Infrared', '2025-04-01', 'Infrared imaging indicates potential hot spots around core components.', 'John Doe'),
(3002, 'B-456', 'Breaker B-456', 'Visual', '2025-03-28', 'Visual inspection revealed minor wear and tear on casing.', 'Jane Smith'),
(3003, 'T-123', 'Transformer T-123', 'Infrared', '2025-03-30', 'Thermal patterns are normal, no anomalies detected.', 'Alice Johnson');

-- 4. Predictive Maintenance Recommendations
INSERT INTO PredictiveMaintenance (recommendation_id, asset_id, asset_name, prediction_date, risk_level, recommendation_details, sensor_data_summary) VALUES
(4001, 'T-123', 'Transformer T-123', '2025-04-06', 'Medium', 'Consider scheduling a detailed oil analysis soon due to slight thermal drift.', 'Oil temperature trending upwards.'),
(4002, 'T-789', 'Transformer T-789', '2025-04-06', 'High', 'Immediate inspection recommended due to high thermal readings and abnormal vibration levels.', 'Thermal and vibration sensors indicate risk.'),
(4003, 'B-456', 'Breaker B-456', '2025-04-06', 'Low', 'No immediate action needed, monitor the switch contacts for further degradation.', 'Normal operation with slight contact wear.');

-- 5. Real-time Data Query from PI & SCADA
INSERT INTO RealTimeData (data_id, substation_id, sensor_type, value, measurement_time) VALUES
(5001, 'S-567', 'Load', 75.50, '2025-04-05 09:00:00'),
(5002, 'S-567', 'Voltage', 11.50, '2025-04-05 09:00:00'),
(5003, 'S-567', 'Temperature', 65.00, '2025-04-05 09:00:00');

-- 6. Geofencing & Remote Assistance
INSERT INTO Geofencing (geofence_id, asset_id, asset_name, location, allowed_radius, current_employee_location, in_geofence, remote_assistance_instructions) VALUES
(6001, 'S-567', 'Substation S-567', 'Downtown Facility', 100, 'Downtown Facility - Gate A', 1, 'No remote assistance needed.'),
(6002, 'T-123', 'Transformer T-123', 'North Substation', 150, 'North Substation - Main Entrance', 1, 'If outside geofence, call dispatch for guidance.'),
(6003, 'B-456', 'Breaker B-456', 'East Substation', 100, 'Parking Lot', 0, 'Employee is outside the allowed area; contact supervisor.');

-- 7. Compliance & Safety Guidance
INSERT INTO SafetyGuidelines (guideline_id, procedure_name, required_PPE, safety_instructions, compliance_notes) VALUES
(7001, 'Live-Line Maintenance', 'Insulated gloves, arc flash suit, helmet', 'Always de-energize equipment before performing maintenance.', 'Follow NFPA 70E guidelines.'),
(7002, 'Breaker Racking', 'Hard hat, safety glasses, gloves', 'Ensure lockout-tagout procedures are followed before racking.', 'Review annual safety training.'),
(7003, 'High Voltage Inspections', 'Insulated gloves, dielectric boots, face shield', 'Maintain a safe distance and use appropriate barriers.', 'Compliance with OSHA regulations required.');

-- 8. Training & Knowledge Assistance
INSERT INTO TrainingMaterials (training_id, topic, content, certification_required, reference_manual, url) VALUES
(8001, 'DGA Test Interpretation', 'Detailed guide on interpreting dissolved gas analysis for transformers.', 1, 'Transformer Maintenance Manual, Chapter 5', 'http://example.com/dga-guide'),
(8002, 'Infrared Inspection Techniques', 'Best practices for conducting infrared inspections on electrical equipment.', 0, 'Infrared Inspection Handbook', 'http://example.com/ir-handbook'),
(8003, 'Safety Protocols for Live-Line Maintenance', 'Step-by-step procedures for safely performing live-line maintenance.', 1, 'Live-Line Safety Manual', 'http://example.com/live-line-safety');

-- 9. Incident & Failure Reporting
INSERT INTO IncidentReports (incident_id, asset_id, asset_name, incident_date, failure_type, description, logged_by, category, potential_causes) VALUES
(9001, 'T-123', 'Transformer T-123', '2025-04-04', 'Overheating', 'Transformer experienced abnormal temperature rise leading to a shutdown.', 'John Doe', 'Thermal', 'Oil degradation, blocked cooling fins'),
(9002, 'B-456', 'Breaker B-456', '2025-04-03', 'Mechanical Failure', 'Breaker failed to operate correctly during routine testing.', 'Jane Smith', 'Mechanical', 'Wear and tear on contacts'),
(9003, 'T-789', 'Transformer T-789', '2025-04-02', 'Insulation Failure', 'Transformer insulation degraded over time causing intermittent faults.', 'Alice Johnson', 'Electrical', 'Aging, environmental stress');

-- 10. Inventory & Spare Parts Lookup
INSERT INTO Inventory (part_id, asset_id, asset_name, part_name, available_quantity, order_status, location) VALUES
(10001, 'T-987', 'Transformer T-987', 'Bushings', 5, 'In Stock', 'Warehouse A'),
(10002, 'B-456', 'Breaker B-456', 'Replacement Contacts', 2, 'Ordered', 'Warehouse B'),
(10003, 'T-123', 'Transformer T-123', 'Oil Filters', 10, 'In Stock', 'Warehouse A'); 