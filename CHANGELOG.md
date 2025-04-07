# Changelog

All notable changes to the PG&E Substation Operations AI Assistant will be documented in this file.

## [1.1.0] - 2025-04-07

### Added
- Enhanced casual greeting support with comprehensive pattern matching
- New testing script (`test-api.sh`) for verifying API functionality
- Dynamic synthetic data generation for substations
- Complete HTML interface matching the official PG&E website design
- Additional UI images for improved visual experience
- Support for rejecting personal questions with appropriate responses
- Added S-999 substation with real-time data to the database

### Changed
- Updated port from `4477` to `7777` for consistency
- Fixed TypeScript errors in multiple files
- Improved error handling across the application
- Updated `README.md` with new features and port information
- Enhanced greeting detection in data-integration.ts with regex pattern matching
- Added comprehensive support for casual greetings and personal question rejection

### Fixed
- Resolved TypeScript compilation errors in server code
- Fixed greeting detection logic to handle various formats
- Improved server procedures for query handling
- Updated testing script to use the correct port number
- Consolidated intent detection in data-integration.ts

## [1.0.0] - 2025-04-01

### Added
- Initial release of the PG&E Substation Operations AI Assistant
- Natural language understanding for substation operations queries
- Asset health monitoring capabilities
- Maintenance schedule tracking
- Real-time data access
- Safety guidelines lookup
- Spare parts inventory checking 